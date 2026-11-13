// Fotos ilustrativas (Unsplash, ver public/img/CREDITOS.md). Na demonstração, a foto da barraca é escolhida
// pelo ícone dela, com a categoria como reserva: várias barracas dividem a mesma foto.
// Com dados reais, cada barraca teria a própria foto.
const base = import.meta.env.BASE_URL;
export const foto = nome => `${base}img/${nome}.jpg`;
export const fundo = nome => ({ backgroundImage: `url(${foto(nome)})` });

const POR_ICONE = {
  '🍔': 'burger', '🌭': 'burger', '🥪': 'burger',
  '🍕': 'pizza', '🍝': 'pizza',
  '🌮': 'tacos', '🌯': 'tacos', '🥙': 'tacos',
  '🍢': 'espeto', '🥩': 'espeto', '🍗': 'espeto',
  '🍣': 'sushi', '🍜': 'sushi', '🥠': 'sushi',
  '🍺': 'cerveja2', '🍻': 'cerveja',
  '🍹': 'drink', '🍸': 'drink', '🍷': 'drink', '🥃': 'drink',
  '☕': 'cafe',
  '🍦': 'sorvete', '🍧': 'sorvete',
  '🏺': 'ceramica', '🕯️': 'ceramica', '🧼': 'ceramica',
};

const POR_CATEGORIA = { comida: 'rua3', bebidas: 'drink', doces: 'chocolate', artesanato: 'cestas', outros: 'luzes' };

export const CAPAS = { comida: 'rua3', bebidas: 'cerveja2', doces: 'chocolate', artesanato: 'cestas', outros: 'luzes' };

export const fotoDa = barraca => foto(POR_ICONE[barraca.icone] ?? POR_CATEGORIA[barraca.categoria] ?? 'luzes');
export const fundoDa = barraca => ({ backgroundImage: `url(${fotoDa(barraca)})` });
