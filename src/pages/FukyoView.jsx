// 布教ページ閲覧ビュー
// 作成された布教ページを表示する（共有URL対応）
import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import SpoilerBlock from '../components/SpoilerBlock';
import ColorPicker from '../components/ColorPicker';
import { decodeData, generateFukyoShareUrl, encodeData } from '../utils/shareUtils';

const STORAGE_KEY = 'otakatsu_fukyo_draft';
const PROFILE_KEY = 'otakatsu_profile';

export default function FukyoView() {
  const [searchParams] = useSearchParams();
  const [fukyo, setFukyo] = useState(null);
  const [accentColor, setAccentColor] = useState('#FF6B2B');
  const [copied, setCopied] = useState(false);
  const [isSharedView, setIsSharedView] = useState(false);
  const [authorProfile, setAuthorProfile] = useState(null);

  useEffect(() => {
    const encoded = searchParams.get('d');
    if (encoded) {
      const data = decodeData(encoded);
      if (data) {
        setFukyo(data);
        setAccentColor(data.accentColor || '#FF6B2B');
        setIsSharedView(true);
        // authorProfileが布教データに含まれていれば取得
        if (data.authorProfile) setAuthorProfile(data.authorProfile);
      }
    } else {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const data = JSON.parse(saved);
          setFukyo(data);
          setAccentColor(data.accentColor || '#FF6B2B');
        } catch { /* noop */ }
      }
      // 自分のプロフィールを取得（布教データに添付するため）
      const profileSaved = localStorage.getItem(PROFILE_KEY);
      if (profileSaved) {
        try { setAuthorProfile(JSON.parse(profileSaved)); } catch { /* noop */ }
      }
    }
  }, [searchParams]);

  const handleColorChange = (color) => {
    setAccentColor(color);
    if (!isSharedView && fukyo) {
      const updated = { ...fukyo, accentColor: color };
      setFukyo(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  };

  const handleCopyUrl = () => {
    if (!fukyo) return;
    // 布教ページURLには作成者のプロフィールも含める（相性チェックのため）
    const payload = {
      ...fukyo,
      accentColor,
      ...(authorProfile ? { authorProfile } : {}),
    };
    const url = generateFukyoShareUrl(payload);
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // 共有ビュー時の相性チェックリンク生成
  const matchUrl = () => {
    if (!authorProfile) return '/match';
    const encoded = encodeData(authorProfile);
    return `/match?target=${encoded}`;
  };

  if (!fukyo) {
    return (
      <div className="container" style={{ padding: 'var(--space-3xl) var(--space-lg)', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-lg)' }}>
          布教ページが見つかりません
        </p>
        <Link to="/fukyo/edit" className="btn btn-primary">布教ページを作成する</Link>
      </div>
    );
  }

  return (
    <div style={{ '--accent': accentColor }}>
      {/* カラーピッカー（編集者のみ） */}
      {!isSharedView && (
        <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--gray-50)' }}>
          <div className="container" style={{ padding: 'var(--space-md) var(--space-lg)' }}>
            <div className="flex items-center justify-between">
              <ColorPicker value={accentColor} onChange={handleColorChange} applyGlobally={false} />
              <div className="flex gap-sm">
                <Link to="/fukyo/edit" className="btn btn-outline btn-sm">← 編集に戻る</Link>
                <button className="btn btn-primary btn-sm" onClick={handleCopyUrl}>
                  {copied ? '✓ コピーしました' : '共有URLをコピー'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 布教ページ本体 */}
      <div className="container" style={{ padding: 'var(--space-xl) var(--space-lg)' }}>
        {/* ヒーロー */}
        <div className="fukyo-hero">
          {fukyo.genre && (
            <span className="fukyo-genre-tag" style={{ color: accentColor, borderColor: accentColor }}>
              {fukyo.genre}
            </span>
          )}
          <h1 className="fukyo-work-title">{fukyo.title || '（タイトル未設定）'}</h1>
          {fukyo.tagline && (
            <p
              style={{
                fontSize: '1.125rem',
                color: 'var(--text-secondary)',
                fontWeight: 500,
                marginTop: 'var(--space-sm)',
              }}
            >
              {fukyo.tagline}
            </p>
          )}
          {fukyo.creatorName && (
            <div className="fukyo-creator-line">
              <span>{fukyo.creatorName}</span>
            </div>
          )}
        </div>

        {/* 魅力・本文 */}
        {fukyo.appeal && (
          <div className="section">
            <p className="section-label">APPEAL</p>
            <div
              style={{
                fontSize: '1rem',
                lineHeight: 1.9,
                color: 'var(--text-primary)',
                whiteSpace: 'pre-wrap',
                maxWidth: '680px',
              }}
            >
              {fukyo.appeal}
            </div>
          </div>
        )}

        {/* 初心者へ・見る順番 */}
        {(fukyo.beginnerNote || fukyo.recommendOrder) && (
          <div className="section">
            <div className="grid-2">
              {fukyo.beginnerNote && (
                <div>
                  <p className="section-label" style={{ color: accentColor }}>まだ知らない人へ</p>
                  <p style={{ fontSize: '0.9375rem', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                    {fukyo.beginnerNote}
                  </p>
                </div>
              )}
              {fukyo.recommendOrder && (
                <div>
                  <p className="section-label" style={{ color: accentColor }}>おすすめの始め方</p>
                  <p style={{ fontSize: '0.9375rem', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
                    {fukyo.recommendOrder}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* おすすめ曲・エピソード */}
        {fukyo.highlights?.length > 0 && (
          <div className="section">
            <p className="section-label">HIGHLIGHTS</p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
              特におすすめの曲・エピソード・シーン
            </p>
            <div className="tag-list">
              {fukyo.highlights.map((h) => (
                <span key={h} className="tag" style={{ borderColor: accentColor, color: accentColor }}>
                  {h}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ネタバレブロック */}
        {fukyo.spoilerContent && (
          <div className="section">
            <p className="section-label">SPOILER</p>
            <SpoilerBlock label={fukyo.spoilerLabel || 'ここからネタバレあり'}>
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.9 }}>{fukyo.spoilerContent}</p>
            </SpoilerBlock>
          </div>
        )}

        {/* 作成者との相性チェック（共有ビュー時） */}
        {isSharedView && (
          <div
            style={{
              marginTop: 'var(--space-xl)',
              padding: 'var(--space-xl)',
              border: `1px solid ${accentColor}`,
            }}
          >
            <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: 'var(--space-md)' }}>
              <div>
                <p
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: accentColor,
                    marginBottom: 'var(--space-sm)',
                  }}
                >
                  CREATOR MATCHING
                </p>
                <h3 style={{ marginBottom: 'var(--space-sm)' }}>
                  この布教ページの作成者とのオタク相性をチェック
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {authorProfile
                    ? `${authorProfile.displayName || '作成者'} との価値観・ジャンル・推しの一致度を確認できます`
                    : '作成者のプロフィールと自分のプロフィールで相性を比較できます'}
                </p>
              </div>
              <Link
                to={matchUrl()}
                className="btn btn-primary btn-lg"
                style={{ background: accentColor, borderColor: accentColor, flexShrink: 0 }}
              >
                相性をチェック →
              </Link>
            </div>
          </div>
        )}

        {/* 共有URLセクション（自分のプレビュー時のみ） */}
        {!isSharedView && (
          <div className="share-box">
            <p className="section-label" style={{ marginBottom: 'var(--space-md)' }}>共有URL</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 'var(--space-sm)' }}>
              ※ 自分のプロフィールも登録しておくと、閲覧者がその場で相性チェックできます
            </p>
            <div className="share-url-row">
              <input
                type="text"
                readOnly
                className="share-url-input"
                value={fukyo ? generateFukyoShareUrl({ ...fukyo, accentColor, ...(authorProfile ? { authorProfile } : {}) }) : ''}
                onClick={(e) => e.target.select()}
              />
              <button className="share-url-btn" onClick={handleCopyUrl}>
                {copied ? '✓ コピー済み' : 'コピー'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
