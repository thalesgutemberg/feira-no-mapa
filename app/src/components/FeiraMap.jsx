// Mapa da feira em SVG, com a planta em metros como sistema de coordenadas.
// Cada vaga com leitura de etiqueta hoje vira uma barraca desenhada (toldo, ícone, nome);
// vaga sem leitura aparece só como contorno tracejado. Arrastar move, pinça/roda/botões dão zoom.
import { useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import { corDa, tomDa } from '../lib/categorias.js';

const NOMES_ATE = 26;     // largura visível (m) até a qual os nomes aparecem
const PERTO = 16;         // um corredor com as duas fileiras
const MIN_W = 8;

function quebrarNome(txt, max = 11, linhas = 3) {
  const saida = [];
  let atual = '';
  txt.split(' ').forEach(p => {
    if (!atual) atual = p;
    else if ((atual + ' ' + p).length <= max) atual += ' ' + p;
    else { saida.push(atual); atual = p; }
  });
  if (atual) saida.push(atual);
  if (saida.length > linhas) { saida.length = linhas; saida[linhas - 1] += '…'; }
  return saida;
}

function TileBarraca({ vaga, barraca, estado, nomes, onClick }) {
  const { x_m: x, y_m: y, larg_m: w, alt_m: h } = vaga;
  const cor = corDa(barraca.categoria);
  const contorno = estado === 'destaque' ? 'var(--sun)' : cor;
  const espessura = estado === 'destaque' ? 0.28 : estado === 'selecionada' ? 0.2 : 0.1;
  const listras = [];
  for (let i = 0; i < 10; i += 2) {
    listras.push(<rect key={`r${i}`} x={x + i * 0.5} y={y} width={0.5} height={0.5} style={{ fill: cor }} />);
    listras.push(<circle key={`c${i}`} cx={x + i * 0.5 + 0.25} cy={y + 0.5} r={0.25} style={{ fill: cor }} />);
  }
  const linhas = nomes ? quebrarNome(barraca.nome) : [];
  const ty = y + 1.75 - (linhas.length - 1) * 0.31 + 0.2;
  return (
    <g className="barraca" opacity={estado === 'apagada' ? 0.22 : 1} onClick={onClick} role="button" aria-label={`${barraca.numero} ${barraca.nome}`}>
      <rect x={x} y={y} width={w} height={h} rx={0.25} style={{ fill: estado === 'selecionada' ? tomDa(barraca.categoria) : '#fff' }} />
      {listras}
      {nomes ? (
        <>
          <text x={x + 0.8} y={y + 2.15} fontSize={1.05} textAnchor="middle" className="emo">{barraca.icone}</text>
          <text x={x + 1.55} y={ty} fontSize={0.56} style={{ fill: 'var(--ink)' }}>
            {linhas.map((l, i) => <tspan key={i} x={x + 1.55} dy={i ? 0.62 : 0}>{l}</tspan>)}
          </text>
          <rect x={x + w - 1.15} y={y + 0.05} width={1.1} height={0.62} rx={0.15} style={{ fill: 'var(--ink)' }} />
          <text x={x + w - 0.6} y={y + 0.52} fontSize={0.46} textAnchor="middle" fill="#fff">{barraca.numero}</text>
        </>
      ) : (
        <>
          <text x={x + 1.5} y={y + 2.4} fontSize={1.35} textAnchor="middle" className="emo">{barraca.icone}</text>
          <text x={x + 3.6} y={y + 2.25} fontSize={0.95} textAnchor="middle" style={{ fill: 'var(--ink)' }}>{barraca.numero}</text>
        </>
      )}
      <rect x={x} y={y} width={w} height={h} rx={0.25} fill="none" style={{ stroke: contorno }} strokeWidth={espessura} />
    </g>
  );
}

function VagaLivre({ vaga, nomes, marcada, opcao }) {
  const { x_m: x, y_m: y, larg_m: w, alt_m: h } = vaga;
  return (
    <g>
      <rect x={x + 0.08} y={y + 0.08} width={w - 0.16} height={h - 0.16} rx={0.25}
        fill={marcada ? 'var(--sun-tint)' : 'rgba(255,255,255,.35)'}
        style={{ stroke: marcada ? 'var(--ink)' : opcao ? 'var(--info)' : '#B5AB96' }}
        strokeWidth={marcada ? 0.22 : opcao ? 0.14 : 0.07} strokeDasharray={marcada ? 'none' : '0.3 0.2'} />
      {(nomes || marcada) && <text x={x + w / 2} y={y + h / 2 + 0.2} fontSize={0.55} textAnchor="middle" style={{ fill: marcada ? 'var(--ink)' : 'var(--ink-3)' }}>{vaga.codigo}</text>}
    </g>
  );
}

function Pin({ vaga, barraca }) {
  const px = vaga.x_m + vaga.larg_m / 2, py = vaga.y_m - 0.05;
  return (
    <g pointerEvents="none">
      <path d={`M${px} ${py} l-0.62 -0.88 a0.88 0.88 0 1 1 1.24 0 z`} style={{ fill: corDa(barraca.categoria) }} stroke="#fff" strokeWidth={0.15} />
      <circle cx={px} cy={py - 1.5} r={0.3} fill="#fff" />
    </g>
  );
}

export default function FeiraMap({
  planta, vagas, ocupacao, destaque, selecionada, filtro, vagaMarcada, vagasOpcao,
  usuario, precisao, rota, onSelecionar,
  foco, enquadrar, zoom = 'perto', chaveCamera = 'padrao', controles = false,
  margemInferior = 0, margemSuperior = 0,
}) {
  const ref = useRef(null);
  const [tam, setTam] = useState(null);
  const [cam, setCam] = useState(null);
  const movimento = useRef(0);
  const ponteiros = useRef(new Map());
  const pinca = useRef(null);
  const props = useRef();
  props.current = { foco, enquadrar, zoom, usuario };

  useEffect(() => {
    const ro = new ResizeObserver(([e]) => {
      const { width, height } = e.contentRect;
      if (width > 0 && height > 0) setTam({ w: width, h: height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  const visivel = t => ({ w: t.w, h: Math.max(80, t.h - margemInferior - margemSuperior) });

  function cameraInicial(t, modo = props.current.zoom) {
    const { foco: f, enquadrar: pts } = props.current;
    const vis = visivel(t);
    if (pts?.length) {
      const xs = pts.map(p => p.x), ys = pts.map(p => p.y);
      const bw = Math.max(...xs) - Math.min(...xs) + 8, bh = Math.max(...ys) - Math.min(...ys) + 8;
      return { cx: (Math.max(...xs) + Math.min(...xs)) / 2, cy: (Math.max(...ys) + Math.min(...ys)) / 2, w: Math.max(12, bw, bh * vis.w / vis.h) };
    }
    if (modo === 'longe') return { cx: planta.largura / 2, cy: planta.altura / 2, w: Math.max(planta.largura + 3, (planta.altura + 3) * vis.w / vis.h) };
    return perto(f ?? planta.entrada, t);
  }

  // a pessoa fica no quarto de baixo da área visível: o que interessa é o que está à frente dela
  function perto(p, t) {
    const vis = visivel(t);
    return { cx: p.x, cy: p.y - (vis.h * PERTO / vis.w) * 0.28, w: PERTO };
  }

  // reposiciona a câmera quando a tela pede (chaveCamera) ou quando o tamanho é medido pela primeira vez
  const pronto = !!tam;
  useEffect(() => { if (tam) setCam(cameraInicial(tam)); }, [chaveCamera, pronto]); // eslint-disable-line react-hooks/exhaustive-deps

  const limitar = c => ({
    w: Math.min(Math.max(c.w, MIN_W), Math.max(planta.largura, planta.altura) * 1.8),
    cx: Math.min(Math.max(c.cx, 0), planta.largura),
    cy: Math.min(Math.max(c.cy, 0), planta.altura),
  });

  function zoomPor(fator, ponto) {
    setCam(c => {
      const novo = limitar({ ...c, w: c.w * fator });
      if (!ponto || !tam) return novo;
      const r = ref.current.getBoundingClientRect();
      const mpp = c.w / tam.w;
      const vis = visivel(tam);
      const px = c.cx + (ponto.x - r.left - tam.w / 2) * mpp;
      const py = c.cy + (ponto.y - r.top - margemSuperior - vis.h / 2) * mpp;
      const k = novo.w / c.w;
      return limitar({ w: novo.w, cx: px - (px - c.cx) * k, cy: py - (py - c.cy) * k });
    });
  }

  useEffect(() => {
    const el = ref.current;
    const roda = e => { e.preventDefault(); zoomPor(e.deltaY > 0 ? 1.15 : 1 / 1.15, { x: e.clientX, y: e.clientY }); };
    el.addEventListener('wheel', roda, { passive: false });
    return () => el.removeEventListener('wheel', roda);
  });

  const aoApertar = e => {
    ponteiros.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (ponteiros.current.size === 1) movimento.current = 0;
  };
  const aoMover = e => {
    const anterior = ponteiros.current.get(e.pointerId);
    if (!anterior || !tam) return;
    const atual = { x: e.clientX, y: e.clientY };
    ponteiros.current.set(e.pointerId, atual);
    if (ponteiros.current.size === 1) {
      const dx = atual.x - anterior.x, dy = atual.y - anterior.y;
      movimento.current += Math.abs(dx) + Math.abs(dy);
      if (movimento.current > 6) setCam(c => limitar({ ...c, cx: c.cx - dx * c.w / tam.w, cy: c.cy - dy * c.w / tam.w }));
    } else if (ponteiros.current.size === 2) {
      const [a, b] = [...ponteiros.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinca.current) zoomPor(pinca.current / d, { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
      pinca.current = d;
      movimento.current += 10;
    }
  };
  const aoSoltar = e => { ponteiros.current.delete(e.pointerId); if (ponteiros.current.size < 2) pinca.current = null; };

  let viewBox = `0 0 ${planta.largura} ${planta.altura}`;
  if (cam && tam) {
    const mpp = cam.w / tam.w;
    const vis = visivel(tam);
    viewBox = `${cam.cx - cam.w / 2} ${cam.cy - (margemSuperior + vis.h / 2) * mpp} ${cam.w} ${tam.h * mpp}`;
  }
  const nomes = !!cam && cam.w <= NOMES_ATE;

  const estadoDe = b => {
    if (b.id === selecionada) return 'selecionada';
    if (destaque?.has(b.id)) return 'destaque';
    if (filtro && !filtro(b)) return 'apagada';
    return 'normal';
  };
  const vagaSelecionada = selecionada ? vagas.find(v => ocupacao.get(v.id)?.id === selecionada) : null;
  const largos = planta.largura + 40;

  return (
    <>
      <svg
        ref={ref} className="mapa-svg" viewBox={viewBox} preserveAspectRatio="xMidYMid meet"
        onPointerDown={aoApertar} onPointerMove={aoMover} onPointerUp={aoSoltar} onPointerCancel={aoSoltar} onPointerLeave={aoSoltar}
        onClickCapture={e => { if (movimento.current > 8) e.stopPropagation(); }}
        role="img" aria-label="Mapa da feira"
      >
        <rect x={-20} y={-20} width={largos} height={planta.altura + 40} style={{ fill: 'var(--mapa-chao)' }} />
        <rect x={-20} y={planta.ruaTopo.y0} width={largos} height={planta.ruaTopo.y1 - planta.ruaTopo.y0} style={{ fill: 'var(--mapa-rua)' }} />
        <rect x={-20} y={planta.ruaBase.y0} width={largos} height={planta.ruaBase.y1 - planta.ruaBase.y0 + 20} style={{ fill: 'var(--mapa-rua)' }} />
        {planta.corredores.map(c => (
          <g key={c.numero}>
            <rect x={c.x0} y={0} width={c.x1 - c.x0} height={planta.altura} style={{ fill: 'var(--mapa-rua)' }} />
            <text x={c.cx} y={planta.altura / 2} fontSize={0.8} textAnchor="middle" transform={`rotate(-90 ${c.cx} ${planta.altura / 2})`} style={{ fill: 'var(--ink-3)' }}>Corredor {c.numero}</text>
          </g>
        ))}
        {planta.pontos.map(p => {
          const w = 2 + p.nome.length * 0.42, cy = planta.ruaTopo.cy;
          return (
            <g key={p.nome}>
              <rect x={p.x} y={cy - 0.95} width={w} height={1.9} rx={0.95} fill="#fff" style={{ stroke: 'var(--line-strong)' }} strokeWidth={0.08} />
              <text x={p.x + 0.95} y={cy + 0.38} fontSize={1.05} textAnchor="middle" className="emo">{p.icone}</text>
              <text x={p.x + 1.75} y={cy + 0.27} fontSize={0.72} style={{ fill: 'var(--ink)' }}>{p.nome}</text>
            </g>
          );
        })}
        <g>
          <rect x={planta.entrada.x + 1.1} y={planta.entrada.y - 0.8} width={4.8} height={1.6} rx={0.8} style={{ fill: 'var(--ink)' }} />
          <text x={planta.entrada.x + 3.5} y={planta.entrada.y + 0.26} fontSize={0.72} textAnchor="middle" fill="#fff">ENTRADA</text>
        </g>

        {rota?.length > 1 && (() => {
          const pts = rota.map(p => `${p.x},${p.y}`).join(' ');
          return (
            <g pointerEvents="none">
              <polyline points={pts} fill="none" style={{ stroke: 'var(--info)' }} strokeWidth={0.55} strokeLinecap="round" strokeLinejoin="round" opacity={0.9} />
              <polyline points={pts} fill="none" stroke="#fff" strokeWidth={0.14} strokeDasharray="0.12 0.5" strokeLinecap="round" />
            </g>
          );
        })()}

        {vagas.map(v => {
          const b = ocupacao.get(v.id);
          return b
            ? <TileBarraca key={v.id} vaga={v} barraca={b} estado={estadoDe(b)} nomes={nomes} onClick={onSelecionar ? () => onSelecionar(b) : undefined} />
            : <VagaLivre key={v.id} vaga={v} nomes={nomes} marcada={v.id === vagaMarcada} opcao={vagasOpcao?.has(v.id)} />;
        })}
        {vagaSelecionada && <Pin vaga={vagaSelecionada} barraca={ocupacao.get(vagaSelecionada.id)} />}

        {usuario && (
          <g pointerEvents="none">
            {precisao > 15
              ? <circle cx={usuario.x} cy={usuario.y} r={precisao} style={{ fill: 'var(--info)', stroke: 'var(--info)' }} fillOpacity={0.12} strokeOpacity={0.5} strokeWidth={0.12} strokeDasharray="0.4 0.4" />
              : <circle cx={usuario.x} cy={usuario.y} r={0.55} style={{ fill: 'var(--info)' }} className="pulso" />}
            <circle cx={usuario.x} cy={usuario.y} r={0.75} fill="#fff" stroke="rgba(0,0,0,.2)" strokeWidth={0.05} />
            <circle cx={usuario.x} cy={usuario.y} r={0.52} style={{ fill: 'var(--info)' }} />
          </g>
        )}
      </svg>

      {controles && cam && (
        <>
          <button className="btn btn-secondary mapa-alternar" style={{ bottom: margemInferior + 14 }}
            onClick={() => setCam(cameraInicial(tam, cam.w <= NOMES_ATE ? 'longe' : 'perto'))}>
            {cam.w <= NOMES_ATE ? 'Ver feira inteira' : 'Ver de perto'}
          </button>
          <div className="mapa-controles" style={{ bottom: margemInferior + 14 }}>
            <button className="icon-btn raised" aria-label="Aproximar" onClick={() => zoomPor(1 / 1.4)}><Icon nome="plus" /></button>
            <button className="icon-btn raised" aria-label="Afastar" onClick={() => zoomPor(1.4)}><Icon nome="minus" /></button>
            {usuario && <button className="icon-btn raised" aria-label="Centralizar em mim" onClick={() => setCam(limitar(perto(usuario, tam)))}><Icon nome="locate" /></button>}
          </div>
        </>
      )}
    </>
  );
}
