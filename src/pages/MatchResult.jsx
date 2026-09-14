// 相性チェックページ
// 自分のプロフィールと相手プロフィールを比較してスコアを表示する

import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

import {
  decodeData,
  encodeData,
  loadProfileData,
} from '../utils/shareUtils';

import { calculateCompatibility } from '../utils/matchingEngine';

import ScoreBar from '../components/ScoreBar';

const PROFILE_KEY = 'otakatsu_profile';

const SCORE_LABELS = {
  genre: '好きなジャンルの一致',
  works: '好きな作品の一致',
  oshi: '推しの一致',
  values: 'オタク価値観の一致',
  charType: '好きなキャラタイプの一致',
};

export default function MatchResult() {
  const [searchParams] = useSearchParams();

  const [myProfile, setMyProfile] = useState(null);
  const [targetProfile, setTargetProfile] = useState(null);
  const [result, setResult] = useState(null);
  const [targetUrl, setTargetUrl] = useState('');
  const [error, setError] = useState('');

  // Firebaseから読み込んだ相手プロフィールのID
  const [targetId, setTargetId] = useState('');

  // 自分のプロフィールを読み込む
  useEffect(() => {
    const saved = localStorage.getItem(PROFILE_KEY);

    if (saved) {
      try {
        setMyProfile(JSON.parse(saved));
      } catch {
        // noop
      }
    }
  }, []);

  // URLパラメータから相手プロフィールを読み込む
  useEffect(() => {
    const id = searchParams.get('targetId');
    const encoded = searchParams.get('target');

    const loadTargetProfile = async () => {
      setError('');

      // 新方式：FirebaseのIDから取得
      if (id) {
        setTargetId(id);

        const data = await loadProfileData(id);

        if (data) {
          setTargetProfile(data);
        } else {
          setError('プロフィールが見つかりません');
        }

        return;
      }

      // 旧方式：URLに直接データが入っている場合
      if (encoded) {
        const data = decodeData(encoded);

        if (data) {
          setTargetProfile(data);
          setTargetId('');
        } else {
          setError('URLが無効または破損しています');
        }

        return;
      }

      setTargetId('');
    };

    loadTargetProfile();
  }, [searchParams]);

  // 相性計算
  useEffect(() => {
    if (myProfile && targetProfile) {
      const r = calculateCompatibility(
        myProfile,
        targetProfile
      );

      setResult(r);
    } else {
      setResult(null);
    }
  }, [myProfile, targetProfile]);

  // URLを手動で貼り付けて相手を読み込む
  const handleLoadFromUrl = async () => {
    setError('');

    try {
      const url = new URL(targetUrl);

      const hash = url.hash;

      // #/profile/view?...
      const qMark = hash.indexOf('?');

      if (qMark === -1) {
        setError('プロフィールURLが見つかりません');
        return;
      }

      const params = new URLSearchParams(
        hash.slice(qMark + 1)
      );

      // 新方式：Firebase ID
      const id = params.get('id');

      if (id) {
        const data = await loadProfileData(id);

        if (!data) {
          setError('プロフィールが見つかりません');
          return;
        }

        setTargetId(id);
        setTargetProfile(data);
        return;
      }

      // 旧方式：圧縮データ
      const encoded = params.get('d');

      if (!encoded) {
        setError(
          'URLにプロフィールデータが含まれていません'
        );
        return;
      }

      const data = decodeData(encoded);

      if (!data) {
        setError('データのデコードに失敗しました');
        return;
      }

      setTargetId('');
      setTargetProfile(data);
    } catch {
      setError('URLの形式が正しくありません');
    }
  };

  return (
    <div>
      {/* ページヘッダー */}
      <div
        style={{
          borderBottom:
            '1px solid var(--border-strong)',
          padding: 'var(--space-xl) 0',
        }}
      >
        <div className="container">
          <p className="section-label">
            MATCHING
          </p>

          <h1 style={{ fontSize: '1.75rem' }}>
            オタク相性チェック
          </h1>
        </div>
      </div>

      <div
        className="container"
        style={{
          padding:
            'var(--space-xl) var(--space-lg)',
        }}
      >
        {/* 自分のプロフィールが未登録の場合 */}
        {!myProfile && (
          <div
            style={{
              padding: 'var(--space-xl)',
              border:
                '1px solid var(--border-strong)',
              marginBottom:
                'var(--space-xl)',
              background: 'var(--gray-50)',
            }}
          >
            <p
              className="section-label"
              style={{
                marginBottom:
                  'var(--space-md)',
              }}
            >
              自分のプロフィールが未登録です
            </p>

            <p
              style={{
                fontSize: '0.875rem',
                color:
                  'var(--text-secondary)',
                marginBottom:
                  'var(--space-lg)',
              }}
            >
              相性チェックには自分のプロフィールの登録が必要です。
            </p>

            <Link
              to="/profile/edit"
              className="btn btn-primary"
            >
              プロフィールを作成する →
            </Link>
          </div>
        )}

        {/* 相手URLを手動入力するフォーム */}
        {!targetProfile && (
          <div
            style={{
              marginBottom:
                'var(--space-xl)',
            }}
          >
            <p
              style={{
                fontWeight: 700,
                fontSize: '0.75rem',
                letterSpacing: '0.14em',
                textTransform:
                  'uppercase',
                color: 'var(--text-muted)',
                borderBottom:
                  '1px solid var(--border)',
                paddingBottom:
                  'var(--space-md)',
                marginBottom:
                  'var(--space-lg)',
              }}
            >
              相手のプロフィールURLを入力
            </p>

            <p
              style={{
                fontSize: '0.875rem',
                color:
                  'var(--text-secondary)',
                marginBottom:
                  'var(--space-md)',
              }}
            >
              相手のプロフィールページのURLを貼り付けてください。
              布教ページから「相性をチェック」ボタンを押した場合は自動で読み込まれます。
            </p>

            <div
              style={{
                display: 'flex',
                gap: 0,
                maxWidth: '600px',
              }}
            >
              <input
                type="url"
                placeholder="https://.../#/profile/view?id=..."
                value={targetUrl}
                onChange={(e) =>
                  setTargetUrl(e.target.value)
                }
                style={{
                  flex: 1,
                }}
              />

              <button
                className="btn btn-primary"
                onClick={handleLoadFromUrl}
                style={{
                  flexShrink: 0,
                }}
              >
                チェック
              </button>
            </div>

            {error && (
              <p
                style={{
                  fontSize: '0.875rem',
                  color: '#C0392B',
                  marginTop:
                    'var(--space-sm)',
                }}
              >
                {error}
              </p>
            )}
          </div>
        )}

        {/* 相手プロフィール読み込みエラー */}
        {error && targetProfile === null && searchParams.get('targetId') && (
          <p
            style={{
              fontSize: '0.875rem',
              color: '#C0392B',
              marginBottom:
                'var(--space-lg)',
            }}
          >
            {error}
          </p>
        )}

        {/* 相性結果 */}
        {result &&
          myProfile &&
          targetProfile && (
            <div>
              {/* 相手情報ヘッダー */}
              <div
                style={{
                  padding:
                    'var(--space-lg)',
                  borderBottom:
                    '2px solid var(--border-strong)',
                  marginBottom:
                    'var(--space-xl)',
                  display: 'flex',
                  justifyContent:
                    'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 'var(--space-md)',
                }}
              >
                <div>
                  <p
                    className="section-label"
                    style={{
                      marginBottom:
                        'var(--space-xs)',
                    }}
                  >
                    COMPARING WITH
                  </p>

                  <h2
                    style={{
                      fontSize: '1.25rem',
                    }}
                  >
                    {targetProfile.displayName ||
                      '（名前なし）'}

                    {targetProfile.handle && (
                      <span
                        style={{
                          fontFamily:
                            'var(--font-mono)',
                          fontSize:
                            '0.875rem',
                          color:
                            'var(--text-muted)',
                          fontWeight: 400,
                          marginLeft:
                            'var(--space-sm)',
                        }}
                      >
                        {targetProfile.handle}
                      </span>
                    )}
                  </h2>
                </div>

                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    setTargetProfile(null);
                    setResult(null);
                    setTargetUrl('');
                    setTargetId('');
                    setError('');
                  }}
                >
                  別の人と比べる
                </button>
              </div>

              {/* 総合スコア大表示 */}
              <div
                style={{
                  paddingBottom:
                    'var(--space-xl)',
                  borderBottom:
                    '1px solid var(--border)',
                }}
              >
                <p className="section-label">
                  TOTAL COMPATIBILITY
                </p>

                <div className="match-score-display">
                  <span className="match-score-number">
                    {result.totalScore}
                  </span>

                  <span className="match-score-percent">
                    %
                  </span>
                </div>

                <p
                  style={{
                    fontSize: '0.9375rem',
                    color:
                      'var(--text-secondary)',
                  }}
                >
                  {myProfile.displayName ||
                    'あなた'}{' '}
                  ×{' '}
                  {targetProfile.displayName ||
                    '相手'}
                </p>
              </div>

              {/* 各要素スコア */}
              <div
                style={{
                  padding:
                    'var(--space-xl) 0',
                  borderBottom:
                    '1px solid var(--border)',
                }}
              >
                <p
                  className="section-label"
                  style={{
                    marginBottom:
                      'var(--space-lg)',
                  }}
                >
                  要素別スコア
                </p>

                <div
                  style={{
                    maxWidth: '560px',
                    display: 'flex',
                    flexDirection:
                      'column',
                    gap: 'var(--space-md)',
                  }}
                >
                  {Object.entries(
                    SCORE_LABELS
                  ).map(([key, label]) => (
                    <ScoreBar
                      key={key}
                      label={label}
                      score={
                        result.scores[key] ?? 0
                      }
                    />
                  ))}
                </div>
              </div>

              {/* 相性が高い理由 */}
              {result.reasons.length > 0 && (
                <div
                  style={{
                    padding:
                      'var(--space-xl) 0',
                    borderBottom:
                      '1px solid var(--border)',
                  }}
                >
                  <p
                    className="section-label"
                    style={{
                      marginBottom:
                        'var(--space-lg)',
                    }}
                  >
                    似ているところ
                  </p>

                  <ul className="reason-list">
                    {result.reasons.map(
                      (r, i) => (
                        <li
                          key={i}
                          className="reason-item"
                        >
                          {r}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

              {/* 違う部分 */}
              {result.differences.length >
                0 && (
                <div
                  style={{
                    padding:
                      'var(--space-xl) 0',
                    borderBottom:
                      '1px solid var(--border)',
                  }}
                >
                  <p
                    className="section-label"
                    style={{
                      marginBottom:
                        'var(--space-lg)',
                    }}
                  >
                    違いがあるところ
                  </p>

                  <ul className="reason-list">
                    {result.differences.map(
                      (r, i) => (
                        <li
                          key={i}
                          className="reason-item difference-item"
                        >
                          {r}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}

              {/* 相手プロフィールへのリンク */}
              <div
                style={{
                  paddingTop:
                    'var(--space-xl)',
                }}
              >
                <p
                  style={{
                    fontSize: '0.875rem',
                    color:
                      'var(--text-muted)',
                  }}
                >
                  相手のオタク名刺を詳しく見る：
                  {' '}

                  <Link
                    to={
                      targetId
                        ? `/profile/view?id=${targetId}`
                        : `/profile/view?d=${encodeData(
                            targetProfile
                          )}`
                    }
                    style={{
                      color:
                        'var(--accent)',
                    }}
                  >
                    {targetProfile.displayName ||
                      'プロフィールを見る'}{' '}
                    →
                  </Link>
                </p>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}