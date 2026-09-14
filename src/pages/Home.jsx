// ホームページ（サービスの入口）
import { Link } from 'react-router-dom';

// 価値観スライダーのラベル定義
export const VALUES_QUESTIONS = [
  { key: 'tanchoLevel', leftLabel: '完全単推し', rightLabel: '完全箱推し', description: '推しへの集中度' },
  { key: 'naimenLevel', leftLabel: 'ビジュアル重視', rightLabel: '内面・性格重視', description: 'キャラへの惹かれ方' },
  { key: 'kosatsuLevel', leftLabel: '雰囲気で楽しむ', rightLabel: '深く考察する', description: 'ストーリーの楽しみ方' },
  { key: 'nijisouLevel', leftLabel: '公式のみ', rightLabel: '二次創作をよく見る', description: '二次創作への関心' },
  { key: 'netabareLevel', leftLabel: 'ネタバレ絶対NG', rightLabel: 'ネタバレOK', description: 'ネタバレへの耐性' },
  { key: 'doudanLevel', leftLabel: '同担不干渉', rightLabel: '同担と積極交流', description: '同担との交流スタンス' },
];

export const SNS_STYLE_OPTIONS = [
  { value: 'post', label: '積極的に感想・布教を発信する' },
  { value: 'both', label: '発信もするし、よく見ることもある' },
  { value: 'read', label: '基本的に見る・読む側' },
  { value: 'lurk', label: 'SNSはほぼ使わない' },
  { value: 'other', label: 'その他' },
];

export const GENRES = [
  'RPG', 'アクション', 'シミュレーション', '音楽ゲーム', '格闘ゲーム',
  '恋愛ゲーム', 'ノベルゲーム', '少年漫画', '少女漫画', '青年漫画',
  '百合', 'BL', 'ファンタジーアニメ', 'SF', '日常系', 'スポーツ',
  'アイドル', 'ラブライブ', '声優', 'K-POP', 'J-POP',
  'VTuber（にじさんじ）', 'VTuber（ホロライブ）', 'VTuber（個人）',
  '宝塚', '2.5次元', '特撮', '映画', 'ラノベ', 'その他',
];

export const CHAR_TYPES = [
  '主人公系', 'クールキャラ', '天然ボケ', 'ツンデレ', 'ギャップ萌え',
  '努力家', '天才肌', '兄貴分', '妹系', 'お姉さん系',
  '闇深キャラ', '最強系', '変人', '縁の下の力持ち', 'その他',
];

export default function Home() {
  return (
    <div>
      <div className="container">
        {/* ブルータリズムの大きなグリッドブロック */}
        <div className="brutalist-grid-wrapper grid-aside" style={{ marginTop: 'var(--space-2xl)' }}>
          
          {/* 左側：巨大なアクションボタンエリア */}
          <div style={{ display: 'flex', flexDirection: 'column', padding: 'var(--space-2xl) var(--space-xl)', gap: 'var(--space-md)', justifyContent: 'center' }}>
            <Link to="/profile/edit" className="btn btn-primary" style={{ height: 'auto', padding: 'var(--space-lg) var(--space-md)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 900, lineHeight: 1 }}>PROFILE</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>プロフィール作成</span>
              </div>
            </Link>
            <Link to="/fukyo/edit" className="btn btn-primary" style={{ height: 'auto', padding: 'var(--space-lg) var(--space-md)', background: 'var(--black)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 900, lineHeight: 1 }}>FUKYO</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>布教ページ作成</span>
              </div>
            </Link>
            <Link to="/match" className="btn btn-outline" style={{ height: 'auto', padding: 'var(--space-md)', marginTop: 'var(--space-lg)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                <span style={{ fontSize: '1.125rem', fontWeight: 900, lineHeight: 1 }}>MATCHING</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>相性チェック</span>
              </div>
            </Link>
          </div>

          {/* 右側：機能リスト */}
          <div style={{ padding: 'var(--space-2xl) var(--space-xl)', position: 'relative', overflow: 'hidden' }}>
            <div className="giant-watermark" style={{ position: 'absolute', right: '-10%', bottom: '-5%', color: 'var(--gray-100)', zIndex: 0, fontSize: 'clamp(4rem, 25vw, 12rem)' }}>
              OTK
            </div>
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div className="section-label">
                <span style={{ fontSize: '1.5rem', fontWeight: 900 }}>FEATURES</span>
              </div>
              
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column' }}>
                {[
                  { num: '01', text: 'ジャンル・作品・推し・オタク価値観を登録してプロフィールを作成' },
                  { num: '02', text: 'プロフィールをSNSに貼れる「オタク名刺」として共有' },
                  { num: '03', text: '好きな作品や推しの布教ページを生成してSNSでシェア' },
                  { num: '04', text: '布教ページから作成者との相性をその場でチェック' },
                  { num: '05', text: '価値観・ジャンル・作品・推しなど複数の観点で相性を分析' },
                ].map((item) => (
                  <li
                    key={item.num}
                    style={{
                      display: 'flex',
                      gap: 'var(--space-md)',
                      alignItems: 'flex-start',
                      padding: 'var(--space-md) 0',
                      borderBottom: '2px solid var(--black)',
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(1.5rem, 5vw, 2rem)', fontWeight: 900, color: 'var(--accent)', flexShrink: 0, lineHeight: 1, paddingTop: '4px' }}>
                      {item.num}
                    </span>
                    <p style={{ fontSize: 'clamp(0.875rem, 3vw, 1.125rem)', fontWeight: 700, lineHeight: 1.6 }}>
                      {item.text}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>

        {/* 詳細ブロック3連 */}
        <div className="brutalist-grid-wrapper grid-3" style={{ marginBottom: 'var(--space-3xl)' }}>
          <div style={{ padding: 'var(--space-xl)' }}>
            <div className="section-label-number">1</div>
            <h3 style={{ marginBottom: 'var(--space-md)' }}>オタク名刺</h3>
            <p style={{ fontWeight: 500 }}>
              推し方・SNSスタイル・作品の楽しみ方など「価値観」まで含めたプロフィールを一枚にまとめる。SNSで自己紹介として使える。
            </p>
          </div>
          <div style={{ padding: 'var(--space-xl)' }}>
            <div className="section-label-number">2</div>
            <h3 style={{ marginBottom: 'var(--space-md)' }}>布教ページ</h3>
            <p style={{ fontWeight: 500 }}>
              好きな作品や推しを紹介する専用ページを作成。ネタバレ管理、おすすめエピソード等も設定。
            </p>
          </div>
          <div style={{ padding: 'var(--space-xl)' }}>
            <div className="section-label-number">3</div>
            <h3 style={{ marginBottom: 'var(--space-md)' }}>相性チェック</h3>
            <p style={{ fontWeight: 500 }}>
              共有されたプロフィールリンクと自分の情報を照合。「推しは違うけれど価値観が近い」出会いを可視化。
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
