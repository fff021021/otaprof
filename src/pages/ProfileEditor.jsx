// プロフィール編集ページ
// ジャンル・作品・推し・価値観Q&Aを入力してプロフィールを作成する
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TagInput from '../components/TagInput';
import { generateProfileShareUrl } from '../utils/shareUtils';
import { VALUES_QUESTIONS, SNS_STYLE_OPTIONS, GENRES, CHAR_TYPES } from './Home';

// LocalStorageのキー
const STORAGE_KEY = 'otakatsu_profile';

// デフォルト状態
const defaultProfile = {
  displayName: '',
  handle: '',
  bio: '',
  snsUrl: '',
  genres: [],
  works: [],
  oshis: [],
  oshiHistory: [],
  favoriteCharTypes: [],
  values: {
    tanchoLevel: 3,
    naimenLevel: 3,
    kosatsuLevel: 3,
    nijisouLevel: 3,
    netabareLevel: 3,
    doudanLevel: 3,
    snsStyle: 'both',
  },
  accentColor: '#FF6B2B',
};

export default function ProfileEditor() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return { ...defaultProfile, ...JSON.parse(saved) };
      } catch {
        return defaultProfile;
      }
    }
    return defaultProfile;
  });
  const [saved, setSaved] = useState(false);

  // 入力変更ハンドラ（フラット）
  const set = (key, value) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  // 価値観の変更ハンドラ（ネスト）
  const setVal = (key, value) => {
    setProfile((prev) => ({
      ...prev,
      values: { ...prev.values, [key]: value },
    }));
    setSaved(false);
  };

  // LocalStorageへ保存
  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    setSaved(true);
  };

  // プレビュー（プロフィール閲覧ページへ遷移）
  const handlePreview = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    navigate('/profile/view');
  };

  // ジャンルトグル
  const toggleGenre = (genre) => {
    const current = profile.genres;
    if (current.includes(genre)) {
      set('genres', current.filter((g) => g !== genre));
    } else if (current.length < 10) {
      set('genres', [...current, genre]);
    }
  };

  // キャラタイプトグル
  const toggleCharType = (type) => {
    const current = profile.favoriteCharTypes;
    if (current.includes(type)) {
      set('favoriteCharTypes', current.filter((t) => t !== type));
    } else if (current.length < 8) {
      set('favoriteCharTypes', [...current, type]);
    }
  };

  return (
    <div>
      {/* ページヘッダー */}
      <div style={{ borderBottom: '1px solid var(--border-strong)', padding: 'var(--space-xl) 0' }}>
        <div className="container">
          <div className="flex justify-between items-center">
            <div>
              <p className="section-label">PROFILE EDITOR</p>
              <h1 style={{ fontSize: '1.75rem', marginBottom: 0 }}>プロフィール作成</h1>
            </div>
            <div className="flex gap-sm">
              <button className="btn btn-outline" onClick={handleSave}>
                {saved ? '✓ 保存済み' : '保存する'}
              </button>
              <button className="btn btn-primary" onClick={handlePreview}>
                プレビュー →
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '0 var(--space-lg) var(--space-3xl)' }}>
        
        {/* セクション1: 基本情報 */}
        <div className="form-section">
          <div className="form-section-title">01 — 基本情報</div>
          <div className="form-section-content">
            <div className="grid-2" style={{ border: 'none', gap: 'var(--space-xl)', background: 'transparent' }}>
              <div>
                <div className="form-row">
                  <label>表示名</label>
                  <input
                    type="text"
                    placeholder="例: ふわり"
                    value={profile.displayName}
                    onChange={(e) => set('displayName', e.target.value)}
                    maxLength={30}
                  />
                </div>
                <div className="form-row">
                  <label>ハンドルネーム / SNS ID</label>
                  <input
                    type="text"
                    placeholder="例: fuwari/@ragyorakyo"
                    value={profile.handle}
                    onChange={(e) => set('handle', e.target.value)}
                    maxLength={40}
                  />
                </div>
                <div className="form-row" style={{ marginBottom: 0 }}>
                  <label>SNSリンク（任意）</label>
                  <input
                    type="url"
                    placeholder="https://x.com/..."
                    value={profile.snsUrl}
                    onChange={(e) => set('snsUrl', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <div className="form-row" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <label>自己紹介（プロフィール文）</label>
                  <textarea
                    placeholder="好きなものや自分のオタク遍歴を自由に書いてください"
                    value={profile.bio}
                    onChange={(e) => set('bio', e.target.value)}
                    maxLength={400}
                    style={{ flex: 1, minHeight: '140px' }}
                  />
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px', textAlign: 'right', fontWeight: 700 }}>
                    {profile.bio.length}/400
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* セクション2: 好きなジャンル */}
        <div className="form-section">
          <div className="form-section-title">02 — 好きなジャンル（最大10個）</div>
          <div className="form-section-content">
            <div className="tag-list" style={{ marginBottom: 'var(--space-lg)' }}>
              {GENRES.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  className={`tag ${profile.genres.includes(genre) ? 'tag-accent' : ''}`}
                  onClick={() => toggleGenre(genre)}
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  {genre}
                </button>
              ))}
            </div>
            <div style={{ maxWidth: '600px' }}>
              <label style={{ marginBottom: 'var(--space-sm)' }}>
                上記以外のジャンルを追加
              </label>
              <TagInput
                values={profile.genres.filter((g) => !GENRES.includes(g))}
                onChange={(newCustom) => {
                  const preset = profile.genres.filter((g) => GENRES.includes(g));
                  set('genres', [...preset, ...newCustom]);
                }}
                placeholder="ジャンルを入力してEnter"
                max={10 - profile.genres.filter((g) => GENRES.includes(g)).length}
              />
            </div>
          </div>
        </div>

        {/* セクション3: 好きな作品 */}
        <div className="form-section">
          <div className="form-section-title">03 — 好きな作品（最大20件）</div>
          <div className="form-section-content">
            <TagInput
              values={profile.works}
              onChange={(v) => set('works', v)}
              placeholder="作品名を入力してEnter"
              max={20}
            />
          </div>
        </div>

        {/* セクション4: 推し */}
        <div className="form-section">
          <div className="form-section-title">04 — 推し（キャラ・人物等 最大10件）</div>
          <div className="form-section-content">
            <TagInput
              values={profile.oshis}
              onChange={(v) => set('oshis', v)}
              placeholder="推しの名前を入力してEnter"
              max={10}
            />
          </div>
        </div>

        {/* セクション5: 推し遍歴 */}
        <div className="form-section">
          <div className="form-section-title">05 — 推し遍歴（過去に推していた人 最大10件）</div>
          <div className="form-section-content">
            <TagInput
              values={profile.oshiHistory}
              onChange={(v) => set('oshiHistory', v)}
              placeholder="過去の推しを入力してEnter"
              max={10}
            />
          </div>
        </div>
{/* セクション6: 好きなキャラのタイプ */}
<div className="form-section">
  <div className="form-section-title">
    06 — 好きになるキャラのタイプ（最大8個）
  </div>
  <div className="form-section-content">
    <div
      className="tag-list"
      style={{ marginBottom: 'var(--space-lg)' }}
    >
      {CHAR_TYPES.map((type) => (
        <button
          key={type}
          type="button"
          className={`tag ${
            profile.favoriteCharTypes.includes(type) ? 'tag-accent' : ''
          }`}
          onClick={() => toggleCharType(type)}
          style={{ cursor: 'pointer', userSelect: 'none' }}
        >
          {type}
        </button>
      ))}
    </div>

    <div style={{ maxWidth: '600px' }}>
      <label style={{ marginBottom: 'var(--space-sm)' }}>
        上記以外のキャラタイプを追加
      </label>

      <TagInput
        values={profile.favoriteCharTypes.filter(
          (type) => !CHAR_TYPES.includes(type)
        )}
        onChange={(newCustom) => {
          const preset = profile.favoriteCharTypes.filter(
            (type) => CHAR_TYPES.includes(type)
          );

          set('favoriteCharTypes', [...preset, ...newCustom]);
        }}
        placeholder="キャラタイプを入力してEnter"
        max={
          8 -
          profile.favoriteCharTypes.filter(
            (type) => CHAR_TYPES.includes(type)
          ).length
        }
      />
    </div>
  </div>
