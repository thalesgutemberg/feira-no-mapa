// Rota a pé pelos corredores: ninguém atravessa barraca. O caminho sai do ponto atual,
// vai até a rua do topo ou da base, entra no corredor da barraca e para em frente a ela.
import { distancia } from './geo.js';

const corredorDa = (planta, vaga) => planta.corredores.find(c => c.numero === vaga.corredor);

export function frenteDaVaga(planta, vaga) {
  return { x: corredorDa(planta, vaga).cx, y: vaga.y_m + vaga.alt_m / 2 };
}

export const comprimento = pts => pts.slice(1).reduce((t, p, i) => t + distancia(pts[i], p), 0);

/** Metros a pé até a vaga, ou null se não há posição de origem ou a barraca não está no mapa. */
export const metrosAte = (planta, origem, vaga) => (origem && vaga ? comprimento(calcularRota(planta, origem, vaga)) : null);

export function calcularRota(planta, origem, vaga) {
  const destino = frenteDaVaga(planta, vaga);
  const c = corredorDa(planta, vaga);
  const noCorredor = origem.x >= c.x0 - 0.6 && origem.x <= c.x1 + 0.6;
  if (noCorredor) return [origem, { x: c.cx, y: origem.y }, destino].filter((p, i, a) => i === 0 || distancia(a[i - 1], p) > 0.05);
  const opcoes = [planta.ruaTopo.cy, planta.ruaBase.cy].map(ry =>
    [origem, { x: origem.x, y: ry }, { x: c.cx, y: ry }, destino].filter((p, i, a) => i === 0 || distancia(a[i - 1], p) > 0.05));
  return opcoes.sort((a, b) => comprimento(a) - comprimento(b))[0];
}

export function pontoNaRota(pts, metros) {
  for (let i = 1; i < pts.length; i++) {
    const trecho = distancia(pts[i - 1], pts[i]);
    if (metros <= trecho) {
      const k = trecho ? metros / trecho : 0;
      return { x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * k, y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * k };
    }
    metros -= trecho;
  }
  return { ...pts[pts.length - 1] };
}

/** Ângulo do trecho atual, em graus, com 0 = para cima no mapa. */
export function direcaoInicial(pts) {
  if (pts.length < 2) return 0;
  const dx = pts[1].x - pts[0].x, dy = pts[1].y - pts[0].y;
  return Math.atan2(dx, -dy) * 180 / Math.PI;
}

/** Instrução em linguagem de feira para a rota restante. */
export function instrucao(pts, vaga, barraca) {
  const total = comprimento(pts);
  const ultimo = pts.length >= 2 ? pts[pts.length - 1].y - pts[pts.length - 2].y : 0;
  // andando para o norte (y diminui), a fileira a oeste do corredor fica à esquerda
  const lado = ultimo === 0 ? null : (ultimo < 0) === (vaga.lado === 'oeste') ? 'esquerda' : 'direita';
  if (total < 4) return { chegou: true, metros: 0, texto: lado ? `${barraca.nome} está à sua ${lado}.` : `${barraca.nome} está aqui.` };
  if (pts.length > 2) {
    const a = { x: pts[1].x - pts[0].x, y: pts[1].y - pts[0].y };
    const b = { x: pts[2].x - pts[1].x, y: pts[2].y - pts[1].y };
    const vira = a.x * b.y - a.y * b.x < 0 ? 'esquerda' : 'direita';
    const ate = Math.round(distancia(pts[0], pts[1]));
    const onde = Math.abs(b.y) > Math.abs(b.x) ? ` no Corredor ${vaga.corredor}` : '';
    if (ate >= 2) return { chegou: false, metros: Math.round(total), texto: `Siga ${ate} m e vire à ${vira}${onde}.` };
  }
  return { chegou: false, metros: Math.round(total), texto: `Siga pelo Corredor ${vaga.corredor}. A barraca fica na fileira ${vaga.fileira}${lado ? `, à sua ${lado}` : ''}.` };
}
