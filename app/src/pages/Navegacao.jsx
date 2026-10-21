import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FeiraMap from '../components/FeiraMap.jsx';
import Icon from '../components/Icon.jsx';
import { Selo } from '../components/Barraca.jsx';
import { AvisoLocalizacao } from '../components/Avisos.jsx';
import { useFeira } from '../data/FeiraContext.jsx';
import { useLocalizacao } from '../data/LocalizacaoContext.jsx';
import { PAGAMENTOS } from '../lib/categorias.js';
import { calcularRota, comprimento, direcaoInicial, frenteDaVaga, instrucao, pontoNaRota } from '../lib/rota.js';

const PASSO_M = 1.4;   // passo da caminhada simulada a cada tique
const TIQUE_MS = 350;

export default function Navegacao() {
  const { numero } = useParams();
  const f = useFeira();
  const loc = useLocalizacao();
  const navegar = useNavigate();
  const barraca = f.porNumero(numero);
  const vaga = barraca ? f.vagaDa(barraca) : null;

  // Sem GPS de verdade (demonstração ou fora da feira), a caminhada é simulada ao longo da rota inicial.
  const simulando = !loc.pos || loc.simulada;
  const origem = loc.pos ?? f.planta.entrada;
  const rotaInicial = useMemo(() => (vaga ? calcularRota(f.planta, origem, vaga) : null), [vaga, f.planta]); // eslint-disable-line react-hooks/exhaustive-deps
  const [andado, setAndado] = useState(0);
  const [andando, setAndando] = useState(false);
  const timer = useRef(null);

  const pos = simulando && rotaInicial ? pontoNaRota(rotaInicial, andado) : origem;
  const rota = vaga ? calcularRota(f.planta, pos, vaga) : null;
  const passo = rota ? instrucao(rota, vaga, barraca) : null;

  useEffect(() => {
    if (!andando) return;
    timer.current = setInterval(() => setAndado(a => a + PASSO_M), TIQUE_MS);
    return () => clearInterval(timer.current);
  }, [andando]);
  useEffect(() => { if (passo?.chegou) { setAndando(false); if (navigator.vibrate) navigator.vibrate([60, 60, 120]); } }, [passo?.chegou]);

  if (!barraca || !vaga) {
    return <div className="tela"><div className="centro"><p className="t-sub">Essa barraca não está no mapa de hoje.</p><button className="btn btn-primary" onClick={() => navegar('/mapa')}>Voltar ao mapa</button></div></div>;
  }

  const recomecar = () => { setAndado(0); setAndando(true); };
  const total = rotaInicial ? comprimento(rotaInicial) : 0;

  return (
    <div className="tela">
      <div className="mapwrap">
        <FeiraMap
          planta={f.planta} vagas={f.vagas} ocupacao={f.ocupacao} selecionada={barraca.id}
          usuario={pos} precisao={simulando ? null : loc.precisao} rota={passo.chegou ? null : rota}
          enquadrar={[origem, frenteDaVaga(f.planta, vaga)]} chaveCamera={`nav-${barraca.id}`}
          margemSuperior={120} margemInferior={170}
        />
        <div className="mapa-topo">
          <div className={`dir${passo.chegou ? ' chegou' : ''}`} aria-live="polite">
            <div className="seta">
              {passo.chegou ? <Icon nome="check" /> : <svg className="i" style={{ transform: `rotate(${direcaoInicial(rota)}deg)` }}><use href="#i-arrow" /></svg>}
            </div>
            <div>
              <div className="metros">{passo.chegou ? 'Chegou!' : `${passo.metros} m`}</div>
              <div className="texto">{passo.texto}</div>
            </div>
          </div>
          {!simulando && <AvisoLocalizacao loc={loc} />}
        </div>
      </div>
      <div className="acoes-base" style={{ background: '#fff', boxShadow: 'var(--e3)', borderRadius: 'var(--r-lg) var(--r-lg) 0 0', zIndex: 5 }}>
        <div className="row" style={{ gap: 14 }}>
          <Selo barraca={barraca} tamanho={44} />
          <div><b>{barraca.nome}</b><div className="t-caption">Vaga {vaga.codigo} · {barraca.pagamentos.map(p => PAGAMENTOS[p].nome).join(' · ')}</div></div>
        </div>
        <div className="row">
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => navegar('/mapa')}>{passo.chegou ? 'Voltar ao mapa' : 'Encerrar'}</button>
          {simulando && (
            <button className="btn btn-demo" style={{ flex: 1.4 }}
              onClick={() => (passo.chegou || andado >= total ? recomecar() : setAndando(a => !a))}>
              {passo.chegou ? '↺ Recomeçar' : andando ? '❚❚ Pausar' : andado > 0 ? '▶ Continuar' : '▶ Simular caminhada'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
