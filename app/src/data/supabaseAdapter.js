// Modo Supabase: mesma interface do mockAdapter. Escritas sensíveis passam pelas RPCs do schema,
// que conferem se quem chama é organizador da feira.
import { createClient } from '@supabase/supabase-js';
import { deSupabase } from './erros.js';
import { hojeEmSaoPaulo } from '../lib/categorias.js';
import { normalizarUid } from '../lib/nfc.js';

export function criarSupabaseAdapter(url, chaveAnon, slug) {
  const sb = createClient(url, chaveAnon);
  const ok = ({ data, error }) => { if (error) throw deSupabase(error); return data; };

  return {
    modo: 'supabase',

    async carregarFeira() {
      const feira = ok(await sb.from('feiras').select('*').eq('slug', slug).single());
      const [vagas, barracas] = await Promise.all([
        sb.from('vagas').select('*').eq('feira_id', feira.id).order('ordem'),
        sb.from('barracas').select('*').eq('feira_id', feira.id).order('numero'),
      ]);
      return { feira, vagas: ok(vagas), barracas: ok(barracas) };
    },

    async presencasDeHoje(feiraId) {
      const m = ok(await sb.from('montagens').select('id').eq('feira_id', feiraId).eq('data', hojeEmSaoPaulo()).maybeSingle());
      if (!m) return [];
      return ok(await sb.from('presencas').select('id, montagem_id, barraca_id, vaga_id, precisao_m, lido_em').eq('montagem_id', m.id));
    },

    aoMudarPresencas(feiraId, aoMudar) {
      const canal = sb.channel(`presencas-${feiraId}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'presencas' }, () => aoMudar())
        .subscribe();
      return () => { sb.removeChannel(canal); };
    },

    async listarEtiquetas() {
      return ok(await sb.from('etiquetas_nfc').select('uid, barraca_id'));
    },

    async barracaDaEtiqueta(uid) {
      const e = ok(await sb.from('etiquetas_nfc').select('barracas(*)').eq('uid', normalizarUid(uid)).maybeSingle());
      return e?.barracas ?? null;
    },

    async registrarLeitura({ uid, vagaId, lat = null, lng = null, precisao = null }) {
      return ok(await sb.rpc('registrar_leitura', { p_uid: normalizarUid(uid), p_vaga: vagaId, p_lat: lat, p_lng: lng, p_precisao: precisao }));
    },

    async desfazerLeitura(barracaId) {
      ok(await sb.rpc('desfazer_leitura', { p_barraca: barracaId }));
    },

    async salvarBarraca({ id, nome, categoria, icone, produtos, pagamentos }) {
      return ok(await sb.from('barracas').update({ nome, categoria, icone, produtos, pagamentos }).eq('id', id).select().single());
    },

    async vincularEtiqueta(barracaId, uid) {
      ok(await sb.rpc('vincular_etiqueta', { p_barraca: barracaId, p_uid: normalizarUid(uid) }));
    },

    async sessaoAtual() {
      const { data } = await sb.auth.getSession();
      return data.session ? { email: data.session.user.email } : null;
    },
    aoMudarSessao(aoMudar) {
      const { data } = sb.auth.onAuthStateChange((_e, s) => aoMudar(s ? { email: s.user.email } : null));
      return () => data.subscription.unsubscribe();
    },
    async entrar(email, senha) {
      const { data, error } = await sb.auth.signInWithPassword({ email, password: senha });
      if (error) throw new Error('E-mail ou senha incorretos.');
      return { email: data.user.email };
    },
    async sair() { await sb.auth.signOut(); },
  };
}
