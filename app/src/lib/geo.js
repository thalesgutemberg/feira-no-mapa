// Conversão entre GPS (lat/lng) e a planta local em metros.
// Aproximação equirretangular: com uma feira de algumas dezenas de metros o erro é desprezível
// perto do erro do próprio GPS. A planta é considerada alinhada ao norte (sem rotação).

const M_POR_GRAU_LAT = 110540;
const M_POR_GRAU_LNG = 111320;
const cosLat = feira => Math.cos(feira.origem_lat * Math.PI / 180);

export function paraLocal(feira, lat, lng) {
  return {
    x: (lng - feira.origem_lng) * M_POR_GRAU_LNG * cosLat(feira),
    y: (feira.origem_lat - lat) * M_POR_GRAU_LAT,
  };
}

export function paraGeo(feira, x, y) {
  return {
    lat: feira.origem_lat - y / M_POR_GRAU_LAT,
    lng: feira.origem_lng + x / (M_POR_GRAU_LNG * cosLat(feira)),
  };
}

export const distancia = (a, b) => Math.hypot(b.x - a.x, b.y - a.y);

export const centroDaVaga = v => ({ x: v.x_m + v.larg_m / 2, y: v.y_m + v.alt_m / 2 });

// Ponto dentro da planta, com folga: o GPS de quem está na calçada ao lado ainda conta como "na feira".
export function dentroDaFeira(planta, p, folga = 60) {
  return p.x > -folga && p.y > -folga && p.x < planta.largura + folga && p.y < planta.altura + folga;
}

/** Vagas livres mais próximas de um ponto, da mais perto para a mais longe. */
export function vagasMaisProximas(ponto, vagas, ocupadas, quantidade = 4) {
  return vagas
    .filter(v => !ocupadas.has(v.id))
    .map(vaga => ({ vaga, metros: distancia(ponto, centroDaVaga(vaga)) }))
    .sort((a, b) => a.metros - b.metros)
    .slice(0, quantidade);
}
