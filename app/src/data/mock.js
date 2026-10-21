// Dados fictícios de uma feira com 100 barracas. Usados pelo modo de demonstração (mockAdapter)
// e pelo script que gera o seed do Supabase, para que os dois modos tenham os mesmos dados.
import { gerarPlanta } from '../lib/planta.js';

export const FEIRA_MOCK = {
  slug: 'praca-central',
  nome: 'Feira da Praça Central',
  endereco: 'Praça Central (endereço fictício)',
  horario: 'Domingo, das 7h às 13h',
  origem_lat: -23.5505,
  origem_lng: -46.6333,
};

// [nome, categoria, produtos, pagamentos, ícone]. O número da barraca é a posição na lista.
export const BARRACAS_MOCK = [
  ['Hortifruti Dona Cida', 'hortifruti', 'verduras,legumes,frutas', 'pix cartao dinheiro', '🥕'],
  ['Café da Feira', 'comida', 'café,pão na chapa,bolo', 'pix cartao dinheiro', '☕'],
  ['Ovos da Granja Feliz', 'outros', 'ovos caipira,ovos brancos', 'pix dinheiro', '🥚'],
  ['Peixaria do Mané', 'carnes', 'peixe fresco,sardinha,tilápia', 'pix cartao', '🐟'],
  ['Tomates do Valdir', 'hortifruti', 'tomate,pimentão,cebola', 'pix dinheiro', '🍅'],
  ['Cestaria da Dona Zefa', 'artesanato', 'cestos,balaios,fruteiras', 'pix dinheiro', '🧺'],
  ['Verduras do Seu Antônio', 'hortifruti', 'alface,couve,rúcula', 'dinheiro', '🥬'],
  ['Queijos da Serra', 'outros', 'queijo minas,requeijão,manteiga', 'pix cartao dinheiro', '🧀'],
  ['Caldo de Cana do Baiano', 'comida', 'caldo de cana,coco gelado', 'pix dinheiro', '🥤'],
  ['Frango Caipira do Jorge', 'carnes', 'frango caipira,miúdos', 'pix cartao', '🍗'],
  ['Frutas da Dona Lurdes', 'hortifruti', 'banana,mamão,laranja,maçã', 'pix dinheiro', '🍎'],
  ['Bordados da Lia', 'artesanato', 'panos bordados,toalhas', 'pix', '🧵'],
  ['Mel do Apiário São José', 'outros', 'mel,própolis,cera', 'pix cartao dinheiro', '🍯'],
  ['Orgânicos Sítio Boa Vista', 'hortifruti', 'orgânicos,verduras,legumes', 'pix cartao', '🌿'],
  ['Tapioca da Ana', 'comida', 'tapioca,cuscuz', 'pix cartao dinheiro', '🌮'],
  ['Açougue Boi Bom', 'carnes', 'carne bovina,linguiça', 'pix cartao', '🥩'],
  ['Pastel do Zé', 'comida', 'pastel de carne,pastel de queijo,caldo de cana', 'pix cartao dinheiro', '🥟'],
  ['Flores da Dona Hilda', 'outros', 'flores,buquês', 'pix dinheiro', '💐'],
  ['Banca do Japonês', 'hortifruti', 'legumes,verduras,cogumelos', 'pix cartao dinheiro', '🍄'],
  ['Cerâmica Barro Vivo', 'artesanato', 'vasos,pratos,canecas', 'pix cartao', '🏺'],
  ['Pastelaria Yoshida', 'comida', 'pastel,yakisoba', 'pix cartao dinheiro', '🍜'],
  ['Raízes do Tião', 'hortifruti', 'mandioca,batata,inhame', 'dinheiro', '🥔'],
  ['Peixes do Litoral', 'carnes', 'camarão,peixe fresco,lula', 'pix cartao', '🦑'],
  ['Temperos da Bahia', 'outros', 'temperos,pimentas,castanhas', 'pix dinheiro', '🌶️'],
  ['Cítricos do Paulinho', 'hortifruti', 'laranja,limão,tangerina', 'pix dinheiro', '🍊'],
  ['Acarajé da Tia Bel', 'comida', 'acarajé,abará', 'pix dinheiro', '🧆'],
  ['Sabonetes Artesanais Flor', 'artesanato', 'sabonetes,sais de banho', 'pix cartao', '🧼'],
  ['Bananas da Serra', 'hortifruti', 'banana prata,banana nanica', 'dinheiro', '🍌'],
  ['Linguiças do Sul', 'carnes', 'linguiça,bacon,costela', 'pix cartao', '🌭'],
  ['Plantas e Mudas do Chico', 'outros', 'mudas,suculentas,terra adubada', 'pix dinheiro', '🌱'],
  ['Pamonha de Piracicaba', 'comida', 'pamonha,curau,milho verde', 'pix dinheiro', '🌽'],
  ['Morangos de Atibaia', 'hortifruti', 'morango,amora', 'pix cartao', '🍓'],
  ['Brinquedos do Seu Jair', 'artesanato', 'brinquedos de madeira,pião', 'pix dinheiro', '🧸'],
  ['Grãos a Granel', 'outros', 'feijão,arroz,castanhas', 'pix cartao dinheiro', '🌾'],
  ['Folhas Frescas da Neide', 'hortifruti', 'alface,agrião,cheiro-verde', 'pix dinheiro', '🥗'],
  ['Pastel da Kika', 'comida', 'pastel,pastel doce', 'pix cartao dinheiro', '🥟'],
  ['Camarões da Praia', 'carnes', 'camarão,siri', 'pix cartao', '🦐'],
  ['Doces Mineiros', 'outros', 'doce de leite,goiabada', 'pix dinheiro', '🍮'],
  ['Ervas da Vó Maria', 'hortifruti', 'ervas,chás,orgânicos', 'pix dinheiro', '🍵'],
  ['Bijuterias da Mel', 'artesanato', 'brincos,colares', 'pix cartao', '💍'],
  ['Espetinho do Gordo', 'comida', 'espetinho,pão de alho', 'pix cartao dinheiro', '🍢'],
  ['Frios Itália', 'carnes', 'presunto,salame,mortadela', 'pix cartao', '🥪'],
  ['Coco Gelado do Cícero', 'hortifruti', 'coco verde,abacaxi', 'pix dinheiro', '🥥'],
  ['Panos de Prato da Cleide', 'artesanato', 'panos de prato,aventais', 'pix dinheiro', '🧶'],
  ['Bolos da Dona Rosa', 'comida', 'bolo,broa,rosca', 'pix dinheiro', '🍰'],
  ['Utilidades do Lar', 'outros', 'panelas,peneiras,utensílios', 'pix cartao dinheiro', '🍳'],
  ['Hortifruti Irmãos Silva', 'hortifruti', 'frutas,legumes,verduras', 'pix cartao dinheiro', '🍇'],
  ['Velas e Aromas', 'artesanato', 'velas,incensos', 'pix cartao', '🕯️'],
  ['Carnes do Seu Bento', 'carnes', 'carne bovina,carne suína', 'pix cartao dinheiro', '🍖'],
  ['Amendoim do Seu Lino', 'outros', 'amendoim torrado,pé de moleque', 'dinheiro', '🥜'],
  ['Pastel da Vovó Neusa', 'comida', 'pastel de palmito,pastel de pizza', 'pix cartao dinheiro', '🥟'],
  ['Abacaxis do Seu Raimundo', 'hortifruti', 'abacaxi,melancia', 'pix dinheiro', '🍍'],
  ['Peixaria Mar Azul', 'carnes', 'salmão,merluza,pescada', 'pix cartao', '🐠'],
  ['Crochê da Dona Benê', 'artesanato', 'tapetes de crochê,toalhinhas', 'pix dinheiro', '🧶'],
  ['Hortaliças Sítio Recanto', 'hortifruti', 'alface,couve,espinafre,orgânicos', 'pix cartao', '🥬'],
  ['Caldos da Lena', 'comida', 'caldo verde,caldo de feijão', 'pix cartao dinheiro', '🍲'],
  ['Ovos e Mel da Fazenda', 'outros', 'ovos,mel', 'pix dinheiro', '🍯'],
  ['Uvas de Jundiaí', 'hortifruti', 'uva niágara,uva itália', 'pix cartao', '🍇'],
  ['Couros do Sertão', 'artesanato', 'cintos,carteiras,bolsas', 'pix cartao', '👜'],
  ['Frango Assado do Tonho', 'comida', 'frango assado,farofa', 'pix cartao dinheiro', '🍗'],
  ['Batatas da Dona Maria', 'hortifruti', 'batata,batata-doce,cebola', 'dinheiro', '🥔'],
  ['Pimentas do Seu Zico', 'outros', 'pimenta,molho de pimenta', 'pix dinheiro', '🌶️'],
  ['Melancias do Valmir', 'hortifruti', 'melancia,melão', 'pix dinheiro', '🍉'],
  ['Churros da Feira', 'comida', 'churros,doce de leite', 'pix cartao dinheiro', '🍩'],
  ['Açougue Gaúcho', 'carnes', 'picanha,maminha,costela', 'pix cartao', '🥩'],
  ['Artesanato Mãos de Ouro', 'artesanato', 'bonecas de pano,enfeites', 'pix dinheiro', '🎀'],
  ['Abacates do Cerrado', 'hortifruti', 'abacate,manga', 'pix dinheiro', '🥑'],
  ['Café Torrado na Hora', 'outros', 'café em grão,café moído', 'pix cartao', '☕'],
  ['Tapiocaria Nordestina', 'comida', 'tapioca,beiju', 'pix cartao dinheiro', '🌮'],
  ['Pescados do Rio Grande', 'carnes', 'tilápia,pintado,pacu', 'pix cartao', '🐟'],
  ['Cerâmica da Terra', 'artesanato', 'moringas,panelas de barro', 'pix dinheiro', '🏺'],
  ['Cenouras e Beterrabas do Lu', 'hortifruti', 'cenoura,beterraba,rabanete', 'pix dinheiro', '🥕'],
  ['Queijaria Canastra', 'outros', 'queijo canastra,queijo meia-cura', 'pix cartao dinheiro', '🧀'],
  ['Yakisoba do Hiro', 'comida', 'yakisoba,guioza', 'pix cartao dinheiro', '🍜'],
  ['Granja Boa Esperança', 'carnes', 'frango,ovos caipira', 'pix cartao', '🐔'],
  ['Sementes e Mudas Verde Vida', 'outros', 'mudas de hortaliças,sementes', 'pix dinheiro', '🌱'],
  ['Limões do Gilberto', 'hortifruti', 'limão taiti,limão siciliano', 'pix dinheiro', '🍋'],
  ['Bolsas de Palha da Tê', 'artesanato', 'bolsas de palha,chapéus', 'pix cartao', '👒'],
  ['Garapa da Dona Zilda', 'comida', 'caldo de cana,pastel de vento', 'pix dinheiro', '🥤'],
  ['Embutidos Serra Gaúcha', 'carnes', 'salame,copa,linguiça', 'pix cartao', '🥓'],
  ['Hortifruti Família Souza', 'hortifruti', 'frutas,legumes', 'pix cartao dinheiro', '🍎'],
  ['Farinhas e Polvilhos', 'outros', 'farinha de mandioca,polvilho', 'pix dinheiro', '🌾'],
  ['Biscoitos da Roça', 'comida', 'biscoito de polvilho,pão de queijo', 'pix dinheiro', '🥨'],
  ['Cosméticos Naturais Ervas', 'artesanato', 'cremes naturais,óleos', 'pix cartao', '🧴'],
  ['Manga e Mamão do Chicão', 'hortifruti', 'manga,mamão', 'pix dinheiro', '🥭'],
  ['Castanhas e Nozes Norte', 'outros', 'castanha-do-pará,nozes', 'pix cartao dinheiro', '🥜'],
  ['Peixaria Bom Pescador', 'carnes', 'sardinha,cação,camarão', 'pix cartao', '🦐'],
  ['Doces da Dona Clara', 'comida', 'brigadeiro,cocada', 'pix dinheiro', '🍬'],
  ['Quadros e Telas do Beto', 'artesanato', 'quadros,molduras', 'pix cartao', '🖼️'],
  ['Folhagens Dona Vera', 'hortifruti', 'salsinha,cebolinha,coentro', 'dinheiro', '🌿'],
  ['Padaria da Roça', 'comida', 'pão caseiro,rosca', 'pix cartao dinheiro', '🍞'],
  ['Temperos Mineiros', 'outros', 'alho,colorau,sal temperado', 'pix dinheiro', '🧄'],
  ['Morangos do Sul', 'hortifruti', 'morango,mirtilo', 'pix cartao', '🍓'],
  ['Madeiras do Zé Carpinteiro', 'artesanato', 'tábuas,colheres de pau', 'pix dinheiro', '🥄'],
  ['Carnes Nobres do Ivo', 'carnes', 'carne bovina,cordeiro', 'pix cartao dinheiro', '🍖'],
  ['Laranjas do Seu Dito', 'hortifruti', 'laranja pera,laranja lima', 'pix dinheiro', '🍊'],
  ['Açaí da Feira', 'comida', 'açaí,cupuaçu', 'pix cartao dinheiro', '🍧'],
  ['Aviamentos da Rosa', 'outros', 'linhas,botões,zíperes', 'pix dinheiro', '🧵'],
  ['Repolhos e Brócolis do Neto', 'hortifruti', 'repolho,brócolis,couve-flor', 'pix dinheiro', '🥦'],
  ['Utensílios de Alumínio', 'outros', 'panelas,formas,caldeirões', 'pix cartao dinheiro', '🍳'],
];

