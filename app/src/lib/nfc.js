// Leitura de etiquetas NFC pelo navegador (Web NFC). Hoje só existe no Chrome do Android,
// em página HTTPS ou localhost. Fora disso, as telas usam o simulador.

export const nfcSuportado = typeof window !== 'undefined' && 'NDEFReader' in window;

/** UID no formato gravado no banco: bytes em hexa maiúsculo separados por ":". */
export const normalizarUid = uid => uid.trim().toUpperCase().replace(/-/g, ':');

/**
 * Começa a escutar etiquetas. Chama aoLer(uid) a cada leitura e devolve uma função para parar.
 * Precisa ser chamada a partir de um toque do usuário (exigência do navegador).
 */
export async function escutarEtiquetas(aoLer, aoErro) {
  const leitor = new window.NDEFReader();
  const controle = new AbortController();
  await leitor.scan({ signal: controle.signal });
  leitor.onreading = e => aoLer(normalizarUid(e.serialNumber));
  leitor.onreadingerror = () => aoErro(new Error('Não consegui ler a etiqueta. Encoste de novo e segure por um segundo.'));
  return () => controle.abort();
}

/** UID aleatório no formato de uma etiqueta NTAG, para vincular etiquetas no simulador. */
export function uidAleatorio() {
  const bytes = Array.from({ length: 6 }, () => Math.floor(Math.random() * 256));
  return ['04', ...bytes.map(b => b.toString(16).padStart(2, '0'))].join(':').toUpperCase();
}

export function vibrar(ms = 80) {
  if (navigator.vibrate) navigator.vibrate(ms);
}
