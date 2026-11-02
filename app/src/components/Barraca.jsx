import Icon from './Icon.jsx';
import { CATEGORIAS, PAGAMENTOS, corDa, tomDa, normalizar } from '../lib/categorias.js';

/** Ícone do produto com o número da placa: o mesmo par que aparece desenhado no mapa. */
export function Selo({ barraca, ausente = false, tamanho }) {
  const estilo = { background: tomDa(barraca.categoria), border: `2px solid ${corDa(barraca.categoria)}` };
  if (tamanho) Object.assign(estilo, { width: tamanho, height: tamanho, fontSize: tamanho * 0.54 });
  return <span className={`selo${ausente ? ' ausente' : ''}`} style={estilo}>{barraca.icone}<small>{barraca.numero}</small></span>;
}

function destacar(texto, termo) {
  if (!termo) return texto;
  const i = normalizar(texto).indexOf(normalizar(termo));
  if (i < 0) return texto;
  return <>{texto.slice(0, i)}<mark>{texto.slice(i, i + termo.length)}</mark>{texto.slice(i + termo.length)}</>;
}

export function CardBarraca({ barraca, vaga, metros, ausente, termo, onClick }) {
  return (
    <button className={`card-barraca${ausente ? ' ausente' : ''}`} onClick={onClick}>
      <Selo barraca={barraca} ausente={ausente} />
      <span>
        <span className="nome">{destacar(barraca.nome, termo)}</span><br />
        <span className="sub">{CATEGORIAS[barraca.categoria].nome}{vaga ? ` · Corredor ${vaga.corredor}` : ''}</span>
      </span>
      <span className="dist">{ausente ? 'Não veio' : metros != null ? `${Math.round(metros)} m` : ''}</span>
    </button>
  );
}

export function Pagamentos({ barraca }) {
  return (
    <div className="pays">
      {Object.entries(PAGAMENTOS).map(([k, p]) => (
        <span key={k} className={`pay${barraca.pagamentos.includes(k) ? '' : ' off'}`}>
          <Icon nome={p.icone} />{p.nome}
        </span>
      ))}
    </div>
  );
}

export function FotoPadrao({ barraca }) {
  const c = corDa(barraca.categoria);
  return (
    <div className="foto" style={{ background: `repeating-linear-gradient(90deg, ${c} 0 22px, rgba(255,255,255,.9) 22px 44px)` }}>
      <span>Foto da barraca</span>
    </div>
  );
}
