# Feira no Mapa: critérios de aceite

Versão de referência: commit `25c4db4`. Para contexto, veja o [README do app](../app/README.md) e o [schema](../app/supabase/migrations/0001_schema.sql).

**Decisão aceita em 2 de novembro de 2026:** identificar a barraca por uma URL com um código próprio, gravada na etiqueta NFC e impressa em QR code, em vez do UID de fábrica lido por Web NFC. A implementação está pendente (RN-11, AC-21 a AC-25).

## Como usar

**Regra de validação:** cada comportamento está ligado a um resultado verificável. Sem observar esse resultado no ambiente exigido, o fluxo não está validado. Código pronto ou tela aparente não bastam.

Para gerar uma spec a partir de um critério:

1. Use o ID no título da tarefa e cite as regras relacionadas.
2. Use "Critério" como teste de aceite e "Resultado exigido" como condição de conclusão.
3. Comece pelos arquivos de "Ponto de partida", que são uma referência e não um limite de escopo.
4. Registre como o resultado foi observado: ambiente, aparelho e evidência.
5. Atualize o estado aqui. Só marque como validado o que foi observado.

Os limites de 5 s, 30% e 80% são propostas e podem mudar antes do teste.

Nenhum critério foi validado em produção. Para considerar o MVP entregue, todos precisam passar em um projeto Supabase real e em aparelhos reais.

## Estados

| Estado | Significado |
|---|---|
| Validado em demo | Resultado observado no modo demonstração, com dados fictícios |
| Validado com simulação | Build em modo Supabase, com API e leitor NFC simulados no teste |
| Não testado | Implementado, sem resultado observado no ambiente exigido |
| Não implementado | Requisito definido, sem implementação |

| Estado atual | Critérios |
|---|---|
| Não implementado | 12 |
| Validado em demo | 8 |
| Não testado | 6 |
| Validado com simulação | 5 |

## Regras de negócio

| ID | Regra | Estado |
|---|---|---|
| RN-01 | A barraca só aparece no mapa do dia depois da leitura da etiqueta e da confirmação da vaga. | Implementada |
| RN-02 | Em um dia, a barraca ocupa uma única vaga, e a vaga recebe uma única barraca. | Implementada |
| RN-03 | O lugar da barraca no mapa vem da planta. O GPS só sugere vagas, porque erra mais que a frente de uma barraca. | Implementada |
| RN-04 | Quem decide a vaga é o organizador, conferindo a placa no chão. Ele pode digitar o código da vaga. | Implementada |
| RN-05 | Só o organizador daquela feira registra presenças e altera barracas. | Implementada |
| RN-06 | O mapa é público, sem login e sem instalação. | Implementada |
| RN-07 | A localização do cliente é opcional, e a posição dele não é guardada. | Implementada |
| RN-08 | Barraca sem leitura aparece como "não veio hoje", com sugestões parecidas. | Precisa de ajuste: é imprecisa durante a montagem |
| RN-09 | A presença vale para a data atual no fuso de São Paulo. | Implementada |
| RN-10 | Simulações existem só no modo demonstração. Em produção, nada é inventado. | Implementada |
| RN-11 | A barraca é identificada por uma URL, gravada na etiqueta NFC e impressa em QR code. | Decidida, não implementada |

## Cliente

### AC-01

Como cliente, quero abrir o mapa pelo QR code para ver a feira sem instalar nada.

- **Regras:** RN-01, 06
- **Estado:** Validado em demo
- **Critério:** **Dado** uma feira com presenças hoje, **quando** abro o link, **então** vejo o mapa sem login.
- **Resultado exigido:** o total exibido é igual ao número de presenças do dia (94 na demonstração).
- **Ponto de partida:** `app/src/pages/Entrada.jsx`, `app/src/pages/Mapa.jsx`, `app/src/data/FeiraContext.jsx`

### AC-02

Como cliente, quero buscar por produto para encontrar quem vende o que procuro.

