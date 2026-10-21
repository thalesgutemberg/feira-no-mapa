// Gera supabase/seed.sql a partir dos mesmos dados do modo de demonstração.
// Uso: npm run seed:sql
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { gerarDadosMock } from '../src/data/mock.js';

const q = v => v == null ? 'null' : `'${String(v).replace(/'/g, "''")}'`;
const arr = a => `array[${a.map(q).join(', ')}]::text[]`;

const db = gerarDadosMock('2000-01-01');
const { feira, vagas, barracas, etiquetas, presencas } = db;
const numeroDe = Object.fromEntries(barracas.map(b => [b.id, b.numero]));
const codigoDe = Object.fromEntries(vagas.map(v => [v.id, v.codigo]));
const F = `(select id from feiras where slug = ${q(feira.slug)})`;

const linhas = [];
linhas.push('-- Gerado por scripts/gerar-seed.mjs. Não edite à mão.');
linhas.push(`-- Feira fictícia com ${barracas.length} barracas e ${vagas.length} vagas. A montagem de hoje já vem com ${presencas.length} barracas lidas.`);
linhas.push('begin;');
linhas.push(`insert into feiras (slug, nome, endereco, horario, origem_lat, origem_lng, planta) values (${q(feira.slug)}, ${q(feira.nome)}, ${q(feira.endereco)}, ${q(feira.horario)}, ${feira.origem_lat}, ${feira.origem_lng}, ${q(JSON.stringify(feira.planta))}::jsonb);`);

linhas.push('insert into vagas (feira_id, codigo, fileira, corredor, lado, ordem, x_m, y_m, larg_m, alt_m) values');
linhas.push(vagas.map(v => `  (${F}, ${q(v.codigo)}, ${q(v.fileira)}, ${v.corredor}, ${q(v.lado)}, ${v.ordem}, ${v.x_m}, ${v.y_m}, ${v.larg_m}, ${v.alt_m})`).join(',\n') + ';');

linhas.push('insert into barracas (feira_id, numero, nome, categoria, icone, produtos, pagamentos, vaga_habitual_id) values');
linhas.push(barracas.map(b => `  (${F}, ${b.numero}, ${q(b.nome)}, ${q(b.categoria)}, ${q(b.icone)}, ${arr(b.produtos)}, ${arr(b.pagamentos)}, (select id from vagas where feira_id = ${F} and codigo = ${q(codigoDe[b.vaga_habitual_id])}))`).join(',\n') + ';');

linhas.push('insert into etiquetas_nfc (uid, barraca_id) values');
linhas.push(etiquetas.map(e => `  (${q(e.uid)}, (select id from barracas where feira_id = ${F} and numero = ${numeroDe[e.barraca_id]}))`).join(',\n') + ';');

linhas.push(`-- Montagem de hoje já em andamento, para o mapa do cliente aparecer cheio.`);
linhas.push(`insert into montagens (feira_id, data) values (${F}, hoje_sp());`);
linhas.push('insert into presencas (montagem_id, barraca_id, vaga_id, precisao_m) values');
linhas.push(presencas.map(p => `  ((select id from montagens where feira_id = ${F} and data = hoje_sp()), (select id from barracas where feira_id = ${F} and numero = ${numeroDe[p.barraca_id]}), (select id from vagas where feira_id = ${F} and codigo = ${q(codigoDe[p.vaga_id])}), ${p.precisao_m})`).join(',\n') + ';');
linhas.push('commit;');
linhas.push('');
linhas.push('-- Depois de criar o seu usuário em Authentication > Users, dê a ele acesso de organizador:');
linhas.push(`-- insert into organizadores (user_id, feira_id) select id, ${F} from auth.users where email = 'seu-email@exemplo.com';`);
linhas.push('');

const destino = fileURLToPath(new URL('../supabase/seed.sql', import.meta.url));
writeFileSync(destino, linhas.join('\n'), 'utf8');
console.log(`seed.sql gerado: ${barracas.length} barracas, ${vagas.length} vagas, ${etiquetas.length} etiquetas, ${presencas.length} presenças.`);
