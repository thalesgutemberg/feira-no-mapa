import { Link, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import { FaixaDemo } from '../components/Avisos.jsx';
import { useFeira } from '../data/FeiraContext.jsx';
import { useLocalizacao } from '../data/LocalizacaoContext.jsx';

export default function Entrada() {
  const f = useFeira();
  const loc = useLocalizacao();
  const navegar = useNavigate();
  const ir = escolha => { escolha(); navegar('/mapa'); };

  return (
    <div className="tela" style={{ overflowY: 'auto' }}>
      <FaixaDemo />
      <div style={{ background: 'var(--surface)', paddingTop: 8 }}><div className="awning" /></div>
      <div className="boas-vindas">
        <div className="t-caption row" style={{ gap: 6 }}><Icon nome="clock" style={{ width: 18, height: 18 }} />{f.feira.horario}</div>
        <h1 className="t-display">{f.feira.nome}</h1>
        <p style={{ margin: 0 }}>Ache o que procura e vá direto até a barraca.</p>
        <div className="stats">
          <div className="stat"><b>{f.presentes.length}</b><span>barracas hoje</span></div>
          <div className="stat"><b>{f.planta.corredores.length}</b><span>corredores</span></div>
        </div>
        <div className="perm">
          <Icon nome="pin" />
          <div><b>Por que pedimos sua localização?</b><br />Para mostrar onde você está no mapa da feira. Não guardamos sua posição.</div>
        </div>
      </div>
      <div className="acoes-base">
        <button className="btn btn-primary btn-block" onClick={() => ir(loc.permitir)}><Icon nome="locate" />Permitir localização</button>
        <button className="btn btn-ghost btn-block" onClick={() => ir(loc.recusar)}>Ver o mapa sem localização</button>
        <Link to="/organizador" className="t-caption" style={{ textAlign: 'center', padding: 12 }}>Sou organizador da feira</Link>
      </div>
    </div>
  );
}