- **Regras:** RN-06
- **Estado:** Validado em demo
- **Critério:** **Dado** a tela de busca, **quando** digito um produto, **então** vejo as barracas, com as presentes primeiro.
- **Resultado exigido:** "pastel" retorna 5 barracas, e "organico" encontra "orgânicos" (3).
- **Ponto de partida:** `app/src/pages/Busca.jsx`, `app/src/lib/categorias.js`

### AC-03

Como cliente, quero encontrar o produto mesmo no plural ou com erro de digitação.

- **Regras:** RN-06
- **Estado:** Não implementado
- **Critério:** **Dado** barracas que vendem pastel, **quando** busco "pasteis", "pastéis" ou "pastle", **então** elas aparecem.
- **Resultado exigido:** as 3 buscas retornam as mesmas barracas de "pastel". Hoje retornam 0.
- **Ponto de partida:** `app/src/lib/categorias.js`, `app/src/pages/Busca.jsx`

### AC-04

Como cliente, quero filtrar sem perder a orientação no mapa.

- **Regras:** RN-06
- **Estado:** Validado em demo
- **Critério:** **Dado** o mapa, **quando** escolho "Hortifruti", **então** as outras barracas ficam esmaecidas, sem sumir.
- **Resultado exigido:** a contagem muda (25 na demonstração), e o total de barracas desenhadas continua igual.
- **Ponto de partida:** `app/src/pages/Mapa.jsx`, `app/src/components/FeiraMap.jsx`

### AC-05

Como cliente, quero ser guiado até a barraca para não me perder.

- **Regras:** RN-03
- **Estado:** Validado em demo
- **Critério:** **Dado** uma posição dentro da feira, **quando** toco em "Ir até lá", **então** vejo a distância e a rota pelos corredores.
- **Resultado exigido:** a rota não atravessa barracas, e a tela mostra "Chegou!" a menos de 4 m. Em produção, vale com GPS real.
- **Ponto de partida:** `app/src/pages/Navegacao.jsx`, `app/src/lib/rota.js`

### AC-06

Como cliente sem GPS, quero usar o mapa sem receber informação falsa.

- **Regras:** RN-07, 10
- **Estado:** Validado com simulação
- **Critério:** **Dado** o modo Supabase, sem posição válida, **quando** abro o mapa ou a navegação, **então** não vejo meu marcador nem uma rota.
- **Resultado exigido:** a tela mostra vaga, corredor e aviso, e não aparece "Simular caminhada".
- **Ponto de partida:** `app/src/data/LocalizacaoContext.jsx`, `app/src/pages/Navegacao.jsx`, `app/src/components/Avisos.jsx`

### AC-07

Como cliente, quero que minha posição não seja guardada.

- **Regras:** RN-07
- **Estado:** Não testado
- **Critério:** **Dado** a localização ativa, **quando** uso o mapa, **então** minha posição só é usada no aparelho.
- **Resultado exigido:** nenhuma requisição do cliente contém latitude ou longitude.
- **Ponto de partida:** `app/src/data/LocalizacaoContext.jsx`, `app/src/data/supabaseAdapter.js`

### AC-08

Como cliente, quero saber se a barraca não veio para não perder a viagem.

- **Regras:** RN-08
- **Estado:** Validado em demo
- **Critério:** **Dado** uma barraca sem leitura e a montagem encerrada, **quando** abro a ficha, **então** vejo o aviso e opções parecidas.
- **Resultado exigido:** aparecem até 3 barracas presentes com produto ou categoria parecidos.
- **Ponto de partida:** `app/src/pages/DetalheBarraca.jsx`

### AC-09

Como cliente, não quero ler que a barraca faltou se a montagem ainda não terminou.

- **Regras:** RN-08
- **Estado:** Não implementado
- **Critério:** **Dado** uma montagem em andamento, **quando** abro uma barraca sem leitura, **então** vejo "ainda não registrada".
- **Resultado exigido:** "não veio hoje" só aparece depois que a montagem é encerrada.
- **Ponto de partida:** `app/src/pages/DetalheBarraca.jsx`, `app/src/pages/Busca.jsx`, `app/src/pages/Mapa.jsx`, `app/supabase/migrations/0001_schema.sql`

