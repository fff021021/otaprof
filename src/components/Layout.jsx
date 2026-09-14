// 共通レイアウトコンポーネント
import { NavLink, Outlet, useLocation } from 'react-router-dom';

export default function Layout() {
  const location = useLocation();

  // 閲覧専用ページ（シェアビュー）ではナビを非表示にする
  const isViewPage =
    location.pathname.includes('/profile/view') ||
    location.pathname.includes('/fukyo/view');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isViewPage && (
        <nav className="nav">
          <div className="nav-inner">
            <ul className="nav-links">
              <li>
                <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
                  ホーム
                </NavLink>
              </li>
              <li>
                <NavLink to="/profile/edit" className={({ isActive }) => isActive ? 'active' : ''}>
                  プロフィール作成
                </NavLink>
              </li>
              <li>
                <NavLink to="/fukyo/edit" className={({ isActive }) => isActive ? 'active' : ''}>
                  布教ページ作成
                </NavLink>
              </li>
              <li>
                <NavLink to="/match" className={({ isActive }) => isActive ? 'active' : ''}>
                  相性チェック
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
      )}

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <footer className="footer">
        <p className="footer-copy">© 2026 fuwafuwaproduct</p>
      </footer>
    </div>
  );
}
