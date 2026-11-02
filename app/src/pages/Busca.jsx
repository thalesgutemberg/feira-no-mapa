import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import FeiraMap from '../components/FeiraMap.jsx';
import Icon from '../components/Icon.jsx';
import { CardBarraca } from '../components/Barraca.jsx';
import { useFeira } from '../data/FeiraContext.jsx';
import { useLocalizacao } from '../data/LocalizacaoContext.jsx';
import { buscarBarracas } from '../lib/categorias.js';
import { metrosAte } from '../lib/rota.js';

const SUGESTOES = ['pastel', 'orgânicos', 'queijo', 'caldo de cana', 'peixe', 'pix'];

export default function Busca() {
  const f = useFeira();
  const loc = useLocalizacao();
  const navegar = useNavigate();
  const [params, setParams] = useSearchParams();
  const termo = params.get('q') ?? '';
  const setTermo = q => setParams(q ? { q } : {}, { replace: true });

  // presentes primeiro, por distância; as que não vieram vão para o fim, para o cliente não perder a viagem
  const resultados = useMemo(() => buscarBarracas(f.barracas, termo)
    .map(b => ({ b, v: f.vagaDa(b), m: metrosAte(f.planta, loc.pos, f.vagaDa(b)) }))
    .sort((a, z) => (!a.v - !z.v) || ((a.m ?? a.b.numero) - (z.m ?? z.b.numero))), [f, termo, loc.pos]);
  const presentes = resultados.filter(r => r.v);
  const ids = useMemo(() => new Set(presentes.map(r => r.b.id)), [presentes]);

  return (
    <div className="tela">
      <div className="topbar">
        <div className="row">
          <button className="icon-btn" aria-label="Voltar" onClick={() => navegar('/mapa')}><Icon nome="back" /></button>
          <div className={`search${termo.trim() && !resultados.length ? ' is-error' : ''}`}>
            <Icon nome="search" />
            <input autoFocus value={termo} onChange={e => setTermo(e.target.value)} placeholder="Buscar barraca ou produto" aria-label="Buscar barraca ou produto" autoComplete="off" enterKeyHint="search" />
            {termo && <button className="icon-btn" aria-label="Limpar busca" onClick={() => setTermo('')}><Icon nome="close" /></button>}
          </div>
        </div>
      </div>
      <div className="mapwrap" style={{ flex: 'none', height: 250 }}>
        <FeiraMap planta={f.planta} vagas={f.vagas} ocupacao={f.ocupacao} destaque={ids}
          filtro={ids.size ? b => ids.has(b.id) : undefined} usuario={loc.pos} zoom="longe" chaveCamera="busca"
          onSelecionar={b => navegar(`/barraca/${b.numero}`)} />
      </div>
      <div className="conteudo" style={{ overflowY: 'auto' }}>
        {!termo.trim() && (
          <>
            <div className="list-title">Buscas comuns</div>
            <div className="chips quebra">{SUGESTOES.map(s => <button key={s} className="chip" onClick={() => setTermo(s)}>{s}</button>)}</div>
          </>
        )}
        {termo.trim() && !resultados.length && (
          <>
            <p className="msg-campo erro" style={{ margin: 0 }}><Icon nome="alert" style={{ width: 18, height: 18 }} />Nenhuma barraca vende "{termo}" nesta feira.</p>
            <p className="t-caption" style={{ margin: 0 }}>Tente outra palavra, como o nome do produto.</p>
          </>
        )}
        {resultados.length > 0 && (
          <div className="list-title">{presentes.length} {presentes.length === 1 ? 'barraca hoje' : 'barracas hoje'}{loc.pos ? ' · mais perto primeiro' : ''}</div>
        )}
        {resultados.map(({ b, v, m }) => (
          <CardBarraca key={b.id} barraca={b} vaga={v} metros={m} ausente={!v} termo={termo.trim()} onClick={() => navegar(`/barraca/${b.numero}`)} />
        ))}
      </div>
    </div>
  );
}