### AC-10

Como cliente, quero ver a barraca assim que ela for registrada, sem recarregar.

- **Regras:** RN-01
- **Estado:** Não testado
- **Critério:** **Dado** o mapa aberto, **quando** o organizador confirma uma leitura, **então** a barraca aparece.
- **Resultado exigido:** em outro aparelho, a barraca surge em até 5 s (limite proposto), via WebSocket. Na demonstração, passou entre abas.
- **Ponto de partida:** `app/src/data/FeiraContext.jsx`, `app/src/data/supabaseAdapter.js`

## Organizador

### AC-11

Como organizador, quero uma área protegida para que só pessoas autorizadas alterem o mapa.

- **Regras:** RN-05
- **Estado:** Não testado
- **Critério:** **Dado** uma pessoa sem sessão, **quando** abre a área do organizador, **então** vê o login.
- **Resultado exigido:** logado sem vínculo com a feira, recebe `SEM_PERMISSAO`, e nenhuma linha é gravada.
- **Ponto de partida:** `app/src/pages/organizador/AreaOrganizador.jsx`, `app/supabase/migrations/0001_schema.sql`

### AC-12

Como organizador, quero ler a etiqueta e confirmar a vaga para colocar a barraca no mapa.

- **Regras:** RN-01, 03, 04
- **Estado:** Validado com simulação
- **Critério:** **Dado** uma etiqueta vinculada e uma vaga livre, **quando** leio e confirmo, **então** a barraca entra no mapa.
- **Resultado exigido:** o progresso sobe 1 (de 94 para 95), e a RPC grava a vaga escolhida com a posição real do GPS.
- **Ponto de partida:** `app/src/pages/organizador/Montagem.jsx`, `app/src/data/supabaseAdapter.js`, `app/supabase/migrations/0001_schema.sql`

### AC-13

Como organizador, quero ler uma etiqueta física com o celular.

- **Regras:** RN-01
- **Estado:** Não testado
- **Critério:** **Dado** Chrome no Android e uma etiqueta real, **quando** encosto o celular, **então** a barraca certa é identificada.
- **Resultado exigido:** o fluxo do AC-12 passa com etiqueta real, em aparelho real, ao ar livre.
- **Ponto de partida:** `app/src/lib/nfc.js`, `app/src/pages/organizador/Montagem.jsx`

### AC-14

Como organizador, quero digitar a vaga quando a certa não estiver na lista.

- **Regras:** RN-04
- **Estado:** Validado com simulação
- **Critério:** **Dado** uma leitura em confirmação, **quando** digito "c 13", **então** a vaga `C-13` fica selecionada.
- **Resultado exigido:** a RPC recebe a vaga digitada. Código inexistente ou vaga ocupada são recusados com mensagem.
- **Ponto de partida:** `app/src/pages/organizador/Montagem.jsx`, `app/src/lib/planta.js`

### AC-15

Como organizador sem GPS, quero registrar sem gravar uma posição inventada.

- **Regras:** RN-10
- **Estado:** Validado com simulação
- **Critério:** **Dado** o modo Supabase e GPS indisponível, **quando** leio a etiqueta, **então** vejo um aviso e posso escolher a vaga.
- **Resultado exigido:** `p_lat`, `p_lng` e `p_precisao` são enviados como nulos.
- **Ponto de partida:** `app/src/pages/organizador/Montagem.jsx`

### AC-16

Como responsável pelo produto, quero impedir leituras simuladas em produção.

- **Regras:** RN-10
- **Estado:** Validado com simulação
- **Critério:** **Dado** o modo Supabase e um aparelho sem NFC, **quando** abro a montagem ou a edição, **então** vejo um aviso.
- **Resultado exigido:** não há simulador nem etiqueta aleatória, e não é possível registrar a leitura.
- **Ponto de partida:** `app/src/pages/organizador/Montagem.jsx`, `app/src/pages/organizador/EditarBarraca.jsx`

