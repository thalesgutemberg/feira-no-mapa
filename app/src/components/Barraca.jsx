import Icon from './Icon.jsx';
import { fundoDa } from '../lib/fotos.js';
import { CATEGORIAS, PAGAMENTOS, corDa, tomDa, normalizar, itemDoCardapio, preco } from '../lib/categorias.js';

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

/** Com `foto`, o card mostra a foto da barraca no lugar do selo de emoji (telas do cliente). */
export function CardBarraca({ barraca, vaga, metros, ausente, termo, foto = false, onClick }) {
  const item = termo ? itemDoCardapio(barraca, termo) : null;
  return (
    <button className={`card-barraca${ausente ? ' ausente' : ''}`} onClick={onClick}>
      {foto
        ? <span className="thumb" style={fundoDa(barraca)}><small>{barraca.numero}</small></span>
        : <Selo barraca={barraca} ausente={ausente} />}
      <span>
        <span className="nome">{destacar(barraca.nome, termo)}</span><br />
        <span className="sub">{item
          ? <>{destacar(item.nome, termo)} · {preco(item.preco)}</>
          : <>{CATEGORIAS[barraca.categoria].nome}{vaga ? ` · Corredor ${vaga.corredor}` : ''}</>}</span>
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

const TITULO_CARDAPIO = { comida: 'Cardápio', bebidas: 'Cardápio', doces: 'Cardápio' };

/** Itens e preços da barraca. Em barraca que não vende comida, a lista se chama "Produtos e preços". */
export function Cardapio({ barraca }) {
  if (!barraca.cardapio?.length) return null;
  return (
    <div>
      <div className="list-title">{TITULO_CARDAPIO[barraca.categoria] ?? 'Produtos e preços'}</div>
      <ul className="cardapio">
        {barraca.cardapio.map(i => <li key={i.nome}><span>{i.nome}</span><span className="valor">{preco(i.preco)}</span></li>)}
      </ul>
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
