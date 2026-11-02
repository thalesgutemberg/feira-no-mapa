# Feira no Mapa

Mapa digital para feiras de rua. O cliente escaneia um QR code na entrada, vê todas as barracas no mapa, busca por produto ("pastel", "orgânicos", "aceita Pix") e recebe a direção e a distância até a barraca.

> **Status:** este repositório tem duas partes.
> - **Protótipo** (`index.html`, publicado no GitHub Pages): design system e telas, com dados fictícios.
> - **MVP** (pasta [`app/`](app/)): React + Supabase, com 100 barracas fictícias e montagem do mapa por NFC. Veja o [README do app](app/README.md).

## Como abrir

**Online:** https://thalesgutemberg.github.io/feira-no-mapa/

O protótipo é um único arquivo HTML, sem build e sem dependências. Para rodar localmente, abra o `index.html` no navegador. Para servir na rede local:

```bash
python -m http.server 8787
```

Depois acesse `http://localhost:8787`.

## O que tem no protótipo

**Design system:** cores com contraste WCAG calculado ao vivo, tipografia (Atkinson Hyperlegible), espaçamento, elevação, ícones e componentes com todos os estados.

**Telas navegáveis:**

| Fluxo | Telas |
|---|---|
| Cliente | Entrada e permissão de localização, mapa, busca, detalhe da barraca, navegação |
| Erros | GPS negado, sinal fraco, barraca que não veio |
| Organizador | Montagem do mapa lendo a etiqueta NFC de cada barraca |
| Feirante | Cadastro da barraca |

Ao lado de cada tela há uma nota explicando as decisões de design.

## Como o produto deve funcionar

- **Cada barraca tem uma etiqueta NFC.** Na montagem, o organizador encosta o celular na etiqueta e o app grava o ID da barraca com a posição GPS daquele momento. Barraca sem leitura no dia aparece como "não veio hoje".
- **O cliente se localiza pelo GPS do próprio celular.** Ao ar livre, a precisão fica entre 3 e 10 m, suficiente para o caso de uso.
- **Site, não app.** O cliente abre pelo QR code, sem instalar nada.

### Por que não RFID nem beacons

- Celulares não leem RFID UHF. Só leem NFC, a uns 4 cm, e por isso a etiqueta serve para identificar a barraca, não para localizar ninguém.
- Beacons BLE dariam precisão melhor, mas exigem app nativo, porque o navegador do iPhone não escaneia Bluetooth. Eles só entram se a feira for coberta ou se o GPS se mostrar insuficiente em campo.

## Limitações conhecidas

- A leitura NFC pelo navegador só funciona no Chrome do Android.
- No protótipo, os ícones das barracas são emoji, que mudam de desenho entre sistemas. Para produção, o plano é um conjunto de ícones próprio.
- A seta da navegação aponta no sentido do mapa. No produto, ela precisa girar com a bússola do celular, e isso ainda precisa ser testado em campo.

## Próximos passos

1. Testar o protótipo com frequentadores de uma feira real, ao ar livre.
2. Medir a precisão do GPS nos corredores da feira.
3. Definir o MVP: cadastro das barracas, montagem por NFC e mapa com dados reais.
