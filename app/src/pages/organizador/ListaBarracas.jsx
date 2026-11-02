import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/Icon.jsx';
import { Selo } from '../../components/Barraca.jsx';
import { api } from '../../data/api.js';
import { useFeira } from '../../data/FeiraContext.jsx';
import { buscarBarracas } from '../../lib/categorias.js';

const FILTROS = ['Todas', 'Lidas hoje', 'Faltam ler', 'Sem etiqueta'];

export default function ListaBarracas() {
  const f = useFeira();
  const [termo, setTermo] = useState('');
  const [filtro, setFiltro] = useState(0);
  const [comEtiqueta, setComEtiqueta] = useState(new Set());

  useEffect(() => { api.listarEtiquetas().then(es => setComEtiqueta(new Set(es.map(e => e.barraca_id)))); }, [f.barracas]);

  const lista = useMemo(() => {
    const base = termo.trim() ? buscarBarracas(f.barracas, termo) : f.barracas;
    return base.filter(b => [
      () => true, () => f.presencaDa.has(b.id), () => !f.presencaDa.has(b.id), () => !comEtiqueta.has(b.id),
    ][filtro]());
  }, [f, termo, filtro, comEtiqueta]);

  return (
    <div className="pagina">
      <div className="cabecalho"><Link className="icon-btn" to="/organizador" aria-label="Voltar"><Icon nome="back" /></Link><b className="t-sub">Barracas ({f.barracas.length})</b></div>
      <div className="conteudo">
        <div className="search"><Icon nome="search" /><input value={termo} onChange={e => setTermo(e.target.value)} placeholder="Nome, produto ou número" aria-label="Buscar barraca" /></div>
        <div className="chips">{FILTROS.map((n, i) => <button key={n} className="chip" aria-pressed={filtro === i} onClick={() => setFiltro(i)}>{n}</button>)}</div>
        <div>
          {lista.map(b => {
            const vaga = f.vagaDa(b);
            return (
              <Link key={b.id} to={`/organizador/barracas/${b.numero}`} className="linha-barraca">
                <Selo barraca={b} tamanho={48} />
                <div className="meio">
                  <div className="nome">{b.nome}</div>
                  <div className="row" style={{ gap: 6, flexWrap: 'wrap', marginTop: 2 }}>
                    {vaga ? <span className="status ok">Vaga {vaga.codigo}</span> : <span className="status pendente">Não lida hoje</span>}
                    {!comEtiqueta.has(b.id) && <span className="status sem">Sem etiqueta</span>}
                  </div>
                </div>
                <Icon nome="edit" style={{ color: 'var(--ink-3)' }} />
              </Link>
            );
          })}
          {lista.length === 0 && <p className="t-caption">Nenhuma barraca encontrada.</p>}
        </div>
      </div>
    </div>
  );
}
