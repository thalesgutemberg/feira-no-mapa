export const CATEGORIAS = {
  comida: { nome: 'Comida' },
  bebidas: { nome: 'Bebidas' },
  doces: { nome: 'Doces' },
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

export const preco = valor => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

/** Busca por nome, produto, item do cardápio, categoria ou forma de pagamento. */
export function buscarBarracas(barracas, termo) {
  const t = normalizar(termo.trim());
  if (!t) return [];
  return barracas.filter(b => normalizar([
    b.nome, CATEGORIAS[b.categoria].nome, ...b.produtos, ...(b.cardapio ?? []).map(i => i.nome),
    ...b.pagamentos.map(p => PAGAMENTOS[p].nome),
  ].join(' ')).includes(t));
}

/** Primeiro item do cardápio que combina com o termo buscado, para mostrar o preço já no resultado. */
export function itemDoCardapio(barraca, termo) {
  const t = normalizar(termo.trim());
  return t ? (barraca.cardapio ?? []).find(i => normalizar(i.nome).includes(t)) ?? null : null;
}

export function hojeEmSaoPaulo() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date());
}
