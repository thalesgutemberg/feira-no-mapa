-- Feira no Mapa: schema do MVP.
-- Regra central: uma barraca só aparece no mapa do dia depois que a etiqueta NFC dela é lida
-- na montagem. A leitura grava uma "presença" ligando a barraca a uma vaga da planta.

-- ===================================================================== tabelas

create table public.feiras (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  nome        text not null,
  endereco    text,
  horario     text,
  origem_lat  double precision not null,   -- canto superior esquerdo da planta
  origem_lng  double precision not null,
  planta      jsonb not null,              -- largura, altura, corredores, ruas, entrada, pontos de referência
  criada_em   timestamptz not null default now()
);

-- Vagas demarcadas no chão. A posição vem da planta (metros), não do GPS: o GPS só serve para sugerir a vaga.
create table public.vagas (
  id        uuid primary key default gen_random_uuid(),
  feira_id  uuid not null references public.feiras(id) on delete cascade,
  codigo    text not null,                 -- ex: C-05 (fileira C, vaga 5)
  fileira   text not null,
  corredor  smallint not null,
  lado      text not null check (lado in ('oeste', 'leste')),
  ordem     integer not null,
  x_m       real not null,
  y_m       real not null,
  larg_m    real not null,
  alt_m     real not null,
  unique (feira_id, codigo)
);

create table public.barracas (
  id               uuid primary key default gen_random_uuid(),
  feira_id         uuid not null references public.feiras(id) on delete cascade,
  numero           integer not null,       -- o mesmo da placa física
  nome             text not null check (length(trim(nome)) > 0),
  categoria        text not null check (categoria in ('hortifruti', 'comida', 'carnes', 'artesanato', 'outros')),
  icone            text not null default '🛒',
  produtos         text[] not null default '{}',
  pagamentos       text[] not null default '{}' check (pagamentos <@ array['pix', 'cartao', 'dinheiro']),
  vaga_habitual_id uuid references public.vagas(id) on delete set null,
  atualizada_em    timestamptz not null default now(),
  unique (feira_id, numero)
);

-- Uma etiqueta por barraca. O UID é o número de série gravado de fábrica no chip.
create table public.etiquetas_nfc (
  uid           text primary key check (uid = upper(uid)),
  barraca_id    uuid not null unique references public.barracas(id) on delete cascade,
  vinculada_em  timestamptz not null default now()
);

create table public.montagens (
  id          uuid primary key default gen_random_uuid(),
  feira_id    uuid not null references public.feiras(id) on delete cascade,
  data        date not null,
  iniciada_em timestamptz not null default now(),
  unique (feira_id, data)
);

create table public.presencas (
  id           uuid primary key default gen_random_uuid(),
  montagem_id  uuid not null references public.montagens(id) on delete cascade,
  barraca_id   uuid not null references public.barracas(id) on delete cascade,
  vaga_id      uuid not null references public.vagas(id),
  lat          double precision,
  lng          double precision,
  precisao_m   real,
  lido_em      timestamptz not null default now(),
  lido_por     uuid references auth.users(id) on delete set null,
  unique (montagem_id, barraca_id),         -- a barraca está em um lugar só
  unique (montagem_id, vaga_id)             -- e a vaga tem uma barraca só
);
create index presencas_montagem_idx on public.presencas (montagem_id);

create table public.organizadores (
  user_id   uuid not null references auth.users(id) on delete cascade,
  feira_id  uuid not null references public.feiras(id) on delete cascade,
  primary key (user_id, feira_id)
);

-- ===================================================================== funções auxiliares

create or replace function public.hoje_sp() returns date
language sql stable as $$
  select (now() at time zone 'America/Sao_Paulo')::date
$$;

create or replace function public.e_organizador(p_feira uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from organizadores where user_id = auth.uid() and feira_id = p_feira)
$$;

create or replace function public.tocar_atualizada_em() returns trigger
language plpgsql as $$
begin
  new.atualizada_em := now();
  return new;
end $$;

create trigger barracas_atualizada_em before update on public.barracas
  for each row execute function public.tocar_atualizada_em();

-- ===================================================================== RPCs do organizador

-- Registra a leitura de uma etiqueta: a barraca passa a existir no mapa de hoje, na vaga escolhida.
-- Recebe o UID (e não o id da barraca) para que só uma leitura de etiqueta coloque a barraca no mapa.
create or replace function public.registrar_leitura(
  p_uid text, p_vaga uuid, p_lat double precision default null,
  p_lng double precision default null, p_precisao real default null
) returns public.presencas
language plpgsql security definer set search_path = public as $$
declare
  v_barraca  barracas;
  v_montagem uuid;
  v_presenca presencas;
