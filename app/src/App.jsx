import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { IconSprite } from './components/Icon.jsx';
import { Carregando, TelaErro } from './components/Avisos.jsx';
import { FeiraProvider, useFeira } from './data/FeiraContext.jsx';
import { LocalizacaoProvider } from './data/LocalizacaoContext.jsx';
import Entrada from './pages/Entrada.jsx';
import Mapa from './pages/Mapa.jsx';
import Busca from './pages/Busca.jsx';
import DetalheBarraca from './pages/DetalheBarraca.jsx';
import Navegacao from './pages/Navegacao.jsx';
import AreaOrganizador from './pages/organizador/AreaOrganizador.jsx';
import Painel from './pages/organizador/Painel.jsx';
import Montagem from './pages/organizador/Montagem.jsx';
import ListaBarracas from './pages/organizador/ListaBarracas.jsx';
import EditarBarraca from './pages/organizador/EditarBarraca.jsx';

function Rotas() {
  const f = useFeira();
  if (f.carregando) return <Carregando />;
  if (!f.feira) return <TelaErro erro={f.erro} aoTentar={f.recarregar} />;
  return (
    <LocalizacaoProvider>
      <Routes>
        <Route path="/" element={<Entrada />} />
        <Route path="/mapa" element={<Mapa />} />
        <Route path="/busca" element={<Busca />} />
        <Route path="/barraca/:numero" element={<DetalheBarraca />} />
        <Route path="/ir/:numero" element={<Navegacao />} />
        <Route path="/organizador" element={<AreaOrganizador />}>
          <Route index element={<Painel />} />
          <Route path="montagem" element={<Montagem />} />
          <Route path="barracas" element={<ListaBarracas />} />
          <Route path="barracas/:numero" element={<EditarBarraca />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </LocalizacaoProvider>
  );
}

// HashRouter: as rotas funcionam em hospedagem estática (GitHub Pages) sem configurar o servidor.
export default function App() {
  return (
    <HashRouter>
      <IconSprite />
      <div className="app">
        <FeiraProvider><Rotas /></FeiraProvider>
      </div>
    </HashRouter>
  );
}
