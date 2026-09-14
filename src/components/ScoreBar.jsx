// スコアバーコンポーネント（相性スコアの各要素を横棒グラフで表示）
/**
 * @param {object} props
 * @param {string} props.label - ラベルテキスト
 * @param {number} props.score - 0〜100のスコア
 */
export default function ScoreBar({ label, score }) {
  return (
    <div className="score-bar-wrap">
      <div className="score-bar-header">
        <span className="score-bar-label">{label}</span>
        <span className="score-bar-value">{score}%</span>
      </div>
      <div className="score-bar">
        <div className="score-bar-fill" style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}