// Barracas cuja etiqueta ainda não foi lida na montagem de hoje: começam fora do mapa.
export const PENDENTES_MOCK = [28, 47, 63, 71, 88, 94];

/** UID de etiqueta determinístico por número de barraca (formato NTAG, 7 bytes). */
export function uidDaBarraca(numero) {
  return ['04', ...[numero, numero * 7, numero * 13, numero * 29, numero * 53, 0x80 | numero]
    .map(v => (v % 256).toString(16).padStart(2, '0'))].join(':').toUpperCase();
}

/** Banco completo em memória, com ids legíveis. A vaga habitual da barraca N é a vaga de ordem N-1. */
export function gerarDadosMock(dataHoje) {
  const { planta, vagas } = gerarPlanta();
  const feira = { id: 'feira-1', ...FEIRA_MOCK, planta };
  const vagasDb = vagas.map(v => ({ ...v, id: `vaga-${v.codigo}`, feira_id: feira.id }));
  const barracas = BARRACAS_MOCK.map(([nome, categoria, produtos, pagamentos, icone], i) => ({
    id: `barraca-${i + 1}`, feira_id: feira.id, numero: i + 1, nome, categoria, icone,
    produtos: produtos.split(','), pagamentos: pagamentos.split(' '), vaga_habitual_id: vagasDb[i].id,
  }));
  const etiquetas = barracas.map(b => ({ uid: uidDaBarraca(b.numero), barraca_id: b.id }));
  const montagem = { id: `montagem-${dataHoje}`, feira_id: feira.id, data: dataHoje };
  const presencas = barracas.filter(b => !PENDENTES_MOCK.includes(b.numero)).map((b, i) => ({
    id: `presenca-${b.numero}`, montagem_id: montagem.id, barraca_id: b.id, vaga_id: b.vaga_habitual_id,
    precisao_m: 3 + (i % 5), lido_em: `${dataHoje}T09:${String(10 + (i % 50)).padStart(2, '0')}:00.000Z`,
  }));
  return { feira, vagas: vagasDb, barracas, etiquetas, montagens: [montagem], presencas };
}
