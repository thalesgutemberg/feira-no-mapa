// Ícones de traço 2px em grade de 24px, os mesmos do protótipo. O sprite é renderizado uma vez no App.
const SIMBOLOS = {
  search: <><circle cx="11" cy="11" r="7" /><path d="M16.5 16.5L21 21" /></>,
  pin: <><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  stall: <><path d="M3 9l2-5h14l2 5" /><path d="M3 9a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0" /><path d="M5 12v8h14v-8" /><path d="M10 20v-4h4v4" /></>,
  route: <><circle cx="6" cy="19" r="2" /><circle cx="18" cy="5" r="2" /><path d="M8 19h7a3.5 3.5 0 0 0 0-7H9a3.5 3.5 0 0 1 0-7h7" /></>,
  pix: <><path d="M12 2.5l9.5 9.5-9.5 9.5L2.5 12z" /><path d="M8.5 12l3.5-3.5 3.5 3.5-3.5 3.5z" /></>,
  card: <><rect x="3" y="6" width="18" height="12" rx="2" /><path d="M3 10h18M7 15h3" /></>,
  cash: <><rect x="2" y="7" width="20" height="10" rx="2" /><circle cx="12" cy="12" r="2.5" /><path d="M6 12h.01M18 12h.01" /></>,
  nfc: <><path d="M6 9a4 4 0 0 1 0 6" /><path d="M10 6.5a8 8 0 0 1 0 11" /><path d="M14 4a12 12 0 0 1 0 16" /><path d="M18 2a15 15 0 0 1 0 20" /></>,
  arrow: <path d="M12 20V4M5 11l7-7 7 7" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  back: <path d="M15 18l-6-6 6-6" />,
  check: <path d="M5 12.5l4.5 4.5L19 7" />,
  alert: <><path d="M12 3l10 18H2z" /><path d="M12 10v4M12 17.5v.01" /></>,
  gpsoff: <><circle cx="12" cy="12" r="6" /><path d="M12 2v4M12 18v4M2 12h4M18 12h4M4 4l16 16" /></>,
  locate: <><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" fill="currentColor" /><path d="M12 2v4M12 18v4M2 12h4M18 12h4" /></>,
  edit: <><path d="M4 20h4L19 9l-4-4L4 16z" /><path d="M13.5 6.5l4 4" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7.5v.01" /></>,
  list: <path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01" />,
  map: <><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z" /><path d="M9 4v14M15 6v14" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  logout: <><path d="M15 4h4v16h-4" /><path d="M10 8l-4 4 4 4M6 12h10" /></>,
  undo: <><path d="M9 14L4 9l5-5" /><path d="M4 9h11a5 5 0 0 1 0 10h-3" /></>,
};

export function IconSprite() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      {Object.entries(SIMBOLOS).map(([nome, conteudo]) => (
        <symbol key={nome} id={`i-${nome}`} viewBox="0 0 24 24">{conteudo}</symbol>
      ))}
    </svg>
  );
}

export default function Icon({ nome, style, className = '' }) {
  return <svg className={`i ${className}`} style={style} aria-hidden="true"><use href={`#i-${nome}`} /></svg>;
}