### AC-17

Como organizador, quero evitar duas barracas na mesma vaga.

- **Regras:** RN-02
- **Estado:** Não testado
- **Critério:** **Dado** uma vaga ocupada, **quando** dois aparelhos tentam registrá-la ao mesmo tempo, **então** só um consegue.
- **Resultado exigido:** há uma única presença, e o outro aparelho vê "vaga já tem outra barraca".
- **Ponto de partida:** `app/supabase/migrations/0001_schema.sql`, `app/src/data/erros.js`

### AC-18

Como organizador, quero desfazer uma leitura feita por engano.

- **Regras:** RN-01
- **Estado:** Validado em demo
- **Critério:** **Dado** uma leitura confirmada, **quando** toco em "Desfazer", **então** a barraca sai do mapa.
- **Resultado exigido:** o progresso volta (de 95 para 94), e o mapa aberto em outra aba passa a mostrar a barraca como ausente.
- **Ponto de partida:** `app/src/pages/organizador/Montagem.jsx`

### AC-19

Como organizador, quero editar os dados da barraca para manter a busca correta.

- **Regras:** RN-05
- **Estado:** Validado em demo
- **Critério:** **Dado** uma barraca, **quando** altero e salvo, **então** o cliente vê a mudança.
- **Resultado exigido:** o novo nome aparece na ficha. Nome vazio ou lista sem produto não são salvos.
- **Ponto de partida:** `app/src/pages/organizador/EditarBarraca.jsx`

### AC-20

Como organizador, quero ser avisado de uma etiqueta sem cadastro.

- **Regras:** RN-01
- **Estado:** Validado em demo
- **Critério:** **Dado** uma etiqueta não vinculada, **quando** a leio, **então** vejo a orientação para vincular.
- **Resultado exigido:** a barraca não entra no mapa, e nenhuma presença é criada.
- **Ponto de partida:** `app/src/pages/organizador/Montagem.jsx`

## Identificação por URL

### AC-21

Como organizador com iPhone, quero encostar na etiqueta para registrar a barraca.

- **Regras:** RN-11
- **Estado:** Não implementado
- **Critério:** **Dado** um iPhone XS ou mais novo e sessão ativa, **quando** toco a etiqueta e abro o link, **então** chego à confirmação da barraca certa.
- **Resultado exigido:** a presença é gravada com etiqueta real, em iPhone real.
- **Ponto de partida:** `app/src/lib/nfc.js`, `app/src/App.jsx`, `app/src/pages/organizador/Montagem.jsx`

### AC-22

Como organizador, quero usar o QR code se a etiqueta falhar.

- **Regras:** RN-11
- **Estado:** Não implementado
- **Critério:** **Dado** o QR code impresso da barraca, **quando** o leio com a câmera, **então** chego à mesma tela de confirmação.
- **Resultado exigido:** a presença é igual à gerada por NFC, inclusive sob sol.
- **Ponto de partida:** `app/src/App.jsx`, `app/src/pages/organizador/Montagem.jsx`, `app/src/pages/organizador/EditarBarraca.jsx`

### AC-23

Como cliente, quero ver a ficha da barraca ao escanear o QR code dela.

- **Regras:** RN-11, 06
- **Estado:** Não implementado
- **Critério:** **Dado** uma pessoa sem sessão, **quando** abre o link da barraca, **então** vê a ficha pública.
- **Resultado exigido:** nenhuma presença é criada, e o código não permite escrita.
- **Ponto de partida:** `app/src/App.jsx`, `app/src/pages/DetalheBarraca.jsx`, `app/supabase/migrations/0001_schema.sql`

### AC-24

Como organizador, quero preparar as etiquetas com segurança.

