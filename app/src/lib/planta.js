// Planta da feira em metros. Origem no canto superior esquerdo: x cresce para leste, y para sul.
// Três corredores, cada um com uma fileira de vagas de cada lado. A entrada fica no fim do corredor do meio.
// O resultado vai para o banco (feiras.planta e tabela vagas) pelo seed; o app desenha a partir do banco.

const FILEIRAS = [
  { letra: 'A', vagas: 17, corredor: 1, lado: 'oeste' }, { letra: 'B', vagas: 17, corredor: 1, lado: 'leste' },
  { letra: 'C', vagas: 17, corredor: 2, lado: 'oeste' }, { letra: 'D', vagas: 17, corredor: 2, lado: 'leste' },
  { letra: 'E', vagas: 16, corredor: 3, lado: 'oeste' }, { letra: 'F', vagas: 16, corredor: 3, lado: 'leste' },
];
const PROFUNDIDADE = 5;   // fundo da barraca
const CORREDOR = 3.5;     // largura do corredor
const COSTAS = 0.6;       // espaço entre fileiras de costas uma para a outra
const MARGEM = 1;
const PASSO = 3.3;        // distância entre o início de uma vaga e o da próxima
const FRENTE = 3;         // frente da barraca, voltada para o corredor
const RUA = 3.5;          // ruas transversais no topo e na base

const r2 = n => Math.round(n * 100) / 100;

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
  const topoFileiras = RUA + 0.5;
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
    ruaTopo: { y0: 0, y1: RUA, cy: r2(RUA / 2) },
    ruaBase: { y0: r2(ruaBaseY0), y1: altura, cy: r2(ruaBaseY0 + RUA / 2) },
    corredores,
    entrada: { x: meio.cx, y: r2(ruaBaseY0 + RUA / 2) },
    pontos: [
      { icone: '🚻', nome: 'Banheiros', x: 1 },
      { icone: 'ℹ️', nome: 'Informações', x: r2(largura / 2 - 3.4) },
      { icone: '🏧', nome: 'Caixa 24h', x: r2(largura - 7.4) },
    ],
  };
  return { planta, vagas };
}
