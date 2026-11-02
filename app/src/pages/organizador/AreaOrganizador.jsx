import { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import Icon from '../../components/Icon.jsx';
import { Banner, Carregando, FaixaDemo } from '../../components/Avisos.jsx';
import { api, emDemonstracao } from '../../data/api.js';

/** Guarda das telas do organizador: exige login no Supabase. No modo demonstração entra direto. */
export default function AreaOrganizador() {
  const [sessao, setSessao] = useState(undefined);

  useEffect(() => {
    api.sessaoAtual().then(setSessao);
    return api.aoMudarSessao(setSessao);
  }, []);

  if (sessao === undefined) return <Carregando texto="Verificando acesso" />;
  if (!sessao) return <Login aoEntrar={setSessao} />;
  return <><FaixaDemo /><Outlet context={{ sessao }} /></>;
}

function Login({ aoEntrar }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState(null);
  const [enviando, setEnviando] = useState(false);

  async function entrar(e) {
    e.preventDefault();
    setEnviando(true); setErro(null);
    try { aoEntrar(await api.entrar(email, senha)); } catch (x) { setErro(x.message); } finally { setEnviando(false); }
  }

  return (
    <div className="pagina">
      <div className="cabecalho"><Link className="icon-btn" to="/" aria-label="Voltar"><Icon nome="back" /></Link><b className="t-sub">Área do organizador</b></div>
      <form className="conteudo" onSubmit={entrar}>
        <p style={{ margin: 0 }}>Entre com a conta de organizador para montar o mapa da feira.</p>
        <div className="campo"><label htmlFor="email">E-mail</label><input id="email" className="input" type="email" autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} required /></div>
        <div className="campo"><label htmlFor="senha">Senha</label><input id="senha" className="input" type="password" autoComplete="current-password" value={senha} onChange={e => setSenha(e.target.value)} required /></div>
        {erro && <Banner tipo="erro" icone="alert">{erro}</Banner>}
        {!emDemonstracao && <p className="t-caption" style={{ margin: 0 }}>Não tem conta? Peça ao responsável pelo sistema para criar o seu acesso.</p>}
        <button className="btn btn-primary btn-block" disabled={enviando} style={{ marginTop: 'auto' }}>
          {enviando ? <><span className="spinner" />Entrando</> : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