- **Regras:** RN-11
- **Estado:** Não implementado
- **Critério:** **Dado** uma barraca, **quando** gravo a etiqueta e a protejo, **então** o conteúdo fica fixo.
- **Resultado exigido:** uma tentativa de regravação falha, e a etiqueta continua levando à barraca certa.
- **Ponto de partida:** `app/src/pages/organizador/EditarBarraca.jsx`, `app/src/lib/nfc.js`

### AC-25

Como responsável pelo produto, quero saber se o chip compensa.

- **Regras:** RN-11
- **Estado:** Não implementado
- **Critério:** **Dado** 20 barracas por método, ao ar livre e em aparelhos reais, **quando** cronometro NFC e QR code, **então** tenho a comparação.
- **Resultado exigido:** tempo e falhas registrados. O NFC só fica se for pelo menos 30% mais rápido, sem falhar mais (limite proposto).
- **Ponto de partida:** Sem código: atividade de campo ou de produto

## Plataforma e segurança

### AC-26

Como time, quero subir o banco em um projeto novo sem ajustes manuais.

- **Regras:** RN-06
- **Estado:** Não testado
- **Critério:** **Dado** um projeto Supabase novo, **quando** aplico as migrations, **então** o mapa carrega como `anon`.
- **Resultado exigido:** os `GET` públicos retornam 200, e não `42501`.
- **Ponto de partida:** `app/supabase/migrations/0001_schema.sql`

### AC-27

Como time, quero testes de RLS reproduzíveis para detectar regressões.

- **Regras:** RN-05
- **Estado:** Não implementado
- **Critério:** **Dado** a suíte versionada, **quando** ela roda como `anon` e `authenticated`, **então** todas as permissões de cada tabela são conferidas, conforme as políticas e RPCs do schema.
- **Resultado exigido:** escrita de `anon` e de usuário sem vínculo é recusada, e a suíte roda no CI.
- **Ponto de partida:** `app/supabase/migrations/0001_schema.sql`, `app/supabase/tests/` (a criar), `.github/workflows/` (a criar)

### AC-28

Como organizador, não quero minha posição e meu identificador públicos.

- **Regras:** RN-05
- **Estado:** Não implementado
- **Critério:** **Dado** uma requisição `anon`, **quando** consulta presenças, **então** recebe só o necessário para o mapa.
- **Resultado exigido:** pedir `lat`, `lng` ou `lido_por` como `anon` é recusado.
- **Ponto de partida:** `app/supabase/migrations/0001_schema.sql`, `app/src/data/supabaseAdapter.js`

## Validação do produto

### AC-29

Como responsável pelo produto, quero confirmar que o mapa ajuda de verdade.

- **Regras:** Todas
- **Estado:** Não implementado
- **Critério:** **Dado** 3 a 5 frequentadores em uma feira real, sob sol, **quando** pedem um produto, **então** usam o site sem ajuda.
- **Resultado exigido:** pelo menos 80% chegam à barraca certa sem ajuda (limite proposto), e fica registrado se usaram a busca ou a navegação.
- **Ponto de partida:** Sem código: atividade de campo ou de produto

### AC-30

Como time, quero medir o GPS real para validar a sugestão de vagas.

- **Regras:** RN-03
- **Estado:** Não implementado
- **Critério:** **Dado** uma feira real, **quando** registro a posição em vagas conhecidas, **então** tenho o erro medido.
- **Resultado exigido:** erro mediano registrado, comparado aos 3 a 10 m assumidos.
- **Ponto de partida:** Sem código: atividade de campo ou de produto

### AC-31

Como responsável pelo produto, quero definir quem paga antes de investir em operação.

- **Regras:** Negócio
- **Estado:** Não implementado
- **Critério:** **Dado** os possíveis pagadores, **quando** converso com eles, **então** tenho uma decisão registrada.
- **Resultado exigido:** ao menos um pagador confirma interesse e condição, em nota no projeto.
- **Ponto de partida:** Sem código: atividade de campo ou de produto
