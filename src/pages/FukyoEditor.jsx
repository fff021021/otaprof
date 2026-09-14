// 布教ページ編集画面
// 作品・推しを紹介するページを作成する
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TagInput from '../components/TagInput';
import { generateFukyoShareUrl } from '../utils/shareUtils';
import { GENRES } from './Home';

const STORAGE_KEY = 'otakatsu_fukyo_draft';

const defaultFukyo = {
  title: '',          // 作品名・推し名
  genre: '',          // ジャンル
  creatorName: '',    // 作者・グループ名
  tagline: '',        // キャッチコピー（一言）
  appeal: '',         // 魅力・好きなところ（本文）
  beginnerNote: '',   // 初めて見る人へのひとこと
  recommendOrder: '', // おすすめの見る順番
  highlights: [],     // おすすめ曲・エピソード（タグ）
  spoilerLabel: 'ここからネタバレあり', // ネタバレの開始ラベル
  spoilerContent: '', // ネタバレコンテンツ
  snsLinks: [],       // 関連SNSリンク
  accentColor: '#FF6B2B',
};

export default function FukyoEditor() {
  const navigate = useNavigate();
  const [fukyo, setFukyo] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return { ...defaultFukyo, ...JSON.parse(saved) }; } catch { return defaultFukyo; }
    }
    return defaultFukyo;
  });
  const [saved, setSaved] = useState(false);

  const set = (key, value) => {
    setFukyo((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fukyo));
    setSaved(true);
  };

  const handlePreview = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fukyo));
    navigate('/fukyo/view');
  };

  return (
    <div>
      {/* ページヘッダー */}
      <div style={{ borderBottom: '1px solid var(--border-strong)', padding: 'var(--space-xl) 0' }}>
        <div className="container">
          <div className="flex justify-between items-center">
            <div>
              <p className="section-label">FUKYO EDITOR</p>
              <h1 style={{ fontSize: '1.75rem', marginBottom: 0 }}>布教ページ作成</h1>
            </div>
            <div className="flex gap-sm">
              <button className="btn btn-outline" onClick={handleSave}>
                {saved ? '✓ 保存済み' : '下書きを保存'}
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
          <div className="form-section-title">01 — 作品・推しの基本情報</div>
          <div className="form-section-content">
            <div className="grid-2" style={{ border: 'none', gap: 'var(--space-xl)', background: 'transparent' }}>
              <div>
                <div className="form-row">
                  <label>作品名 / 推し名 *</label>
                  <input
                    type="text"
                    placeholder="例: 少女☆歌劇 レヴュースタァライト/露崎まひる"
                    value={fukyo.title}
                    onChange={(e) => set('title', e.target.value)}
                    maxLength={60}
                  />
                </div>
                <div className="form-row" style={{ marginBottom: 0 }}>
                  <label>ジャンル</label>
                  <select value={fukyo.genre} onChange={(e) => set('genre', e.target.value)}>
                    <option value="">選択してください</option>
                    {GENRES.map((g) => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <div className="form-row">
                  <label>作者 / グループ / 所属</label>
                  <input
                    type="text"
                    placeholder="例: スタァライト九九組"
                    value={fukyo.creatorName}
                    onChange={(e) => set('creatorName', e.target.value)}
                    maxLength={60}
                  />
                </div>
                <div className="form-row" style={{ marginBottom: 0 }}>
                  <label>一言キャッチコピー</label>
                  <input
                    type="text"
                    placeholder="例: 九人の舞台少女が描く、運命の舞台。"
                    value={fukyo.tagline}
                    onChange={(e) => set('tagline', e.target.value)}
                    maxLength={80}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* セクション2: 魅力 */}
        <div className="form-section">
          <div className="form-section-title">02 — 魅力・好きなところ（メイン本文）</div>
          <div className="form-section-content">
            <div className="form-row" style={{ marginBottom: 0 }}>
              <label>この作品・推しの魅力を語ってください</label>
              <textarea
                placeholder="好きなところ、推せるポイント、何度も見返した理由など、自由に書いてください"
                value={fukyo.appeal}
                onChange={(e) => set('appeal', e.target.value)}
                maxLength={2000}
                style={{ minHeight: '200px' }}
              />
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '4px', textAlign: 'right', fontWeight: 700 }}>
                {fukyo.appeal.length}/2000
              </p>
            </div>
          </div>
        </div>

        {/* セクション3: 初心者向け */}
        <div className="form-section">
          <div className="form-section-title">03 — 初めての人へ</div>
          <div className="form-section-content">
            <div className="grid-2" style={{ border: 'none', gap: 'var(--space-xl)', background: 'transparent' }}>
              <div>
                <div className="form-row" style={{ marginBottom: 0 }}>
                  <label>まだ知らない人へひとこと</label>
                  <textarea
                    placeholder="例: 第5話からが本番！"
                    value={fukyo.beginnerNote}
                    onChange={(e) => set('beginnerNote', e.target.value)}
                    maxLength={400}
                    style={{ minHeight: '120px' }}
                  />
                </div>
              </div>
              <div>
                <div className="form-row" style={{ marginBottom: 0 }}>
                  <label>おすすめの見る順番・始め方</label>
                  <textarea
                    placeholder="例: アニメ12話→劇場総集編(必須！)→劇場版"
                    value={fukyo.recommendOrder}
                    onChange={(e) => set('recommendOrder', e.target.value)}
                    maxLength={400}
                    style={{ minHeight: '120px' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* セクション4: おすすめ曲・エピソード */}
        <div className="form-section">
          <div className="form-section-title">04 — おすすめ曲・エピソード・シーン</div>
          <div className="form-section-content">
            <TagInput
              values={fukyo.highlights}
              onChange={(v) => set('highlights', v)}
              placeholder="例: 恋の魔球(7回裏)・第5話～第7話"
              max={15}
            />
          </div>
        </div>

        {/* セクション5: ネタバレコンテンツ */}
        <div className="form-section">
          <div className="form-section-title">05 — ネタバレあり内容（任意）</div>
          <div className="form-section-content">
            <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)' }}>
              ここに書いた内容は布教ページ上でクリックするまで隠されます。
            </p>
            <div className="form-row">
              <label>ネタバレ開始ラベル（ボタンのテキスト）</label>
              <input
                type="text"
                value={fukyo.spoilerLabel}
                onChange={(e) => set('spoilerLabel', e.target.value)}
                maxLength={40}
              />
            </div>
            <div className="form-row" style={{ marginBottom: 0 }}>
              <label>ネタバレあり内容（特に好きな場面・展開・結末など）</label>
              <textarea
                placeholder="ネタバレを含む魅力や感想を書いてください。空白の場合はネタバレセクションは表示されません。"
                value={fukyo.spoilerContent}
                onChange={(e) => set('spoilerContent', e.target.value)}
                maxLength={1000}
                style={{ minHeight: '160px' }}
              />
            </div>
          </div>
        </div>

        {/* 保存ボタン */}
        <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-xl)' }}>
          <button className="btn btn-primary btn-lg" onClick={handleSave} style={{ flex: 1 }}>
            {saved ? '✓ 保存済み' : '下書きを保存'}
          </button>
          <button className="btn btn-outline btn-lg" onClick={handlePreview} style={{ flex: 1 }}>
            プレビュー / 共有URL生成 →
          </button>
        </div>
      </div>
    </div>
  );
}
