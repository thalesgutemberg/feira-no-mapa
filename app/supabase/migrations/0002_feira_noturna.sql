-- Feira noturna: cardápio por barraca e categorias de feira gastronômica.

-- Itens e preços, no formato [{"nome": "Smash clássico", "preco": 28}]. Preço em reais.
alter table public.barracas
  add column cardapio jsonb not null default '[]'::jsonb
  check (jsonb_typeof(cardapio) = 'array');

alter table public.barracas drop constraint barracas_categoria_check;
alter table public.barracas
  add constraint barracas_categoria_check
  check (categoria in ('comida', 'bebidas', 'doces', 'artesanato', 'outros'));
