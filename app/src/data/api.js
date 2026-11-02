// Escolhe a fonte de dados: Supabase se as variáveis de ambiente existirem, demonstração caso contrário.
import { mockAdapter } from './mockAdapter.js';
import { criarSupabaseAdapter } from './supabaseAdapter.js';

const url = import.meta.env.VITE_SUPABASE_URL;
const chave = import.meta.env.VITE_SUPABASE_ANON_KEY;
const slug = import.meta.env.VITE_FEIRA_SLUG || 'praca-central';

export const api = url && chave ? criarSupabaseAdapter(url, chave, slug) : mockAdapter;
export const emDemonstracao = api.modo === 'demo';
