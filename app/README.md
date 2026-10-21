# Feira no Mapa: MVP

React (JavaScript) + Vite + Supabase. Mapa de uma feira com 100 barracas, onde **cada barraca só aparece no mapa do dia depois que a etiqueta NFC dela é lida** na montagem.

## Rodar

```bash
npm install
npm run dev
```

Abra `http://localhost:5173`. Sem configurar nada, o app roda em **modo demonstração**: os dados fictícios ficam no navegador (localStorage) e seguem as mesmas regras do banco. Abra o mapa do cliente numa aba e a montagem em outra: ler uma etiqueta numa aba atualiza o mapa na outra.

Para testar no celular na mesma rede, use o endereço `Network` que o Vite mostra. A leitura NFC de verdade exige HTTPS (ou localhost) e o Chrome do Android.

## Como funciona

| Quem | O quê |
|---|---|
| Cliente | Mapa com as barracas lidas hoje, busca por produto, detalhe da barraca e navegação pelos corredores |
| Organizador | Montagem do mapa por NFC, cadastro das barracas e vínculo de etiquetas |

**A montagem, passo a passo:**

1. O organizador encosta o celular na etiqueta da barraca. O app lê o UID do chip (Web NFC).
2. O UID identifica a barraca (`etiquetas_nfc`).
3. O app lê o GPS e sugere as vagas livres mais próximas, com a vaga de costume da barraca entre as opções.
4. O organizador confirma a vaga olhando a placa no chão. O GPS erra de 3 a 10 m, então ele só sugere.
5. A RPC `registrar_leitura` grava a presença. O mapa do cliente se atualiza em tempo real.

Barraca sem leitura no dia aparece para o cliente como "não veio hoje", com sugestões de barracas parecidas.

**A planta:** a feira tem vagas demarcadas (fileiras A a F, três corredores), guardadas em metros na tabela `vagas`. O mapa é desenhado a partir delas, não do GPS. GPS e planta se conectam por um ponto de origem (`feiras.origem_lat/lng`).

## Ligar o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. No SQL Editor, rode `supabase/migrations/0001_schema.sql` e depois `supabase/seed.sql`.
3. Em Authentication > Users, crie o usuário do organizador. Depois dê a ele acesso à feira:
   ```sql
   insert into organizadores (user_id, feira_id)
   select id, (select id from feiras where slug = 'praca-central') from auth.users where email = 'seu-email@exemplo.com';
   ```
4. Copie `.env.example` para `.env` e preencha `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` (Project Settings > API).
5. `npm run dev` de novo. A faixa "Demonstração" some e a área do organizador passa a pedir login.

Para regenerar o seed depois de mudar `src/data/mock.js`: `npm run seed:sql`.

### Segurança (RLS)

- Qualquer pessoa lê feira, vagas, barracas e presenças: o mapa é público.
- Só organizadores da feira editam barracas e veem as etiquetas.
- Presenças e etiquetas só mudam pelas RPCs (`registrar_leitura`, `desfazer_leitura`, `vincular_etiqueta`), que conferem o vínculo de organizador. `registrar_leitura` recebe o UID da etiqueta, e não o id da barraca, para que só a leitura de uma etiqueta coloque a barraca no mapa.

## Estrutura

```
src/
  lib/          planta, geo (GPS <-> metros), rota pelos corredores, NFC, busca
  data/         mock.js (100 barracas), mockAdapter, supabaseAdapter, contextos
  components/   FeiraMap (SVG com zoom e arraste), BottomSheet, cards, avisos
  pages/        telas do cliente e do organizador
supabase/
  migrations/   schema, RLS, RPCs, tempo real
  seed.sql      gerado por scripts/gerar-seed.mjs
```

## Limitações conhecidas

- **NFC só no Chrome do Android.** No iPhone e no computador, a montagem usa o simulador. Se o organizador usar iPhone, vai precisar de app nativo ou de QR code no lugar da etiqueta.
- **A planta considera a feira alinhada ao norte.** Para uma rua inclinada, falta uma rotação em `lib/geo.js`.
- **A seta da navegação aponta no sentido do mapa.** Ainda não gira com a bússola do celular.
- **Os ícones são emoji**, que mudam de desenho entre sistemas.
- **Na demonstração, sem GPS dentro da feira, a posição é simulada** (cliente na entrada, leitura perto da vaga de costume). O app avisa isso na tela.
- O SQL foi testado num Postgres embutido (PGlite) com stubs de `auth`. Ainda não rodou num projeto Supabase de verdade, então o tempo real e o login não foram testados de ponta a ponta.
