import { useRef, useState } from 'react';

/** Painel que sobe por cima do mapa. Arrastar a alça muda a altura; um toque alterna entre as alturas. */
export default function BottomSheet({ alturas = [120, 400, 680], inicial = 0, children }) {
  const [altura, setAltura] = useState(alturas[inicial]);
  const [arrastando, setArrastando] = useState(false);
  const ref = useRef(null);
  const inicio = useRef(null);
  const maxima = () => Math.min(alturas[alturas.length - 1], (ref.current?.parentElement?.clientHeight ?? 800) - 56);

  const soltar = e => {
    if (!inicio.current) return;
    const moveu = Math.abs(e.clientY - inicio.current.y);
    inicio.current = null;
    setArrastando(false);
    const atual = ref.current.offsetHeight;
    const alvo = moveu < 6
      ? alturas[(alturas.findIndex(a => a >= atual - 2) + 1) % alturas.length]
      : alturas.reduce((a, b) => (Math.abs(b - atual) < Math.abs(a - atual) ? b : a));
    setAltura(Math.min(alvo, maxima()));
  };

  return (
    <div ref={ref} className={`sheet${arrastando ? ' arrastando' : ''}`} style={{ height: Math.min(altura, maxima()) }}>
      <button
        className="sheet-alca" aria-label="Arrastar painel"
        onPointerDown={e => { inicio.current = { y: e.clientY, h: ref.current.offsetHeight }; setArrastando(true); e.currentTarget.setPointerCapture(e.pointerId); }}
        onPointerMove={e => { if (inicio.current) setAltura(Math.max(alturas[0], Math.min(maxima(), inicio.current.h + inicio.current.y - e.clientY))); }}
        onPointerUp={soltar} onPointerCancel={soltar}
      ><span /></button>
      <div className="sheet-corpo">{children}</div>
    </div>
  );
}