begin
  select b.* into v_barraca
    from etiquetas_nfc e join barracas b on b.id = e.barraca_id
   where e.uid = upper(p_uid);
  if not found then
    raise exception 'ETIQUETA_DESCONHECIDA' using errcode = 'P0001';
  end if;
  if not e_organizador(v_barraca.feira_id) then
    raise exception 'SEM_PERMISSAO' using errcode = '42501';
  end if;
  if not exists (select 1 from vagas where id = p_vaga and feira_id = v_barraca.feira_id) then
    raise exception 'VAGA_INVALIDA' using errcode = 'P0001';
  end if;

  insert into montagens (feira_id, data) values (v_barraca.feira_id, hoje_sp())
    on conflict (feira_id, data) do nothing;
  select id into v_montagem from montagens where feira_id = v_barraca.feira_id and data = hoje_sp();

  if exists (select 1 from presencas
              where montagem_id = v_montagem and vaga_id = p_vaga and barraca_id <> v_barraca.id) then
    raise exception 'VAGA_OCUPADA' using errcode = 'P0001';
  end if;

  insert into presencas (montagem_id, barraca_id, vaga_id, lat, lng, precisao_m, lido_por)
  values (v_montagem, v_barraca.id, p_vaga, p_lat, p_lng, p_precisao, auth.uid())
  on conflict (montagem_id, barraca_id) do update
    set vaga_id = excluded.vaga_id, lat = excluded.lat, lng = excluded.lng,
        precisao_m = excluded.precisao_m, lido_em = now(), lido_por = excluded.lido_por
  returning * into v_presenca;
  return v_presenca;
end $$;

-- Tira a barraca do mapa de hoje (leitura feita por engano).
create or replace function public.desfazer_leitura(p_barraca uuid) returns void
language plpgsql security definer set search_path = public as $$
declare v_feira uuid;
begin
  select feira_id into v_feira from barracas where id = p_barraca;
  if v_feira is null or not e_organizador(v_feira) then
    raise exception 'SEM_PERMISSAO' using errcode = '42501';
  end if;
  delete from presencas p using montagens m
   where p.montagem_id = m.id and m.feira_id = v_feira and m.data = hoje_sp() and p.barraca_id = p_barraca;
end $$;

-- Liga uma etiqueta a uma barraca, substituindo a etiqueta anterior dela.
create or replace function public.vincular_etiqueta(p_barraca uuid, p_uid text) returns public.etiquetas_nfc
language plpgsql security definer set search_path = public as $$
declare
  v_feira uuid;
  v_etiqueta etiquetas_nfc;
begin
  select feira_id into v_feira from barracas where id = p_barraca;
  if v_feira is null or not e_organizador(v_feira) then
    raise exception 'SEM_PERMISSAO' using errcode = '42501';
  end if;
  if exists (select 1 from etiquetas_nfc where uid = upper(p_uid) and barraca_id <> p_barraca) then
    raise exception 'ETIQUETA_EM_USO' using errcode = 'P0001';
  end if;
  delete from etiquetas_nfc where barraca_id = p_barraca;
  insert into etiquetas_nfc (uid, barraca_id) values (upper(p_uid), p_barraca)
    returning * into v_etiqueta;
  return v_etiqueta;
end $$;

revoke execute on function public.registrar_leitura(text, uuid, double precision, double precision, real) from public, anon;
revoke execute on function public.desfazer_leitura(uuid) from public, anon;
revoke execute on function public.vincular_etiqueta(uuid, text) from public, anon;
grant execute on function public.registrar_leitura(text, uuid, double precision, double precision, real) to authenticated;
grant execute on function public.desfazer_leitura(uuid) to authenticated;
grant execute on function public.vincular_etiqueta(uuid, text) to authenticated;

-- ===================================================================== RLS
-- Leitura pública do mapa. Escrita só por organizador da feira, e presenças/etiquetas só pelas RPCs.

alter table public.feiras        enable row level security;
alter table public.vagas         enable row level security;
alter table public.barracas      enable row level security;
alter table public.etiquetas_nfc enable row level security;
alter table public.montagens     enable row level security;
alter table public.presencas     enable row level security;
alter table public.organizadores enable row level security;

create policy "mapa público: feiras"    on public.feiras    for select to anon, authenticated using (true);
create policy "mapa público: vagas"     on public.vagas     for select to anon, authenticated using (true);
create policy "mapa público: barracas"  on public.barracas  for select to anon, authenticated using (true);
create policy "mapa público: montagens" on public.montagens for select to anon, authenticated using (true);
create policy "mapa público: presenças" on public.presencas for select to anon, authenticated using (true);

create policy "organizador edita barracas" on public.barracas for update to authenticated
  using (public.e_organizador(feira_id)) with check (public.e_organizador(feira_id));
create policy "organizador cadastra barracas" on public.barracas for insert to authenticated
  with check (public.e_organizador(feira_id));

-- UIDs não são segredo, mas não há motivo para expor a lista inteira.
create policy "organizador vê etiquetas" on public.etiquetas_nfc for select to authenticated
  using (public.e_organizador((select feira_id from public.barracas b where b.id = barraca_id)));

create policy "organizador vê o próprio vínculo" on public.organizadores for select to authenticated
  using (user_id = auth.uid());

-- ===================================================================== tempo real
-- O mapa do cliente se atualiza sozinho quando uma etiqueta é lida.
alter publication supabase_realtime add table public.presencas;
