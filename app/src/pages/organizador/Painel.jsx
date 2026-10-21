import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import Icon from '../../components/Icon.jsx';
import { api, emDemonstracao } from '../../data/api.js';
import { useFeira } from '../../data/FeiraContext.jsx';

export default function Painel() {
  const f = useFeira();
  const { sessao } = useOutletContext();
  const navegar = useNavigate();
  const total = f.barracas.length;
  const lidas = f.presentes.length;
  const hoje = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'America/Sao_Paulo' }).format(new Date());

  return (
    <div className="pagina">
      <div className="cabecalho"><Link className="icon-btn" to="/" aria-label="Voltar ao início"><Icon nome="back" /></Link><b className="t-sub">{f.feira.nome}</b></div>
      <div className="conteudo">
        <div className="cartao">
          <div className="row entre"><b>Montagem de hoje</b><span className="t-caption" style={{ textTransform: 'capitalize' }}>{hoje}</span></div>
          <div className="row entre"><b className="t-title">{lidas} de {total}</b><span className="t-caption">faltam {total - lidas}</span></div>
          <div className="progresso" role="progressbar" aria-valuenow={lidas} aria-valuemax={total}><div style={{ width: `${(lidas / total) * 100}%` }} /></div>
        </div>
        <Link className="menu-item" to="/organizador/montagem">
          <span className="ic"><Icon nome="nfc" /></span>
          <span><b>Montar o mapa</b><span className="t-caption">Encoste o celular na etiqueta de cada barraca</span></span>
        </Link>
        <Link className="menu-item" to="/organizador/barracas">
          <span className="ic"><Icon nome="list" /></span>
          <span><b>Barracas</b><span className="t-caption">Cadastro, etiquetas e quem já foi lido hoje</span></span>
        </Link>
        <Link className="menu-item" to="/mapa">
          <span className="ic"><Icon nome="map" /></span>
          <span><b>Ver o mapa do cliente</b><span className="t-caption">Do jeito que o público vê agora</span></span>
        </Link>
        <div style={{ marginTop: 'auto' }} className="stack">
          <p className="t-caption" style={{ margin: 0, textAlign: 'center' }}>Conectado como {sessao.email}</p>
          {emDemonstracao
            ? <button className="btn btn-danger btn-block" onClick={() => { if (confirm('Voltar a demonstração ao estado inicial? As leituras e edições feitas neste navegador serão perdidas.')) api.reiniciarDemonstracao(); }}><Icon nome="undo" />Reiniciar demonstração</button>
            : <button className="btn btn-secondary btn-block" onClick={async () => { await api.sair(); navegar('/'); }}><Icon nome="logout" />Sair</button>}
        </div>
      </div>
    </div>
  );
}
