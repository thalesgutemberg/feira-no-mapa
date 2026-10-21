export const CATEGORIAS = {
  hortifruti: { nome: 'Hortifruti' },
  comida: { nome: 'Comida' },
  carnes: { nome: 'Carnes e peixes' },
  artesanato: { nome: 'Artesanato' },
  outros: { nome: 'Outros' },
};

export const PAGAMENTOS = {
  pix: { nome: 'Pix', icone: 'pix' },
  cartao: { nome: 'Cartão', icone: 'card' },
  dinheiro: { nome: 'Dinheiro', icone: 'cash' },
};

export const corDa = categoria => `var(--cat-${categoria})`;
export const tomDa = categoria => `var(--cat-${categoria}-t)`;

export const normalizar = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/** Busca por nome, produto, categoria ou forma de pagamento. */
export function buscarBarracas(barracas, termo) {
  const t = normalizar(termo.trim());
  if (!t) return [];
  return barracas.filter(b => normalizar([
    b.nome, CATEGORIAS[b.categoria].nome, ...b.produtos, ...b.pagamentos.map(p => PAGAMENTOS[p].nome),
  ].join(' ')).includes(t));
}

export function hojeEmSaoPaulo() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date());
}
