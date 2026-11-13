// Planta da feira em metros. Origem no canto superior esquerdo: x cresce para leste, y para sul.
// No topo fica a praça (palco e mesas). Abaixo dela, três corredores, cada um com uma fileira de vagas
// de cada lado. A entrada fica no fim do corredor do meio.
// O resultado vai para o banco (feiras.planta e tabela vagas) pelo seed; o app desenha a partir do banco.

const FILEIRAS = [
  { letra: 'A', vagas: 13, corredor: 1, lado: 'oeste' }, { letra: 'B', vagas: 13, corredor: 1, lado: 'leste' },
  { letra: 'C', vagas: 14, corredor: 2, lado: 'oeste' }, { letra: 'D', vagas: 14, corredor: 2, lado: 'leste' },
  { letra: 'E', vagas: 13, corredor: 3, lado: 'oeste' }, { letra: 'F', vagas: 13, corredor: 3, lado: 'leste' },
];
const PROFUNDIDADE = 5;   // fundo da barraca
const CORREDOR = 3.5;     // largura do corredor
const COSTAS = 0.6;       // espaço entre fileiras de costas uma para a outra
const MARGEM = 1;
const PASSO = 3.3;        // distância entre o início de uma vaga e o da próxima
const FRENTE = 3;         // frente da barraca, voltada para o corredor
const RUA = 3.5;          // ruas transversais no topo e na base
const PRACA = 13;         // faixa da praça acima da rua do topo: palco e mesas

const r2 = n => Math.round(n * 100) / 100;

/** Acha a vaga pelo código da placa, aceitando como a pessoa digita: "c5", "C 05" ou "c-05". */
export function acharVagaPorCodigo(vagas, texto) {
  const m = texto.trim().toUpperCase().match(/^([A-Z])[\s-]*(\d{1,2})$/);
  if (!m) return null;
  const codigo = `${m[1]}-${m[2].padStart(2, '0')}`;
  return vagas.find(v => v.codigo === codigo) ?? null;
}

export function gerarPlanta() {
  const corredores = [];
  const fileiras = [];
  let x = MARGEM;
  FILEIRAS.forEach((f, i) => {
    fileiras.push({ ...f, x });
    x += PROFUNDIDADE;
    if (i % 2 === 0) {
      corredores.push({ numero: f.corredor, x0: r2(x), x1: r2(x + CORREDOR), cx: r2(x + CORREDOR / 2) });
      x += CORREDOR;
    } else if (i < FILEIRAS.length - 1) {
      x += COSTAS;
    }
  });
  const largura = r2(x + MARGEM);
  const topoFileiras = PRACA + RUA + 0.5;
  const baseFileiras = topoFileiras + Math.max(...FILEIRAS.map(f => f.vagas)) * PASSO;
  const ruaBaseY0 = baseFileiras + 0.4;
  const altura = r2(ruaBaseY0 + RUA + 0.6);

  const vagas = [];
  fileiras.forEach(f => {
    for (let r = 0; r < f.vagas; r++) {
      vagas.push({
        codigo: `${f.letra}-${String(r + 1).padStart(2, '0')}`,
        fileira: f.letra, corredor: f.corredor, lado: f.lado, ordem: vagas.length,
        x_m: r2(f.x), y_m: r2(baseFileiras - (r + 1) * PASSO + (PASSO - FRENTE) / 2),
        larg_m: PROFUNDIDADE, alt_m: FRENTE,
      });
    }
  });

  const meio = corredores[Math.floor(corredores.length / 2)];
  const planta = {
    largura, altura,
    praca: { y0: 0, y1: PRACA },
    areas: [
      { tipo: 'palco', nome: 'Palco', x: r2(largura / 2 - 7), y: 1.2, larg: 14, alt: 4 },
      { tipo: 'mesas', nome: 'Mesas', x: 7, y: 6.6, larg: r2(largura - 14), alt: 5.4 },
    ],
    arvores: [
      { x: 3, y: 7.2 }, { x: 3.4, y: 11 }, { x: r2(largura - 3), y: 7.2 }, { x: r2(largura - 3.4), y: 11 },
      { x: r2(largura / 2 - 10.5), y: 3.2 }, { x: r2(largura / 2 + 10.5), y: 3.2 },
    ],
    ruaTopo: { y0: PRACA, y1: PRACA + RUA, cy: r2(PRACA + RUA / 2) },
    ruaBase: { y0: r2(ruaBaseY0), y1: altura, cy: r2(ruaBaseY0 + RUA / 2) },
    corredores,
    entrada: { x: meio.cx, y: r2(ruaBaseY0 + RUA / 2) },
    pontos: [
      { icone: '🚻', nome: 'Banheiros', x: 1, y: 2.2 },
      { icone: '🏧', nome: 'Caixa 24h', x: r2(largura - 7.4), y: 2.2 },
      { icone: 'ℹ️', nome: 'Informações', x: r2(meio.cx - 9.4), y: r2(ruaBaseY0 + RUA / 2) },
    ],
  };
  return { planta, vagas };
}
