// Montagem do mapa do dia. Fluxo: encosta o celular na etiqueta -> o app identifica a barraca pelo UID ->
// lê o GPS e sugere as vagas livres mais próximas -> o organizador confirma a vaga -> a barraca aparece no mapa.
// O GPS erra de 3 a 10 m, por isso ele só sugere: quem decide a vaga é o organizador, olhando a placa no chão.
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import FeiraMap from '../../components/FeiraMap.jsx';
import Icon from '../../components/Icon.jsx';
import { Selo } from '../../components/Barraca.jsx';
import { Banner } from '../../components/Avisos.jsx';
import { api } from '../../data/api.js';
import { useFeira } from '../../data/FeiraContext.jsx';
import { lerGpsUmaVez } from '../../data/LocalizacaoContext.jsx';
import { centroDaVaga, vagasMaisProximas } from '../../lib/geo.js';
import { escutarEtiquetas, nfcSuportado, vibrar } from '../../lib/nfc.js';

const DESCONHECIDA = '04:DE:AD:BE:EF:00:01';

/** Sem GPS dentro da feira (demonstração), simula a leitura perto da vaga de costume, com o erro típico de um celular. */
function posicaoSimulada(f, barraca) {
  const vaga = f.vagaPorId.get(barraca.vaga_habitual_id) ?? f.vagas[0];
  const c = centroDaVaga(vaga);
  const ang = Math.random() * Math.PI * 2, raio = 1 + Math.random() * 4;
  return { x: c.x + Math.cos(ang) * raio, y: c.y + Math.sin(ang) * raio, lat: null, lng: null, precisao: 6 };
}

