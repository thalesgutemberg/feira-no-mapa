// Dados fictícios de uma feira noturna de praça com 80 barracas. Usados pelo modo de demonstração (mockAdapter)
// e pelo script que gera o seed do Supabase, para que os dois modos tenham os mesmos dados.
import { gerarPlanta } from '../lib/planta.js';

export const FEIRA_MOCK = {
  slug: 'feira-luar',
  nome: 'Feira Luar na Praça',
  endereco: 'Praça das Acácias (endereço fictício), João Pessoa',
  horario: 'Sextas e sábados, das 17h às 23h',
  origem_lat: -7.1195,
  origem_lng: -34.845,
  // Atrações do palco. Só existe na demonstração: o banco ainda não tem onde guardar a programação.
  programacao: [
    { hora: '18h', nome: 'DJ Brisa', estilo: 'Brasilidades para abrir a noite' },
    { hora: '19h30', nome: 'Trio Flor de Mandacaru', estilo: 'Forró pé de serra' },
    { hora: '21h30', nome: 'Banda Maré Cheia', estilo: 'MPB e samba' },
  ],
};

// [nome, categoria, palavras de busca, pagamentos, ícone, cardápio]. O número da barraca é a posição na lista.
// Cardápio: itens separados por ";", cada um no formato "nome=preço em reais".
export const BARRACAS_MOCK = [
  ['Brasa Burger', 'comida', 'hambúrguer,smash,batata frita', 'pix cartao dinheiro', '🍔', 'Smash clássico=28;Cheese bacon=34;Burger vegetariano=30;Batata rústica=18'],
  ['Cervejaria Maré Alta', 'bebidas', 'cerveja artesanal,chope,ipa', 'pix cartao', '🍺', 'Chope pilsen 400 ml=14;IPA 400 ml=18;Weiss 400 ml=17;Growler 1 L=38'],
  ['Tapioca da Lua', 'comida', 'tapioca,cuscuz', 'pix cartao dinheiro', '🌮', 'Tapioca de carne de sol com coalho=22;Tapioca de frango com catupiry=18;Tapioca de coco com leite condensado=14;Cuscuz recheado=20'],
  ['Brigaderia Doce Noite', 'doces', 'brigadeiro,brownie', 'pix cartao', '🍫', 'Brigadeiro tradicional=5;Brigadeiro de pistache=7;Caixa com 6=27;Brownie=12'],
  ['Ateliê Barro e Mar', 'artesanato', 'cerâmica,canecas,vasos', 'pix cartao', '🏺', 'Caneca esmaltada=45;Vaso pequeno=60;Prato de parede=85'],
  ['Pizza na Pedra', 'comida', 'pizza,fatia,calabresa', 'pix cartao dinheiro', '🍕', 'Fatia de margherita=14;Fatia de calabresa=14;Fatia de quatro queijos=16;Pizza individual=38'],
  ['Drinks do Farol', 'bebidas', 'drinks,caipirinha,gin tônica', 'pix cartao', '🍹', 'Caipirinha de limão=18;Caipifruta de cajá=20;Gin tônica=26;Mojito=24'],
  ['Espetinho do Mestre', 'comida', 'espetinho,churrasco,pão de alho', 'pix cartao dinheiro', '🍢', 'Espetinho de carne=10;Espetinho de frango com bacon=10;Queijo coalho na brasa=9;Pão de alho=8'],
  ['Crochê da Tereza', 'artesanato', 'crochê,bolsas,tapetes', 'pix dinheiro', '🧶', 'Bolsa de crochê=90;Sousplat=25;Tapete redondo=140'],
  ['Açaí Ponta Verde', 'doces', 'açaí,cupuaçu,vitamina', 'pix cartao dinheiro', '🍧', 'Açaí 300 ml=16;Açaí 500 ml=22;Creme de cupuaçu 300 ml=17;Adicional de frutas=4'],
  ['Sushi da Praça', 'comida', 'sushi,temaki,japonesa', 'pix cartao', '🍣', 'Temaki de salmão=30;Combo com 12 peças=42;Hot roll com 8 peças=26;Sunomono=12'],
  ['Empório do Queijo', 'outros', 'queijos,geleias,embutidos', 'pix cartao dinheiro', '🧀', 'Queijo coalho 500 g=32;Queijo manteiga 500 g=36;Geleia de pimenta=22;Tábua de frios=48'],
  ['Pastel da Vila', 'comida', 'pastel,caldo de cana', 'pix cartao dinheiro', '🥟', 'Pastel de carne=10;Pastel de queijo=10;Pastel de camarão=14;Caldo de cana 400 ml=8'],
  ['Hop House', 'bebidas', 'cerveja artesanal,chope,stout', 'pix cartao', '🍻', 'American lager 400 ml=15;Session IPA 400 ml=19;Stout 400 ml=20;Régua com 4 estilos=36'],
  ['Macramê Nó de Rede', 'artesanato', 'macramê,suporte de planta,decoração', 'pix cartao', '🌿', 'Suporte de planta=55;Painel de parede=160;Chaveiro=18'],
  ['Crepe Francês da Sofia', 'comida', 'crepe,crepe doce,crepe salgado', 'pix cartao', '🥞', 'Crepe de frango com requeijão=22;Crepe de carne de sol=26;Crepe de chocolate com morango=20;Crepe de doce de leite=18'],
  ['Churros Don Paco', 'doces', 'churros,doce de leite', 'pix cartao dinheiro', '🍩', 'Churros tradicional=10;Churros recheado=13;Churros gourmet com sorvete=20'],
  ['Hot Dog do Careca', 'comida', 'cachorro-quente,hot dog', 'pix cartao dinheiro', '🌭', 'Hot dog simples=12;Hot dog completo=17;Hot dog de linguiça artesanal=20;Refrigerante lata=6'],
  ['Biju da Marina', 'artesanato', 'bijuterias,brincos,colares', 'pix cartao', '💍', 'Brinco=25;Colar=40;Pulseira=30;Kit com 3 peças=80'],
  ['Café Passado na Hora', 'bebidas', 'café,cappuccino,chocolate quente', 'pix cartao dinheiro', '☕', 'Café coado=6;Cappuccino=12;Chocolate quente=13;Bolo de rolo, fatia=8'],
  ['Arretado Burger', 'comida', 'hambúrguer,carne de sol,sanduíche', 'pix cartao', '🍔', 'Burger de carne de sol=36;Burger de costela=38;Burger de grão-de-bico=30;Macaxeira frita=18'],
  ['Sabores do Sertão', 'comida', 'carne de sol,baião de dois,macaxeira', 'pix cartao dinheiro', '🍲', 'Carne de sol com macaxeira=38;Baião de dois=28;Escondidinho de charque=30;Rubacão=32'],
  ['Velas Aroma da Mata', 'artesanato', 'velas,aromatizadores,sabonetes', 'pix cartao', '🕯️', 'Vela aromática 150 g=42;Aromatizador de ambiente=48;Sabonete artesanal=15'],
  ['Sorveteria Tropical', 'doces', 'sorvete,picolé,frutas regionais', 'pix cartao dinheiro', '🍦', 'Uma bola=9;Duas bolas=15;Picolé de fruta=7;Milk-shake=18'],
  ['Kombucha Viva', 'bebidas', 'kombucha,suco natural,sem álcool', 'pix cartao', '🧃', 'Kombucha de gengibre 300 ml=14;Kombucha de hibisco 300 ml=14;Suco de cajá 400 ml=10;Água de coco=8'],
  ['Taco Loco', 'comida', 'tacos,burrito,nachos,mexicana', 'pix cartao', '🌯', 'Taco de carne, 2 unidades=24;Burrito de frango=28;Nachos com guacamole=26;Quesadilla=22'],
  ['Estampa Paraíba', 'outros', 'camisetas,ecobags,moda', 'pix cartao', '👕', 'Camiseta estampada=69;Ecobag=35;Boné=55'],
  ['Acarajé da Nêga', 'comida', 'acarajé,abará,vatapá', 'pix dinheiro', '🧆', 'Acarajé completo=18;Acarajé sem camarão=14;Abará=16;Cocada=6'],
  ['Bolo de Pote da Bia', 'doces', 'bolo de pote,pudim', 'pix dinheiro', '🍰', 'Bolo de pote de ninho com morango=14;Bolo de pote de chocolate=13;Pudim=10'],
  ['Vinhos e Tábuas', 'bebidas', 'vinho,espumante,queijos', 'pix cartao', '🍷', 'Taça de tinto=22;Taça de branco=22;Espumante, taça=24;Tábua de queijos=52'],
  ['Madeira Viva', 'artesanato', 'tábuas de madeira,colheres,decoração', 'pix cartao', '🥄', 'Tábua de corte=75;Colher de pau entalhada=28;Porta-copos, 4 unidades=40'],
  ['Massas da Nonna', 'comida', 'massa,nhoque,lasanha,italiana', 'pix cartao', '🍝', 'Nhoque ao sugo=30;Talharim ao pesto=32;Lasanha à bolonhesa=34;Bruschetta=18'],
  ['Pipoca Gourmet Pop', 'doces', 'pipoca,caramelo', 'pix cartao dinheiro', '🍿', 'Pipoca salgada=8;Pipoca de caramelo=12;Pipoca de leite ninho=14'],
  ['Caldinho do Pescador', 'comida', 'caldinho,caldo de feijão,frutos do mar', 'pix cartao dinheiro', '🥣', 'Caldinho de feijão=10;Caldinho de camarão=14;Caldinho de sururu=13;Bolinho de peixe, 6 unidades=20'],
  ['Renda Renascença', 'artesanato', 'renda,bordado,toalhas', 'pix cartao dinheiro', '🧵', 'Caminho de mesa=180;Toalhinha de renda=60;Marcador de livro=20'],
  ['Cachaçaria do Brejo', 'bebidas', 'cachaça,licor,degustação', 'pix cartao', '🥃', 'Dose de cachaça envelhecida=12;Degustação com 4 doses=30;Licor de jenipapo, dose=10;Garrafa 500 ml=65'],
  ['Wrap e Salada', 'comida', 'wrap,salada,vegano,saudável', 'pix cartao', '🥗', 'Wrap de frango=24;Wrap vegano de falafel=24;Salada no pote=22;Suco verde=10'],
  ['Plantas do Quintal', 'outros', 'suculentas,mudas,vasos', 'pix dinheiro', '🌵', 'Suculenta pequena=12;Kokedama=45;Vaso de cimento=30'],
  ['Coxinha de Ouro', 'comida', 'coxinha,salgados,empada', 'pix cartao dinheiro', '🍗', 'Coxinha de frango=8;Coxinha de carne de sol=10;Empada de camarão=10;Porção de mini salgados=22'],
  ['Cookies da Clara', 'doces', 'cookies,brownie', 'pix cartao', '🍪', 'Cookie tradicional=10;Cookie recheado de nutella=14;Brownie com castanha=13;Caixa com 4 cookies=36'],
  ['Parrilla Uruguaia', 'comida', 'choripán,churrasco,sanduíche', 'pix cartao', '🥩', 'Choripán=22;Sanduíche de fraldinha=36;Porção de linguiça=30;Chimichurri extra=4'],
  ['Couro Cabra Macho', 'artesanato', 'couro,sandálias,carteiras,cintos', 'pix cartao', '👜', 'Sandália de couro=120;Carteira=80;Cinto=95'],
  ['Limonada da Praça', 'bebidas', 'limonada,chá gelado,sem álcool', 'pix dinheiro', '🍋', 'Limonada suíça 400 ml=10;Limonada rosa 400 ml=12;Chá gelado de pêssego=10'],
  ['Yakisoba do Kenji', 'comida', 'yakisoba,guioza,rolinho primavera', 'pix cartao dinheiro', '🍜', 'Yakisoba de carne=28;Yakisoba de legumes=24;Guioza com 6 unidades=20;Rolinho primavera=8'],
  ['Cocada da Vó Dita', 'doces', 'cocada,doce de leite,doces regionais', 'dinheiro pix', '🥥', 'Cocada branca=6;Cocada queimada=6;Doce de leite em barra=8;Pé de moleque=5'],
  ['Cuscuzeria Nordestina', 'comida', 'cuscuz,carne de sol,queijo coalho', 'pix cartao dinheiro', '🌽', 'Cuscuz com carne de sol=24;Cuscuz com queijo coalho=18;Cuscuz com ovo e manteiga=14;Café com leite=6'],
  ['Sebo do Poeta', 'outros', 'livros usados,cordel,vinil', 'pix dinheiro', '📚', 'Livro usado=15;Folheto de cordel=8;Disco de vinil=40'],
  ['Empanadas del Sur', 'comida', 'empanadas,argentina', 'pix cartao', '🥟', 'Empanada de carne=12;Empanada de queijo e cebola=12;Empanada de frango=12;Combo com 3=32'],
  ['Xilogravura Borges', 'artesanato', 'xilogravura,quadros,cordel', 'pix cartao', '🖼️', 'Gravura pequena=50;Gravura emoldurada=160;Cartão postal=10'],
  ['Chope do Bessa', 'bebidas', 'chope,cerveja artesanal,pilsen', 'pix cartao dinheiro', '🍺', 'Chope pilsen 300 ml=10;Chope pilsen 500 ml=15;Chope de vinho 300 ml=12;Chope black 300 ml=13'],
  ['Batata Recheada do Tio', 'comida', 'batata recheada,batata frita', 'pix cartao dinheiro', '🥔', 'Batata recheada de frango=26;Batata recheada de charque=28;Batata frita com cheddar e bacon=24'],
  ['Palha Italiana da Ju', 'doces', 'palha italiana,trufas', 'pix', '🍬', 'Palha italiana tradicional=8;Palha italiana de ninho=9;Trufa=6;Caixa presente=40'],
  ['Arepas Caribe', 'comida', 'arepa,venezuelana,sem glúten', 'pix cartao', '🥙', 'Arepa de carne desfiada=22;Arepa de frango com abacate=24;Arepa de queijo=18;Tequeños, 5 unidades=20'],
  ['Sabão e Flor', 'artesanato', 'sabonetes,cosméticos naturais,óleos', 'pix cartao', '🧼', 'Sabonete de argila=16;Xampu sólido=32;Óleo corporal=48'],
  ['Hidromel dos Vikings', 'bebidas', 'hidromel,sidra', 'pix cartao', '🍯', 'Hidromel tradicional, taça=18;Hidromel com frutas vermelhas, taça=20;Garrafa 500 ml=70'],
  ['Risoto no Parmesão', 'comida', 'risoto,gourmet,camarão', 'pix cartao', '🍛', 'Risoto de funghi=38;Risoto de camarão=46;Risoto de carne de sol com coalho=42'],
  ['Brinquedos de Madeira Zé Pião', 'artesanato', 'brinquedos,pião,infantil', 'pix dinheiro', '🧸', 'Pião=15;Carrinho de madeira=45;Quebra-cabeça=38'],
  ['Milho da Praça', 'comida', 'milho verde,pamonha,canjica', 'pix dinheiro', '🌽', 'Milho cozido=7;Milho assado=8;Pamonha=9;Canjica, copo=8'],
  ['Tortas da Helena', 'doces', 'torta,cheesecake,fatia', 'pix cartao', '🥧', 'Fatia de torta de limão=14;Fatia de cheesecake de goiabada=16;Fatia de banoffee=15'],
  ['Gin Garden', 'bebidas', 'gin,drinks,spritz', 'pix cartao', '🍸', 'Gin tônica clássica=26;Gin com frutas vermelhas=30;Aperol spritz=28;Moscow mule=28'],
  ['Kebab Istambul', 'comida', 'kebab,falafel,árabe,esfiha', 'pix cartao', '🥙', 'Kebab de carne=28;Kebab de falafel=26;Esfiha aberta=9;Homus com pão sírio=20'],
  ['Pet Chic', 'outros', 'pet,coleiras,petiscos', 'pix cartao', '🐶', 'Bandana para pet=20;Coleira artesanal=45;Petisco natural=18'],
  ['Camarão no Bafo', 'comida', 'camarão,frutos do mar,peixe frito', 'pix cartao', '🦐', 'Camarão alho e óleo=45;Espetinho de camarão=16;Isca de peixe=34;Arroz de polvo=48'],
  ['Papel e Tinta', 'artesanato', 'aquarela,cadernos,papelaria', 'pix cartao', '🎨', 'Caderno costurado à mão=48;Aquarela original=120;Adesivos, cartela=12'],
  ['Waffle Belga', 'doces', 'waffle,nutella,sorvete', 'pix cartao', '🧇', 'Waffle com nutella=20;Waffle com doce de leite=18;Waffle com sorvete=24'],
  ['Feijoada da Praça', 'comida', 'feijoada,feijão tropeiro,torresmo', 'pix cartao dinheiro', '🍛', 'Feijoada individual=34;Feijão tropeiro=28;Torresmo de rolo=22'],
  ['Sucos da Feirinha', 'bebidas', 'suco natural,vitamina,sem álcool', 'pix dinheiro', '🥤', 'Suco de cajá 400 ml=9;Suco de acerola com laranja=9;Vitamina de banana=10;Água mineral=4'],
  ['Pão na Chapa Gourmet', 'comida', 'sanduíche,queijo quente,misto', 'pix cartao', '🥪', 'Queijo quente de coalho=16;Sanduíche de pernil=24;Croque monsieur=26;Pão de queijo recheado=12'],
  ['Redes Mamanguape', 'artesanato', 'redes,mantas,tecelagem', 'pix cartao dinheiro', '🧺', 'Rede de casal=190;Manta de sofá=110;Jogo americano, 4 unidades=60'],
  ['Mel e Cia', 'outros', 'mel,própolis,castanhas', 'pix dinheiro', '🍯', 'Mel silvestre 500 g=35;Extrato de própolis=28;Castanha de caju 200 g=26'],
  ['Poke do Mar', 'comida', 'poke,salmão,atum,saudável', 'pix cartao', '🥗', 'Poke de salmão=40;Poke de atum=40;Poke vegano de shimeji=34'],
  ['Trufas Cacau Nativo', 'doces', 'chocolate,trufas,barra artesanal', 'pix cartao', '🍫', 'Trufa=7;Barra 70% cacau=28;Chocolate quente cremoso=15;Caixa com 9 trufas=55'],
  ['Cervejaria Tambaú', 'bebidas', 'cerveja artesanal,chope,sour', 'pix cartao', '🍻', 'Witbier 400 ml=17;Sour de cajá 400 ml=20;APA 400 ml=18;Lata para levar=22'],
  ['Mandala Mosaico', 'artesanato', 'mosaico,mandalas,espelhos', 'pix cartao', '💠', 'Mandala pequena=70;Espelho com moldura de mosaico=180;Ímã de geladeira=15'],
  ['Galeto do Vale', 'comida', 'galeto,frango assado,polenta frita', 'pix cartao dinheiro', '🍗', 'Meio galeto com fritas=36;Galeto inteiro=62;Polenta frita=18;Farofa=10'],
  ['Brechó Lua Cheia', 'outros', 'brechó,roupas,vintage', 'pix dinheiro', '👗', 'Camisa=30;Vestido=50;Jaqueta jeans=80'],
  ['Bao da Rua', 'comida', 'bao,porco,asiática', 'pix cartao', '🥠', 'Bao de barriga de porco=24;Bao de frango crocante=22;Bao de shimeji=22;Combo com 2 baos e bebida=48'],
  ['Mocktails da Lua', 'bebidas', 'drinks sem álcool,soda italiana', 'pix cartao', '🥤', 'Soda italiana de maçã verde=12;Pink lemonade=14;Mojito sem álcool=16'],
  ['Tricô da Vó Lia', 'artesanato', 'tricô,amigurumi,toucas', 'pix dinheiro', '🧶', 'Amigurumi pequeno=45;Touca=38;Sapatinho de bebê=30'],
  ['Algodão Doce do Palhaço', 'doces', 'algodão doce,maçã do amor,infantil', 'dinheiro pix', '🍭', 'Algodão doce=8;Maçã do amor=10;Pirulito artesanal=5'],
];

