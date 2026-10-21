import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Icon from '../../components/Icon.jsx';
import { Selo } from '../../components/Barraca.jsx';
import { Banner } from '../../components/Avisos.jsx';
import { api } from '../../data/api.js';
import { useFeira } from '../../data/FeiraContext.jsx';
import { CATEGORIAS, PAGAMENTOS, corDa } from '../../lib/categorias.js';
import { escutarEtiquetas, nfcSuportado, uidAleatorio, vibrar } from '../../lib/nfc.js';

export default function EditarBarraca() {
  const { numero } = useParams();
  const f = useFeira();
  const navegar = useNavigate();
  const original = f.porNumero(numero);
  const [form, setForm] = useState(original);
  const [novoProduto, setNovoProduto] = useState('');
  const [erroProduto, setErroProduto] = useState(false);
  const [uid, setUid] = useState(undefined);
  const [lendo, setLendo] = useState(false);
  const [estado, setEstado] = useState(null);       // { tipo, texto }
  const [salvando, setSalvando] = useState(false);
  const parar = useRef(null);

  useEffect(() => { setForm(original); }, [original?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!original) return;
    api.listarEtiquetas().then(es => setUid(es.find(e => e.barraca_id === original.id)?.uid ?? null));
  }, [original]);
  useEffect(() => () => parar.current?.(), []);

  if (!original || !form) return <div className="pagina"><div className="centro"><p>Barraca {numero} não encontrada.</p><Link to="/organizador/barracas">Voltar</Link></div></div>;

  const mudar = (campo, valor) => setForm(x => ({ ...x, [campo]: valor }));
  const alternarPagamento = k => mudar('pagamentos', form.pagamentos.includes(k) ? form.pagamentos.filter(p => p !== k) : [...form.pagamentos, k]);
  const adicionarProduto = () => {
    const p = novoProduto.trim().toLowerCase();
    if (p && !form.produtos.includes(p)) mudar('produtos', [...form.produtos, p]);
    setNovoProduto(''); setErroProduto(false);
  };

  async function salvar() {
    if (!form.produtos.length) { setErroProduto(true); return; }
    if (!form.nome.trim()) { setEstado({ tipo: 'erro', texto: 'Informe o nome da barraca.' }); return; }
    setSalvando(true); setEstado(null);
    try {
      await api.salvarBarraca({ ...form, nome: form.nome.trim() });
      await f.recarregar();
      setEstado({ tipo: 'sucesso', texto: 'Alterações salvas. O mapa do cliente já mostra a versão nova.' });
    } catch (e) { setEstado({ tipo: 'erro', texto: e.message }); } finally { setSalvando(false); }
  }

  async function vincular(novoUid) {
    try {
      await api.vincularEtiqueta(original.id, novoUid);
      setUid(novoUid.toUpperCase());
      vibrar();
      setEstado({ tipo: 'sucesso', texto: `Etiqueta ${novoUid.toUpperCase()} ligada a esta barraca.` });
    } catch (e) { setEstado({ tipo: 'erro', texto: e.message }); }
  }

  async function lerParaVincular() {
    setLendo(true); setEstado(null);
    try {
      parar.current = await escutarEtiquetas(
        lido => { parar.current?.(); parar.current = null; setLendo(false); vincular(lido); },
        e => { setLendo(false); setEstado({ tipo: 'erro', texto: e.message }); },
      );
    } catch (e) { setLendo(false); setEstado({ tipo: 'erro', texto: `Não consegui ligar o NFC: ${e.message}` }); }
  }

  const vaga = f.vagaDa(original);

  return (
    <div className="pagina">
      <div className="cabecalho"><button className="icon-btn" onClick={() => navegar(-1)} aria-label="Voltar"><Icon nome="back" /></button><b className="t-sub">Barraca {original.numero}</b></div>
      <div className="conteudo" style={{ gap: 20 }}>
        <div className="row" style={{ gap: 14 }}>
          <Selo barraca={form} />
          <div className="t-caption">{vaga ? `Hoje na vaga ${vaga.codigo}` : 'Etiqueta ainda não lida hoje'}</div>
        </div>

        <div className="cartao">
          <div className="row entre"><b>Etiqueta NFC</b>{uid ? <span className="status ok">Vinculada</span> : uid === null ? <span className="status sem">Sem etiqueta</span> : null}</div>
          {uid && <code style={{ fontSize: 15 }}>{uid}</code>}
          {nfcSuportado
            ? <button className="btn btn-secondary btn-block" disabled={lendo} onClick={lerParaVincular}>{lendo ? <><span className="spinner" />Encoste a etiqueta nova</> : <><Icon nome="nfc" />{uid ? 'Trocar etiqueta' : 'Vincular etiqueta'}</>}</button>
            : <button className="btn btn-demo btn-block" onClick={() => vincular(uidAleatorio())}><Icon nome="nfc" />{uid ? 'Trocar por etiqueta nova (simulado)' : 'Vincular etiqueta nova (simulado)'}</button>}
          <span className="t-caption">Sem etiqueta vinculada, a barraca nunca entra no mapa: é a leitura dela que coloca a barraca no dia.</span>
        </div>

        <div className="campo"><label htmlFor="nome">Nome da barraca</label><input id="nome" className="input" value={form.nome} onChange={e => mudar('nome', e.target.value)} /></div>
        <div className="campo"><label htmlFor="icone">Ícone no mapa</label><input id="icone" className="input emo" style={{ width: 90, fontSize: 26, textAlign: 'center' }} value={form.icone} maxLength={4} onChange={e => mudar('icone', e.target.value)} /></div>
        <div className="campo">
          <label>Categoria</label>
          <div className="chips quebra">
            {Object.entries(CATEGORIAS).map(([k, c]) => <button key={k} className="chip" aria-pressed={form.categoria === k} onClick={() => mudar('categoria', k)}><span className="dot" style={{ background: corDa(k) }} />{c.nome}</button>)}
          </div>
        </div>
        <div className="campo">
          <label htmlFor="produto">O que vende</label>
          <div className="pays">{form.produtos.map(p => <span key={p} className="tag-x">{p}<button aria-label={`Remover ${p}`} onClick={() => mudar('produtos', form.produtos.filter(x => x !== p))}><Icon nome="close" /></button></span>)}</div>
          <div className="row">
            <input id="produto" className={`input${erroProduto ? ' is-error' : ''}`} placeholder="Ex: pastel de queijo" value={novoProduto} onChange={e => setNovoProduto(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); adicionarProduto(); } }} />
            <button className="btn btn-secondary" aria-label="Adicionar produto" onClick={adicionarProduto}><Icon nome="plus" /></button>
          </div>
          {erroProduto && <p className="msg-campo erro"><Icon nome="alert" style={{ width: 18, height: 18 }} />Informe pelo menos um produto. É por ele que os clientes buscam.</p>}
        </div>
        <div className="campo">
          <label>Formas de pagamento</label>
          <div className="chips quebra">{Object.entries(PAGAMENTOS).map(([k, p]) => <button key={k} className="chip" aria-pressed={form.pagamentos.includes(k)} onClick={() => alternarPagamento(k)}><Icon nome={p.icone} />{p.nome}</button>)}</div>
        </div>

        {estado && <Banner tipo={estado.tipo} icone={estado.tipo === 'sucesso' ? 'check' : 'alert'}>{estado.texto}</Banner>}
      </div>
      <div className="acoes-base" style={{ position: 'sticky', bottom: 0, boxShadow: '0 -2px 0 var(--line)' }}>
        <button className="btn btn-primary btn-block" disabled={salvando} onClick={salvar}>{salvando ? <><span className="spinner" />Salvando</> : 'Salvar alterações'}</button>
      </div>
    </div>
  );
}
