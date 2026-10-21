import Icon from './Icon.jsx';
import { emDemonstracao } from '../data/api.js';

export function Banner({ tipo = 'info', icone = 'info', titulo, children, acao }) {
  return (
    <div className={`banner ${tipo}`} role={tipo === 'erro' ? 'alert' : 'status'}>
      <Icon nome={icone} />
      <div>
        {titulo && <span className="titulo">{titulo}</span>}
        {children}
        {acao && <div className="acao">{acao}</div>}
      </div>
    </div>
  );
}

export function FaixaDemo() {
  if (!emDemonstracao) return null;
  return <div className="demo-faixa"><Icon nome="info" />Demonstração com dados fictícios. Nada aqui é uma feira real.</div>;
}

export function Carregando({ texto = 'Carregando a feira' }) {
  return <div className="centro" aria-busy="true"><span className="spinner" style={{ color: 'var(--primary)', width: 32, height: 32 }} /><span>{texto}</span></div>;
}

export function TelaErro({ erro, aoTentar }) {
  return (
    <div className="centro">
      <Icon nome="alert" style={{ width: 40, height: 40, color: 'var(--error)' }} />
      <p className="t-sub">Não consegui carregar a feira</p>
      <p className="t-caption">{erro?.message}</p>
      {aoTentar && <button className="btn btn-primary" onClick={aoTentar}>Tentar de novo</button>}
    </div>
  );
}

/** Estado da localização do cliente, sempre por cima do mapa. Banner quando pede ação, toast quando só informa. */
export function AvisoLocalizacao({ loc }) {
  switch (loc.status) {
    case 'desligada':
      return <Banner tipo="alerta" icone="gpsoff" titulo="Localização desligada" acao={<button className="btn btn-secondary btn-sm" onClick={loc.permitir}>Ativar localização</button>}>O mapa funciona, mas sem mostrar onde você está.</Banner>;
    case 'negada':
      return <Banner tipo="alerta" icone="gpsoff" titulo="Localização bloqueada">Libere a localização para este site nas configurações do navegador para ver onde você está.{loc.pos && ' Para demonstração, mostramos você na entrada.'}</Banner>;
    case 'fora':
      return <div className="toast"><Icon nome="info" /><span>Você não está na feira agora. Para demonstração, mostramos você na entrada.</span></div>;
    case 'indisponivel':
      return <div className="toast"><Icon nome="alert" /><span>Não consegui achar sua posição. Mostrando você na entrada.</span></div>;
    case 'procurando':
      return <div className="toast"><span className="spinner" style={{ color: 'var(--sun)' }} /><span>Procurando sua localização</span></div>;
    case 'gps':
      return loc.precisao > 20
        ? <div className="toast"><Icon nome="alert" /><span>Sinal de GPS fraco. Sua posição pode estar até {Math.round(loc.precisao)} m errada. Use os números das barracas como referência.</span></div>
        : null;
    default:
      return null;
  }
}