// Barracas cuja etiqueta ainda não foi lida na montagem de hoje: começam fora do mapa.
export const PENDENTES_MOCK = [28, 47, 63, 71];

/** UID de etiqueta determinístico por número de barraca (formato NTAG, 7 bytes). */
export function uidDaBarraca(numero) {
  return ['04', ...[numero, numero * 7, numero * 13, numero * 29, numero * 53, 0x80 | numero]
    .map(v => (v % 256).toString(16).padStart(2, '0'))].join(':').toUpperCase();
}

const lerCardapio = texto => texto.split(';').map(item => {
  const i = item.lastIndexOf('=');
  return { nome: item.slice(0, i).trim(), preco: Number(item.slice(i + 1)) };
});

/** Banco completo em memória, com ids legíveis. A vaga habitual da barraca N é a vaga de ordem N-1. */
export function gerarDadosMock(dataHoje) {
  const { planta, vagas } = gerarPlanta();
  const feira = { id: 'feira-1', ...FEIRA_MOCK, planta };
  const vagasDb = vagas.map(v => ({ ...v, id: `vaga-${v.codigo}`, feira_id: feira.id }));
  const barracas = BARRACAS_MOCK.map(([nome, categoria, produtos, pagamentos, icone, cardapio], i) => ({
    id: `barraca-${i + 1}`, feira_id: feira.id, numero: i + 1, nome, categoria, icone,
    produtos: produtos.split(','), pagamentos: pagamentos.split(' '), cardapio: lerCardapio(cardapio),
    vaga_habitual_id: vagasDb[i].id,
  }));
  const etiquetas = barracas.map(b => ({ uid: uidDaBarraca(b.numero), barraca_id: b.id }));
  const montagem = { id: `montagem-${dataHoje}`, feira_id: feira.id, data: dataHoje };
  const presencas = barracas.filter(b => !PENDENTES_MOCK.includes(b.numero)).map((b, i) => ({
    id: `presenca-${b.numero}`, montagem_id: montagem.id, barraca_id: b.id, vaga_id: b.vaga_habitual_id,
    precisao_m: 3 + (i % 5), lido_em: `${dataHoje}T19:${String(10 + (i % 50)).padStart(2, '0')}:00.000Z`,
  }));
  return { feira, vagas: vagasDb, barracas, etiquetas, montagens: [montagem], presencas };
}
