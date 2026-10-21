// Posição do cliente na planta da feira. Usa o GPS de verdade quando a pessoa está na feira.
// Longe da feira (o caso de toda demonstração), mostra uma posição simulada na entrada e avisa.
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useFeira } from './FeiraContext.jsx';
import { dentroDaFeira, paraLocal } from '../lib/geo.js';
import { emDemonstracao } from './api.js';

const LocCtx = createContext(null);
const CHAVE = 'feira-no-mapa:localizacao';
const lerPreferencia = () => { try { return localStorage.getItem(CHAVE); } catch { return null; } };

export function LocalizacaoProvider({ children }) {
  const { feira, planta } = useFeira() ?? {};
  const [preferencia, setPreferencia] = useState(lerPreferencia);   // 'sim' | 'nao' | null
  const [estado, setEstado] = useState({ status: 'iniciando', pos: null, precisao: null });

  const lembrar = useCallback(v => {
    try { localStorage.setItem(CHAVE, v); } catch { /* ok */ }
    setPreferencia(v);
  }, []);

  useEffect(() => {
    if (!feira) return;
    const simulada = { pos: { ...planta.entrada }, precisao: 5, simulada: true };
    if (preferencia !== 'sim') { setEstado({ status: 'desligada', pos: null, precisao: null }); return; }
    if (!('geolocation' in navigator)) { setEstado({ status: 'indisponivel', ...simulada }); return; }
    setEstado(e => (e.pos ? e : { status: 'procurando', pos: null, precisao: null }));
    const id = navigator.geolocation.watchPosition(
      p => {
        const local = paraLocal(feira, p.coords.latitude, p.coords.longitude);
        if (dentroDaFeira(planta, local)) setEstado({ status: 'gps', pos: local, precisao: p.coords.accuracy, simulada: false });
        else setEstado({ status: 'fora', ...simulada });
      },
      // na demonstração, sem permissão ainda mostramos a posição simulada para o fluxo inteiro funcionar
      err => setEstado(err.code === err.PERMISSION_DENIED
        ? (emDemonstracao ? { status: 'negada', ...simulada } : { status: 'negada', pos: null, precisao: null })
        : { status: 'indisponivel', ...simulada }),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 },
    );
    return () => navigator.geolocation.clearWatch(id);
  }, [feira, planta, preferencia]);

  const valor = { ...estado, permitir: () => lembrar('sim'), recusar: () => lembrar('nao') };
  return <LocCtx.Provider value={valor}>{children}</LocCtx.Provider>;
}

export const useLocalizacao = () => useContext(LocCtx);

/** Uma leitura única de GPS, usada pelo organizador na hora de registrar a etiqueta. */
export function lerGpsUmaVez(feira, planta, timeout = 8000) {
  return new Promise(resolve => {
    if (!('geolocation' in navigator)) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      p => {
        const local = paraLocal(feira, p.coords.latitude, p.coords.longitude);
        resolve(dentroDaFeira(planta, local, 30)
          ? { ...local, lat: p.coords.latitude, lng: p.coords.longitude, precisao: p.coords.accuracy }
          : null);
      },
      () => resolve(null),
      { enableHighAccuracy: true, maximumAge: 0, timeout },
    );
  });
}
