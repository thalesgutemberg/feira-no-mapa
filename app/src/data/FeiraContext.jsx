import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from './api.js';

const FeiraCtx = createContext(null);

export function FeiraProvider({ children }) {
  const [base, setBase] = useState(null);        // { feira, vagas, barracas }
  const [presencas, setPresencas] = useState([]);
  const [erro, setErro] = useState(null);

  const recarregarPresencas = useCallback(async feiraId => {
    try { setPresencas(await api.presencasDeHoje(feiraId)); } catch (e) { setErro(e); }
  }, []);

  const recarregar = useCallback(async () => {
    try {
      const b = await api.carregarFeira();
      setBase(b);
      await recarregarPresencas(b.feira.id);
    } catch (e) { setErro(e); }
  }, [recarregarPresencas]);

  useEffect(() => { recarregar(); }, [recarregar]);

  const feiraId = base?.feira.id;
  useEffect(() => {
    if (!feiraId) return;
    // no modo demonstração, outra aba pode ter editado barracas também
    return api.aoMudarPresencas(feiraId, () => (api.modo === 'demo' ? recarregar() : recarregarPresencas(feiraId)));
  }, [feiraId, recarregar, recarregarPresencas]);

  const valor = useMemo(() => {
    if (!base) return { carregando: !erro, erro, recarregar };
    const { feira, vagas, barracas } = base;
    const vagaPorId = new Map(vagas.map(v => [v.id, v]));
    const barracaPorId = new Map(barracas.map(b => [b.id, b]));
    const presencaDa = new Map(presencas.map(p => [p.barraca_id, p]));
    const ocupacao = new Map(presencas.filter(p => barracaPorId.has(p.barraca_id)).map(p => [p.vaga_id, barracaPorId.get(p.barraca_id)]));
    return {
      carregando: false, erro, recarregar, recarregarPresencas: () => recarregarPresencas(feira.id),
      feira, planta: feira.planta, vagas, barracas, presencas,
      vagaPorId, presencaDa, ocupacao,
      vagaDa: barraca => vagaPorId.get(presencaDa.get(barraca.id)?.vaga_id) ?? null,
      porNumero: n => barracas.find(b => b.numero === Number(n)) ?? null,
      presentes: barracas.filter(b => presencaDa.has(b.id)),
      ausentes: barracas.filter(b => !presencaDa.has(b.id)),
    };
  }, [base, presencas, erro, recarregar, recarregarPresencas]);

  return <FeiraCtx.Provider value={valor}>{children}</FeiraCtx.Provider>;
}

export const useFeira = () => useContext(FeiraCtx);