export default function Montagem() {
  const f = useFeira();
  const [fase, setFase] = useState('aguardando');      // aguardando | lendo | confirmar | salvando
  const [leitura, setLeitura] = useState(null);
  const [aviso, setAviso] = useState(null);
  const [leitorLigado, setLeitorLigado] = useState(false);
  const [mostrarSimulador, setMostrarSimulador] = useState(!nfcSuportado);
  const [etiquetas, setEtiquetas] = useState([]);
  const [simUid, setSimUid] = useState('');
  const parar = useRef(null);
  const faseAtual = useRef(fase);
  faseAtual.current = fase;

  useEffect(() => { api.listarEtiquetas().then(setEtiquetas).catch(() => setEtiquetas([])); }, [f.barracas]);
  useEffect(() => () => parar.current?.(), []);

  const uidDa = useMemo(() => new Map(etiquetas.map(e => [e.barraca_id, e.uid])), [etiquetas]);
  const pendentes = f.ausentes;
  const opcoesSimulador = useMemo(() => [
    ...pendentes.filter(b => uidDa.has(b.id)).map(b => ({ uid: uidDa.get(b.id), rotulo: `${b.numero} · ${b.nome}`, grupo: 'Ainda não lidas' })),
    ...f.presentes.filter(b => uidDa.has(b.id)).map(b => ({ uid: uidDa.get(b.id), rotulo: `${b.numero} · ${b.nome}`, grupo: 'Já lidas hoje' })),
  ], [pendentes, f.presentes, uidDa]);
  useEffect(() => {
    if (simUid !== DESCONHECIDA && !opcoesSimulador.some(o => o.uid === simUid)) setSimUid(opcoesSimulador[0]?.uid ?? DESCONHECIDA);
  }, [opcoesSimulador, simUid]);

  async function aoLerEtiqueta(uid) {
    if (faseAtual.current !== 'aguardando') return;   // ignora leituras enquanto confirma a anterior
    vibrar();
    setFase('lendo'); setAviso(null);
    try {
      const barraca = await api.barracaDaEtiqueta(uid);
      if (!barraca) { setAviso({ tipo: 'erro', texto: `Etiqueta ${uid} não está ligada a nenhuma barraca. Vincule na tela de Barracas.` }); setFase('aguardando'); return; }
      const gps = await lerGpsUmaVez(f.feira, f.planta, 6000);
      const pos = gps ?? posicaoSimulada(f, barraca);
      const ocupadas = new Set(f.presencas.filter(p => p.barraca_id !== barraca.id).map(p => p.vaga_id));
      const opcoes = vagasMaisProximas(pos, f.vagas, ocupadas, 4);
      const habitual = f.vagaPorId.get(barraca.vaga_habitual_id);
      if (habitual && !ocupadas.has(habitual.id) && !opcoes.some(o => o.vaga.id === habitual.id)) {
        opcoes.push({ vaga: habitual, metros: Math.hypot(centroDaVaga(habitual).x - pos.x, centroDaVaga(habitual).y - pos.y), deCostume: true });
      }
      opcoes.forEach(o => { if (o.vaga.id === habitual?.id) o.deCostume = true; });
      setLeitura({ uid, barraca, pos, simulada: !gps, opcoes, escolhida: opcoes[0]?.vaga.id, anterior: f.vagaDa(barraca), chave: Date.now() });
      setFase('confirmar');
    } catch (e) {
      setAviso({ tipo: 'erro', texto: e.message }); setFase('aguardando');
    }
  }
  const aoLerRef = useRef(aoLerEtiqueta);
  aoLerRef.current = aoLerEtiqueta;

  async function ligarLeitor() {
    try {
      parar.current = await escutarEtiquetas(uid => aoLerRef.current(uid), e => setAviso({ tipo: 'erro', texto: e.message }));
      setLeitorLigado(true);
    } catch (e) {
      setAviso({ tipo: 'erro', texto: e.name === 'NotAllowedError' ? 'O NFC foi bloqueado. Libere o NFC para este site nas configurações do Chrome.' : `Não consegui ligar o NFC: ${e.message}` });
    }
  }

  async function confirmar() {
    const { uid, barraca, pos, simulada, escolhida } = leitura;
    const vaga = f.vagaPorId.get(escolhida);
    setFase('salvando');
    try {
      await api.registrarLeitura({ uid, vagaId: escolhida, lat: simulada ? null : pos.lat, lng: simulada ? null : pos.lng, precisao: Math.round(pos.precisao) });
      vibrar(40);
      setAviso({ tipo: 'sucesso', texto: `Barraca ${barraca.numero} - ${barraca.nome} registrada na vaga ${vaga.codigo}.`, barracaId: barraca.id });
      setLeitura(null); setFase('aguardando');
      setSimUid('');   // o simulador pula para a próxima barraca que falta ler
      f.recarregarPresencas();
    } catch (e) {
      if (e.codigo === 'VAGA_OCUPADA') {
        const restantes = leitura.opcoes.filter(o => o.vaga.id !== escolhida);
        setLeitura({ ...leitura, opcoes: restantes, escolhida: restantes[0]?.vaga.id });
      }
      setAviso({ tipo: 'erro', texto: e.message }); setFase('confirmar');
    }
  }

  async function desfazer(barracaId) {
    try { await api.desfazerLeitura(barracaId); setAviso(null); f.recarregarPresencas(); }
    catch (e) { setAviso({ tipo: 'erro', texto: e.message }); }
  }

  const total = f.barracas.length, lidas = f.presentes.length;
  const vagaEscolhida = leitura && f.vagaPorId.get(leitura.escolhida);

  return (
    <div className="pagina">
      <div className="cabecalho"><Link className="icon-btn" to="/organizador" aria-label="Voltar"><Icon nome="back" /></Link><b className="t-sub">Montagem do mapa</b></div>
      <div className="conteudo">
        <div className="cartao" style={{ gap: 8 }}>
          <div className="row entre"><b>{lidas} de {total} barracas</b><span className="t-caption">faltam {total - lidas}</span></div>
          <div className="progresso"><div style={{ width: `${(lidas / total) * 100}%` }} /></div>
        </div>

        {aviso && (
          <Banner tipo={aviso.tipo} icone={aviso.tipo === 'sucesso' ? 'check' : 'alert'}
            acao={aviso.barracaId && <button className="btn btn-ghost btn-sm" onClick={() => desfazer(aviso.barracaId)}><Icon nome="undo" />Desfazer esta leitura</button>}>
            {aviso.texto}
          </Banner>
        )}

        {(fase === 'aguardando' || fase === 'lendo') && (
          <>
            <div className={`nfc-anel${leitorLigado || mostrarSimulador ? ' ativo' : ''}`}>
              {fase === 'lendo' ? <span className="spinner" style={{ width: 48, height: 48, borderWidth: 5 }} /> : <Icon nome="nfc" />}
            </div>
            <div style={{ textAlign: 'center' }}>
              <h1 className="t-title">{fase === 'lendo' ? 'Lendo etiqueta e GPS' : 'Encoste o celular na etiqueta'}</h1>
              <p className="t-caption" style={{ margin: '6px 0 0' }}>A etiqueta fica na frente da barraca, embaixo do número.</p>
            </div>
            {nfcSuportado && !leitorLigado && <button className="btn btn-primary btn-block" onClick={ligarLeitor}><Icon nome="nfc" />Ligar leitor NFC</button>}
            {nfcSuportado && leitorLigado && <p className="t-caption" style={{ textAlign: 'center', margin: 0 }}>Leitor ligado. Pode encostar uma etiqueta atrás da outra.</p>}

            {mostrarSimulador ? (
              <div className="simulador">
                <b style={{ color: 'var(--info)' }}>Simulador de NFC</b>
                <span className="t-caption">{nfcSuportado ? 'Para testar sem etiqueta física.' : 'Este navegador não lê NFC (hoje só o Chrome do Android lê). Escolha a etiqueta que você estaria encostando:'}</span>
                <select value={simUid} onChange={e => setSimUid(e.target.value)} aria-label="Etiqueta simulada">
                  {['Ainda não lidas', 'Já lidas hoje'].map(g => (
                    <optgroup key={g} label={g}>{opcoesSimulador.filter(o => o.grupo === g).map(o => <option key={o.uid} value={o.uid}>{o.rotulo}</option>)}</optgroup>
                  ))}
                  <optgroup label="Teste de erro"><option value={DESCONHECIDA}>Etiqueta sem cadastro</option></optgroup>
                </select>
                <button className="btn btn-demo btn-block" disabled={fase !== 'aguardando'} onClick={() => aoLerEtiqueta(simUid)}><Icon nome="nfc" />Encostar etiqueta</button>
              </div>
            ) : (
              <button className="btn btn-ghost btn-sm" onClick={() => setMostrarSimulador(true)}>Testar sem etiqueta (simulador)</button>
            )}

            {pendentes.length > 0 && (
              <div className="stack" style={{ gap: 0 }}>
                <div className="list-title" style={{ marginBottom: 4 }}>Faltam ler ({pendentes.length})</div>
                {pendentes.map(b => (
                  <div key={b.id} className="linha-barraca">
                    <Selo barraca={b} tamanho={44} />
                    <div className="meio"><div className="nome">{b.nome}</div><div className="t-caption">Costuma ficar na vaga {f.vagaPorId.get(b.vaga_habitual_id)?.codigo ?? '?'}</div></div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {(fase === 'confirmar' || fase === 'salvando') && leitura && (
          <>
            <div className="row" style={{ gap: 14 }}>
              <Selo barraca={leitura.barraca} />
              <div><div className="t-caption">Etiqueta lida</div><h1 className="t-sub">Barraca {leitura.barraca.numero} - {leitura.barraca.nome}</h1></div>
            </div>
            {leitura.simulada
              ? <Banner tipo="info" icone="info" titulo="Posição simulada">Sem GPS dentro da feira, simulei a leitura perto da vaga de costume, com o erro típico de um celular.</Banner>
              : <Banner tipo={leitura.pos.precisao > 12 ? 'alerta' : 'info'} icone="locate" titulo={`GPS com precisão de ${Math.round(leitura.pos.precisao)} m`}>
                  {leitura.pos.precisao > 12 ? 'Sinal fraco: confira a vaga pela placa no chão.' : 'Confira a vaga pela placa no chão antes de confirmar.'}
                </Banner>}
            {leitura.anterior && <Banner tipo="alerta" icone="info">Esta barraca já está no mapa de hoje, na vaga {leitura.anterior.codigo}. Confirmar muda para a vaga escolhida abaixo.</Banner>}

            <div className="mini-mapa">
              <FeiraMap planta={f.planta} vagas={f.vagas} ocupacao={f.ocupacao} usuario={leitura.pos} precisao={leitura.pos.precisao}
                vagaMarcada={leitura.escolhida} vagasOpcao={new Set(leitura.opcoes.map(o => o.vaga.id))}
                enquadrar={[leitura.pos, ...leitura.opcoes.map(o => centroDaVaga(o.vaga))]} chaveCamera={leitura.chave} />
            </div>

            <div className="list-title">Em qual vaga ela está?</div>
            {leitura.opcoes.length === 0
              ? <Banner tipo="erro" icone="alert">Não há vaga livre perto desta posição.</Banner>
              : (
                <div className="vaga-opcoes">
                  {leitura.opcoes.map(o => (
                    <button key={o.vaga.id} className="vaga-opcao" aria-pressed={o.vaga.id === leitura.escolhida} onClick={() => setLeitura({ ...leitura, escolhida: o.vaga.id })}>
                      {o.vaga.codigo}<small>{o.deCostume ? 'de costume · ' : ''}a {Math.round(o.metros)} m</small>
                    </button>
                  ))}
                </div>
              )}
            <button className="btn btn-primary btn-block" disabled={!vagaEscolhida || fase === 'salvando'} onClick={confirmar}>
              {fase === 'salvando' ? <><span className="spinner" />Registrando</> : <><Icon nome="check" />Confirmar vaga {vagaEscolhida?.codigo}</>}
            </button>
            <button className="btn btn-ghost btn-block" disabled={fase === 'salvando'} onClick={() => { setLeitura(null); setFase('aguardando'); }}>Cancelar esta leitura</button>
          </>
        )}
      </div>
    </div>
  );
}