</div>

        {/* セクション7: オタク価値観 */}
        <div className="form-section">
          <div className="form-section-title">07 — オタク価値観</div>
          <div className="form-section-content">
            <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
              自分のオタクとしての傾向に近い位置にスライダーを動かしてください。どちらとも言えない場合は中央に置いてください。
            </p>
            <div style={{ maxWidth: '640px' }}>
              {VALUES_QUESTIONS.map((q) => (
                <div key={q.key} className="slider-row" style={{ marginBottom: 'var(--space-xl)' }}>
                  <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <span>{q.description}</span>
                    <span style={{ color: 'var(--accent)', fontSize: '1.25rem', fontFamily: 'var(--font-mono)' }}>
                      {profile.values[q.key]}<span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>/5</span>
                    </span>
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    step={1}
                    value={profile.values[q.key]}
                    onChange={(e) => setVal(q.key, Number(e.target.value))}
                  />
                  <div className="slider-labels">
                    <span>{q.leftLabel}</span>
                    <span>{q.rightLabel}</span>
                  </div>
                </div>
              ))}

              {/* SNSスタイル */}
              <div className="form-row" style={{ marginTop: 'var(--space-2xl)', marginBottom: 0 }}>
                <label>SNSでの活動スタイル</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                  {SNS_STYLE_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-sm)',
                        fontWeight: 700,
                        fontSize: '1rem',
                        color: 'var(--black)',
                        cursor: 'pointer',
                        textTransform: 'none',
                        margin: 0
                      }}
                    >
                      <input
                        type="radio"
                        name="snsStyle"
                        value={opt.value}
                        checked={profile.values.snsStyle === opt.value}
                        onChange={() => setVal('snsStyle', opt.value)}
                        style={{ width: '20px', height: '20px', accentColor: 'var(--accent)' }}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 保存ボタン */}
        <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-xl)' }}>
          <button className="btn btn-primary btn-lg" onClick={handleSave} style={{ flex: 1 }}>
            {saved ? '✓ 保存済み' : '保存する'}
          </button>
          <button className="btn btn-outline btn-lg" onClick={handlePreview} style={{ flex: 1 }}>
            プレビュー / 共有URL生成 →
          </button>
        </div>
      </div>
    </div>
  );
}
