// Erros de negócio com o mesmo código nos dois modos (mock e Supabase), para as telas tratarem igual.
export const MENSAGENS = {
  ETIQUETA_DESCONHECIDA: 'Esta etiqueta não está ligada a nenhuma barraca. Vincule na tela de Barracas.',
  VAGA_OCUPADA: 'Essa vaga já tem outra barraca hoje. Escolha outra vaga.',
  VAGA_INVALIDA: 'Essa vaga não existe nesta feira.',
  ETIQUETA_EM_USO: 'Essa etiqueta já está ligada a outra barraca.',
  SEM_PERMISSAO: 'Sua conta não tem permissão de organizador nesta feira.',
};

export class ErroFeira extends Error {
  constructor(codigo, mensagem) {
    super(mensagem ?? MENSAGENS[codigo] ?? codigo);
    this.codigo = codigo;
  }
}

/** Converte o erro do Postgres (raise exception 'CODIGO') no ErroFeira correspondente. */
export function deSupabase(erro) {
  const codigo = Object.keys(MENSAGENS).find(c => erro?.message?.includes(c));
  return codigo ? new ErroFeira(codigo) : new ErroFeira('DESCONHECIDO', erro?.message ?? 'Algo deu errado. Tente de novo.');
}
