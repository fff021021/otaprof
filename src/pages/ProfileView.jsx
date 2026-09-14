// プロフィール閲覧ページ（オタク名刺）
// 自分の名刺プレビュー + 共有URL生成 + カラーピッカー
import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import ColorPicker from '../components/ColorPicker';
import { decodeData, generateProfileShareUrl } from '../utils/shareUtils';
import { VALUES_QUESTIONS, SNS_STYLE_OPTIONS } from './Home';

const STORAGE_KEY = 'otakatsu_profile';

// 価値観の値をテキストに変換
function valLabel(question, value) {
  const ratio = (value - 1) / 4; // 0〜1
  if (ratio < 0.3) return question.leftLabel;
  if (ratio > 0.7) return question.rightLabel;
  return 'どちらでもある';
}

export default function ProfileView() {
  const [searchParams] = useSearchParams();
  const [profile, setProfile] = useState(null);
  const [accentColor, setAccentColor] = useState('#FF6B2B');
  const [copied, setCopied] = useState(false);
  const [isSharedView, setIsSharedView] = useState(false);

  useEffect(() => {
    const encoded = searchParams.get('d');
    if (encoded) {
      // 共有URLからデータを読み込む
      const data = decodeData(encoded);
      if (data) {
        setProfile(data);
        setAccentColor(data.accentColor || '#FF6B2B');
        setIsSharedView(true);
      }
    } else {
      // LocalStorageから読み込む（自分のプレビュー）
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const data = JSON.parse(saved);
          setProfile(data);
          setAccentColor(data.accentColor || '#FF6B2B');
        } catch {
          setProfile(null);
        }
      }
    }
  }, [searchParams]);

  // カラー変更時にCSS変数とプロフィールデータを更新
  const handleColorChange = (color) => {
    setAccentColor(color);
    if (!isSharedView) {
      const updated = { ...profile, accentColor: color };
      setProfile(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  };

  // 共有URLをコピー
  const handleCopyUrl = () => {
    if (!profile) return;
    const profileWithColor = { ...profile, accentColor };
    const url = generateProfileShareUrl(profileWithColor);
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // SNSスタイルラベル
  const snsLabel =
    SNS_STYLE_OPTIONS.find((o) => o.value === profile?.values?.snsStyle)?.label ?? '';

  if (!profile) {
    return (
      <div className="container" style={{ padding: 'var(--space-3xl) var(--space-lg)', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-lg)' }}>
          プロフィールが見つかりません
        </p>
        <Link to="/profile/edit" className="btn btn-primary">
          プロフィールを作成する
        </Link>
      </div>
    );
  }

  return (
    <div style={{ '--accent': accentColor }}>
      {/* カラーピッカー（編集者のみ表示） */}
      {!isSharedView && (
        <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--gray-50)' }}>
          <div className="container" style={{ padding: 'var(--space-md) var(--space-lg)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-md">
                <ColorPicker
                  value={accentColor}
                  onChange={handleColorChange}
                  applyGlobally={false}
                />
              </div>
              <div className="flex gap-sm">
                <Link to="/profile/edit" className="btn btn-outline btn-sm">
                  ← 編集に戻る
                </Link>
                <button className="btn btn-primary btn-sm" onClick={handleCopyUrl}>
                  {copied ? '✓ コピーしました' : '共有URLをコピー'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* プロフィール本体 */}
      <div className="container" style={{ padding: 'var(--space-xl) var(--space-lg)' }}>
        {/* ヘッダー */}
        <div className="profile-header">
          <p className="section-label" style={{ color: accentColor, marginBottom: 'var(--space-sm)' }}>
            OTAKU PROFILE
          </p>
          <h1 className="profile-display-name">{profile.displayName || '（名前未設定）'}</h1>
          {profile.handle && (
            <p className="profile-handle">{profile.handle}</p>
          )}
          {profile.bio && (
            <p className="profile-bio">{profile.bio}</p>
          )}
          {profile.snsUrl && (
            <a
              href={profile.snsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: accentColor, fontSize: '0.875rem', marginTop: 'var(--space-md)', display: 'inline-block' }}
            >
              {profile.snsUrl} ↗
            </a>
          )}
        </div>

        {/* ジャンルと作品 */}
        <div className="grid-2" style={{ margin: 'var(--space-xl) 0' }}>
          <div>
            <p className="section-label">好きなジャンル</p>
            {profile.genres?.length > 0 ? (
              <div className="tag-list">
                {profile.genres.map((g) => (
                  <span key={g} className="tag" style={{ borderColor: accentColor, color: accentColor }}>
                    {g}
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>未登録</p>
            )}
          </div>
          <div>
            <p className="section-label">好きな作品</p>
            {profile.works?.length > 0 ? (
              <div className="tag-list">
                {profile.works.map((w) => (
                  <span key={w} className="tag">{w}</span>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>未登録</p>
            )}
          </div>
        </div>

        {/* 推しと推し遍歴 */}
        <div className="grid-2" style={{ marginBottom: 'var(--space-xl)' }}>
          <div>
            <p className="section-label">推し</p>
            {profile.oshis?.length > 0 ? (
              <div className="tag-list">
                {profile.oshis.map((o) => (
                  <span key={o} className="tag tag-accent" style={{ background: accentColor, borderColor: accentColor }}>
                    {o}
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>未登録</p>
            )}
          </div>
          <div>
            <p className="section-label">推し遍歴</p>
            {profile.oshiHistory?.length > 0 ? (
              <div className="tag-list">
                {profile.oshiHistory.map((o) => (
                  <span key={o} className="tag">{o}</span>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>未登録</p>
            )}
          </div>
        </div>

        {/* キャラタイプ */}
        {profile.favoriteCharTypes?.length > 0 && (
          <div style={{ marginBottom: 'var(--space-xl)', paddingBottom: 'var(--space-xl)', borderBottom: '1px solid var(--border)' }}>
            <p className="section-label">好きなキャラクタータイプ</p>
            <div className="tag-list">
              {profile.favoriteCharTypes.map((t) => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          </div>
        )}

        {/* オタク価値観 */}
        {profile.values && (
          <div style={{ marginBottom: 'var(--space-xl)' }}>
            <p className="section-label" style={{ marginBottom: 'var(--space-lg)' }}>
              オタク価値観
            </p>
            <div className="values-axis">
              {VALUES_QUESTIONS.map((q) => {
                const val = profile.values[q.key] ?? 3;
                const pct = ((val - 1) / 4) * 100;
                return (
                  <div key={q.key} className="values-axis-row">
                    <span className="values-axis-label" style={{ fontSize: '0.8125rem' }}>
                      {q.description}
                    </span>
                    <div className="values-axis-bar">
                      <div
                        className="values-axis-fill"
                        style={{ left: 0, width: `${pct}%`, background: accentColor }}
                      />
                    </div>
                    <span className="values-axis-score" style={{ color: accentColor }}>
                      {valLabel(q, val)}
                    </span>
                  </div>
                );
              })}
            </div>
            {snsLabel && (
              <div
                style={{
                  marginTop: 'var(--space-lg)',
                  padding: 'var(--space-md)',
                  borderLeft: `3px solid ${accentColor}`,
                  paddingLeft: 'var(--space-md)',
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                }}
              >
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>SNSスタイル：</span>
                {snsLabel}
              </div>
            )}
          </div>
        )}

        {/* 相性チェックへの導線（共有ビュー時のみ） */}
        {isSharedView && (
          <div
            style={{
              marginTop: 'var(--space-xl)',
              padding: 'var(--space-xl)',
              border: `1px solid ${accentColor}`,
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: accentColor,
                marginBottom: 'var(--space-md)',
              }}
            >
              MATCHING
            </p>
            <h3 style={{ marginBottom: 'var(--space-md)' }}>
              {profile.displayName || 'この人'}とのオタク相性をチェックする
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-lg)' }}>
              自分のプロフィールを登録していれば、価値観・ジャンル・推しなど5軸での相性を確認できます。
            </p>
            <Link
              to={`/match?target=${searchParams.get('d')}`}
              className="btn btn-primary btn-lg"
              style={{ background: accentColor, borderColor: accentColor }}
            >
              相性をチェック →
            </Link>
          </div>
        )}

        {/* 共有URLセクション（自分のプレビュー時のみ） */}
        {!isSharedView && (
          <div className="share-box">
            <p className="section-label" style={{ marginBottom: 'var(--space-md)' }}>
              共有URL
            </p>
            <div className="share-url-row">
              <input
                type="text"
                readOnly
                className="share-url-input"
                value={profile ? generateProfileShareUrl({ ...profile, accentColor }) : ''}
                onClick={(e) => e.target.select()}
              />
              <button className="share-url-btn" onClick={handleCopyUrl}>
                {copied ? '✓ コピー済み' : 'コピー'}
              </button>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 'var(--space-sm)' }}>
              このURLをX（Twitter）やDiscordなどに貼り付けて共有できます
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
