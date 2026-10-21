// Modo de demonstração: o "banco" fica no localStorage do navegador e segue as mesmas regras das RPCs do Supabase.
// Abas abertas no mesmo navegador conversam pelo evento "storage": ler uma etiqueta na aba do organizador
// atualiza o mapa na aba do cliente, como o tempo real faria.
import { gerarDadosMock } from './mock.js';
import { ErroFeira } from './erros.js';
import { hojeEmSaoPaulo } from '../lib/categorias.js';
import { normalizarUid } from '../lib/nfc.js';

const CHAVE = 'feira-no-mapa:demo:v1';
const ouvintes = new Set();
const espera = (ms = 120) => new Promise(r => setTimeout(r, ms));
let db = null;

function salvar() {
  try { localStorage.setItem(CHAVE, JSON.stringify(db)); } catch { /* sem storage: segue só em memória */ }
  ouvintes.forEach(f => f());
}

function carregar() {
  if (db) return db;
  try { db = JSON.parse(localStorage.getItem(CHAVE)); } catch { db = null; }
  if (!db?.feira) db = gerarDadosMock(hojeEmSaoPaulo());
  // virou o dia: a demonstração recomeça com a montagem de hoje já em andamento
  if (!db.montagens.some(m => m.data === hojeEmSaoPaulo())) db = gerarDadosMock(hojeEmSaoPaulo());
  salvar();
  return db;
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', e => {
    if (e.key !== CHAVE) return;
    try { db = JSON.parse(e.newValue); } catch { return; }
    ouvintes.forEach(f => f());
  });
}

const montagemDeHoje = () => carregar().montagens.find(m => m.data === hojeEmSaoPaulo());
const copia = x => JSON.parse(JSON.stringify(x));

export const mockAdapter = {
  modo: 'demo',

  async carregarFeira() {
    await espera();
    const { feira, vagas, barracas } = carregar();
    return copia({ feira, vagas, barracas });
  },

  async presencasDeHoje() {
    const m = montagemDeHoje();
    return copia(m ? db.presencas.filter(p => p.montagem_id === m.id) : []);
  },

  aoMudarPresencas(_feiraId, aoMudar) {
    ouvintes.add(aoMudar);
    return () => ouvintes.delete(aoMudar);
  },

  async listarEtiquetas() {
    return copia(carregar().etiquetas);
  },

  async barracaDaEtiqueta(uid) {
    await espera(200);
    const e = carregar().etiquetas.find(x => x.uid === normalizarUid(uid));
    return e ? copia(db.barracas.find(b => b.id === e.barraca_id)) : null;
  },

  async registrarLeitura({ uid, vagaId, lat = null, lng = null, precisao = null }) {
    await espera(250);
    carregar();
    const e = db.etiquetas.find(x => x.uid === normalizarUid(uid));
    if (!e) throw new ErroFeira('ETIQUETA_DESCONHECIDA');
    if (!db.vagas.some(v => v.id === vagaId)) throw new ErroFeira('VAGA_INVALIDA');
    let m = montagemDeHoje();
    if (!m) { m = { id: `montagem-${hojeEmSaoPaulo()}`, feira_id: db.feira.id, data: hojeEmSaoPaulo() }; db.montagens.push(m); }
    const doDia = db.presencas.filter(p => p.montagem_id === m.id);
    if (doDia.some(p => p.vaga_id === vagaId && p.barraca_id !== e.barraca_id)) throw new ErroFeira('VAGA_OCUPADA');
    const dados = { vaga_id: vagaId, lat, lng, precisao_m: precisao, lido_em: new Date().toISOString() };
    let p = doDia.find(x => x.barraca_id === e.barraca_id);
    if (p) Object.assign(p, dados);
    else { p = { id: `presenca-${Date.now()}`, montagem_id: m.id, barraca_id: e.barraca_id, ...dados }; db.presencas.push(p); }
    salvar();
    return copia(p);
  },

  async desfazerLeitura(barracaId) {
    await espera();
    const m = montagemDeHoje();
    db.presencas = db.presencas.filter(p => !(p.montagem_id === m?.id && p.barraca_id === barracaId));
    salvar();
  },

  async salvarBarraca(barraca) {
    await espera(300);
    carregar();
    const i = db.barracas.findIndex(b => b.id === barraca.id);
    const { nome, categoria, icone, produtos, pagamentos } = barraca;
    db.barracas[i] = { ...db.barracas[i], nome, categoria, icone, produtos, pagamentos };
    salvar();
    return copia(db.barracas[i]);
  },

  async vincularEtiqueta(barracaId, uid) {
    await espera(250);
    carregar();
    const u = normalizarUid(uid);
    if (db.etiquetas.some(e => e.uid === u && e.barraca_id !== barracaId)) throw new ErroFeira('ETIQUETA_EM_USO');
    db.etiquetas = db.etiquetas.filter(e => e.barraca_id !== barracaId).concat({ uid: u, barraca_id: barracaId });
    salvar();
  },

  // No modo de demonstração todo mundo entra como organizador.
  async sessaoAtual() { return { email: 'organizador@demonstracao', demo: true }; },
  aoMudarSessao() { return () => {}; },
  async entrar() { return { email: 'organizador@demonstracao', demo: true }; },
  async sair() {},

  reiniciarDemonstracao() {
    db = gerarDadosMock(hojeEmSaoPaulo());
    salvar();
  },
};
