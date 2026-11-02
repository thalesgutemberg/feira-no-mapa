import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FeiraMap from '../components/FeiraMap.jsx';
import BottomSheet from '../components/BottomSheet.jsx';
import Icon from '../components/Icon.jsx';
import { CardBarraca } from '../components/Barraca.jsx';
import { AvisoLocalizacao } from '../components/Avisos.jsx';
import { useFeira } from '../data/FeiraContext.jsx';
import { useLocalizacao } from '../data/LocalizacaoContext.jsx';
import { CATEGORIAS, corDa } from '../lib/categorias.js';
import { metrosAte } from '../lib/rota.js';

// Filtros esmaecem o que não combina, sem esconder: o cliente continua se orientando pelo mapa todo.
const FILTROS = [
  { nome: 'Todas' },
  ...Object.entries(CATEGORIAS).map(([k, c]) => ({ nome: c.nome, cor: corDa(k), fn: b => b.categoria === k })),
  { nome: 'Aceita Pix', icone: 'pix', fn: b => b.pagamentos.includes('pix') },
];
const ALTURA_SHEET = 128;

export default function Mapa() {
  const f = useFeira();
  const loc = useLocalizacao();
  const navegar = useNavigate();
  const [filtro, setFiltro] = useState(0);
  const fn = FILTROS[filtro].fn;

  const lista = useMemo(() => f.presentes
    .filter(b => !fn || fn(b))
    .map(b => ({ b, v: f.vagaDa(b), m: metrosAte(f.planta, loc.pos, f.vagaDa(b)) }))
    .sort((a, z) => (a.m ?? a.b.numero) - (z.m ?? z.b.numero)), [f, fn, loc.pos]);

  return (
    <div className="tela">
      <div className="topbar">
        <div className="row">
          <button className="search" onClick={() => navegar('/busca')}><Icon nome="search" /><span className="placeholder">Buscar barraca ou produto</span></button>
        </div>
        <div className="chips">
          {FILTROS.map((x, i) => (
            <button key={x.nome} className="chip" aria-pressed={filtro === i} onClick={() => setFiltro(i)}>
              {x.cor && <span className="dot" style={{ background: x.cor }} />}{x.icone && <Icon nome={x.icone} />}{x.nome}
            </button>
          ))}
        </div>
      </div>
      <div className="mapwrap">
        <FeiraMap
          planta={f.planta} vagas={f.vagas} ocupacao={f.ocupacao} filtro={fn}
          usuario={loc.pos} precisao={loc.precisao} foco={loc.pos ?? f.planta.entrada}
          chaveCamera={loc.pos ? 'com-posicao' : 'sem-posicao'} controles margemInferior={ALTURA_SHEET}
          onSelecionar={b => navegar(`/barraca/${b.numero}`)}
        />
        <div className="mapa-topo"><AvisoLocalizacao loc={loc} /></div>
      </div>
      <BottomSheet alturas={[ALTURA_SHEET, 420, 720]}>
        <div className="row entre">
          <b className="t-sub">{fn ? `${lista.length} barracas` : `${f.presentes.length} barracas hoje`}</b>
          {f.ausentes.length > 0 && <span className="t-caption">{f.ausentes.length} não vieram</span>}
        </div>
        <div className="list-title">{loc.pos ? 'Perto de você' : 'Barracas'}</div>
        {lista.slice(0, 30).map(({ b, v, m }) => (
          <CardBarraca key={b.id} barraca={b} vaga={v} metros={m} onClick={() => navegar(`/barraca/${b.numero}`)} />
        ))}
      </BottomSheet>
    </div>
  );
}
