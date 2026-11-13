import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import { FaixaDemo } from '../components/Avisos.jsx';
import { useFeira } from '../data/FeiraContext.jsx';
import { useLocalizacao } from '../data/LocalizacaoContext.jsx';
import { CATEGORIAS, corDa, preco } from '../lib/categorias.js';
import { CAPAS, fundo, fundoDa } from '../lib/fotos.js';

// Barracas que aparecem em "Destaques da noite". Na demonstração a escolha é fixa.
const DESTAQUES = [1, 2, 6, 22, 11, 56, 7, 24];
const CHAMADAS = {
  comida: 'Do espetinho ao risoto',
  bebidas: 'Chope, drinks e vinhos',
  doces: 'Para fechar a noite',
  artesanato: 'Feito à mão na Paraíba',
  outros: 'Livros, plantas e achados',
};

export default function Entrada() {
  const f = useFeira();
  const loc = useLocalizacao();
  const navegar = useNavigate();
  const ir = escolha => { escolha(); navegar('/mapa'); };

  const porCategoria = useMemo(() => Object.keys(CATEGORIAS).map(k => ({
    chave: k, nome: CATEGORIAS[k].nome, total: f.presentes.filter(b => b.categoria === k).length,
  })), [f.presentes]);
  const destaques = useMemo(() => DESTAQUES.map(n => f.porNumero(n)).filter(b => b && f.vagaDa(b)), [f]);
  const palco = f.feira.programacao ?? [];
  const [primeiro, ...resto] = f.feira.nome.split(' ');

  return (
    <div className="entrada">
      <FaixaDemo />
      <header className="hero" style={fundo('hero')}>
        <div className="hero-topo">
          <span className="marca"><i />Feira no Mapa</span>
        </div>
        <span className="pilula hero-horario"><Icon nome="clock" />{f.feira.horario}</span>
        <span className="hero-sobre">Gastronomia · Cultura · Arte</span>
        <h1>{primeiro} <em>{resto.join(' ')}</em></h1>
        <p>{f.presentes.length} barracas sob as luzes da praça. Veja o mapa, abra os cardápios e vá direto ao que deu vontade.</p>
        <div className="hero-acoes">
          <button className="btn btn-primary btn-block" onClick={() => ir(loc.permitir)}><Icon nome="map" />Explorar o mapa</button>
          <button className="btn btn-vidro btn-block" onClick={() => navegar('/busca')}><Icon nome="search" />Buscar comida ou barraca</button>
          <p className="hero-nota">Ao explorar o mapa, pedimos sua localização só para mostrar onde você está. Não guardamos sua posição. <a href="#/mapa" onClick={e => { e.preventDefault(); ir(loc.recusar); }}>Ver sem localização</a></p>
        </div>
      </header>

      <div className="numeros">
        <div><b>{f.presentes.length}</b><span>barracas hoje</span></div>
        <div><b>{porCategoria.filter(c => ['comida', 'bebidas', 'doces'].includes(c.chave)).reduce((t, c) => t + c.total, 0)}</b><span>para comer e beber</span></div>
        <div><b>{palco.length || f.planta.corredores.length}</b><span>{palco.length ? 'atrações no palco' : 'corredores'}</span></div>
      </div>

      <section className="secao">
        <div className="secao-cab"><span className="sobre">O que tem hoje</span><h2>Escolha por onde começar</h2></div>
        <div className="trilho">
          {porCategoria.map(c => (
            <button key={c.chave} className="cartao-cat" style={fundo(CAPAS[c.chave])} onClick={() => navegar(`/mapa?cat=${c.chave}`)}>
              <span className="barra" style={{ background: corDa(c.chave) }} />
              <span className="txt"><b>{c.nome}</b><span>{c.total} barracas · {CHAMADAS[c.chave]}</span></span>
            </button>
          ))}
        </div>
      </section>

      <section className="secao">
        <div className="secao-cab"><span className="sobre">Destaques da noite</span><h2>Para abrir o apetite</h2></div>
        <div className="trilho">
          {destaques.map(b => (
            <button key={b.id} className="cartao-destaque" onClick={() => navegar(`/barraca/${b.numero}`)}>
              <span className="img" style={fundoDa(b)}><span className="pilula">Barraca {b.numero}</span></span>
              <span className="corpo">
                <b>{b.nome}</b>
                {b.cardapio?.slice(0, 2).map(i => <span key={i.nome} className="item"><span>{i.nome}</span><span>{preco(i.preco)}</span></span>)}
              </span>
            </button>
          ))}
        </div>
      </section>

      {palco.length > 0 && (
        <section className="secao">
          <div className="secao-cab"><span className="sobre">Cultura</span><h2>No palco hoje</h2></div>
          <div className="palco">
            <div className="img" style={fundo('musica2')} role="img" aria-label="Banda tocando em um palco à noite" />
            <ul>
              {palco.map(a => <li key={a.hora}><time>{a.hora}</time><div><b>{a.nome}</b><span>{a.estilo}</span></div></li>)}
            </ul>
          </div>
        </section>
      )}

      <div className="fecho" style={fundo('hero2')}>
        <h2>A praça inteira na palma da mão</h2>
        <button className="btn btn-primary" onClick={() => ir(loc.permitir)}><Icon nome="map" />Abrir o mapa da feira</button>
      </div>

      <footer className="rodape">
        <span>{f.feira.endereco}</span>
        <span>Fotos ilustrativas do Unsplash.</span>
        <Link to="/organizador">Sou organizador da feira</Link>
      </footer>
    </div>
  );
}
