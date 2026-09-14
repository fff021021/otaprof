// アプリのルーティング設定
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ProfileEditor from './pages/ProfileEditor';
import ProfileView from './pages/ProfileView';
import FukyoEditor from './pages/FukyoEditor';
import FukyoView from './pages/FukyoView';
import MatchResult from './pages/MatchResult';

export default function App() {
  return (
    // HashRouter を使用することで、静的ホスティング環境（GitHub Pages等）でも動作する
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/profile/edit" element={<ProfileEditor />} />
          <Route path="/profile/view" element={<ProfileView />} />
          <Route path="/fukyo/edit" element={<FukyoEditor />} />
          <Route path="/fukyo/view" element={<FukyoView />} />
          <Route path="/match" element={<MatchResult />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
