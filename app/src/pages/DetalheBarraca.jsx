import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FeiraMap from '../components/FeiraMap.jsx';
import BottomSheet from '../components/BottomSheet.jsx';
import Icon from '../components/Icon.jsx';
import { CardBarraca, Cardapio, Pagamentos, Selo } from '../components/Barraca.jsx';
import { Banner } from '../components/Avisos.jsx';
import { useFeira } from '../data/FeiraContext.jsx';
import { useLocalizacao } from '../data/LocalizacaoContext.jsx';
import { CATEGORIAS, corDa } from '../lib/categorias.js';
import { fundoDa } from '../lib/fotos.js';
import { calcularRota, frenteDaVaga, metrosAte } from '../lib/rota.js';

const SHEET = 520;

export default function DetalheBarraca() {
  const { numero } = useParams();
  const f = useFeira();
  const loc = useLocalizacao();
  const navegar = useNavigate();
  const barraca = f.porNumero(numero);
  const vaga = barraca ? f.vagaDa(barraca) : null;

  // barraca que não veio: sugere as mais próximas que vendem algo parecido
  const parecidas = useMemo(() => {
    if (!barraca || vaga) return [];
    const produtos = new Set(barraca.produtos.flatMap(p => p.split(' ')));
    return f.presentes
      .map(b => ({ b, v: f.vagaDa(b), afinidade: (b.categoria === barraca.categoria ? 1 : 0) + b.produtos.flatMap(p => p.split(' ')).filter(p => produtos.has(p)).length * 2 }))
      .filter(x => x.afinidade > 0)
      .map(x => ({ ...x, m: metrosAte(f.planta, loc.pos, x.v) }))
      .sort((a, z) => z.afinidade - a.afinidade || (a.m ?? 0) - (z.m ?? 0))
      .slice(0, 3);
  }, [barraca, vaga, f, loc.pos]);

  if (!barraca) {
    return <div className="tela"><div className="centro"><p className="t-sub">Barraca {numero} não existe nesta feira.</p><button className="btn btn-primary" onClick={() => navegar('/mapa')}>Voltar ao mapa</button></div></div>;
  }

  const rota = vaga && loc.pos ? calcularRota(f.planta, loc.pos, vaga) : null;
  const metros = metrosAte(f.planta, loc.pos, vaga);
  const cat = CATEGORIAS[barraca.categoria].nome;

  return (
    <div className="tela">
      <div className="mapwrap">
        <FeiraMap
          planta={f.planta} vagas={f.vagas} ocupacao={f.ocupacao} selecionada={barraca.id} usuario={loc.pos} precisao={loc.precisao}
          rota={rota} enquadrar={vaga ? [frenteDaVaga(f.planta, vaga), ...(loc.pos ? [loc.pos] : [])] : undefined}
          zoom={vaga ? 'perto' : 'longe'} chaveCamera={`barraca-${barraca.id}-${!!vaga}`} margemInferior={SHEET}
          onSelecionar={b => navegar(`/barraca/${b.numero}`, { replace: true })}
        />
        <div className="mapa-topo"><button className="icon-btn raised" aria-label="Voltar" onClick={() => navegar(-1)}><Icon nome="back" /></button></div>
      </div>
      <BottomSheet alturas={[160, SHEET, 760]} inicial={1}>
        {vaga ? (
          <>
            <div className="capa" style={fundoDa(barraca)}>
              <span className="pilula"><span className="dot" style={{ background: corDa(barraca.categoria) }} />{cat}</span>
            </div>
            <div>
              <div className="titulo-barraca"><h1>{barraca.nome}</h1><span className="num">Nº {barraca.numero}</span></div>
              <div className="t-caption" style={{ marginTop: 4 }}>Corredor {vaga.corredor}, vaga {vaga.codigo}{metros != null ? ` · a ${Math.round(metros)} m de você` : ''}</div>
            </div>
            <div className="pays">{barraca.produtos.map(p => <span key={p} className="tag">{p}</span>)}</div>
            <Cardapio barraca={barraca} />
            <div><div className="list-title">Pagamento</div><div style={{ marginTop: 6 }}><Pagamentos barraca={barraca} /></div></div>
            <button className="btn btn-primary btn-block cta-fixo" onClick={() => navegar(`/ir/${barraca.numero}`)}>
              <Icon nome="route" />Ir até lá{metros != null ? ` · ${Math.round(metros)} m` : ''}
            </button>
          </>
        ) : (
          <>
            <div className="row" style={{ alignItems: 'flex-start', gap: 14 }}>
              <Selo barraca={barraca} ausente />
              <div style={{ flex: 1 }}><h1 className="t-sub">{barraca.nome}</h1><div className="t-caption">{cat}</div></div>
            </div>
            <Banner tipo="alerta" icone="info" titulo="Esta barraca não veio hoje">A etiqueta dela ainda não foi lida na montagem desta feira.</Banner>
            {parecidas.length > 0 && <div className="list-title">Também vendem algo parecido</div>}
            {parecidas.map(({ b, v, m }) => <CardBarraca key={b.id} foto barraca={b} vaga={v} metros={m} onClick={() => navegar(`/barraca/${b.numero}`)} />)}
          </>
        )}
      </BottomSheet>
    </div>
  );
}
