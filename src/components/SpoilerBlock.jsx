// ネタバレブロック: クリックするまで内容が隠されている
import { useState } from 'react';

/**
 * @param {object} props
 * @param {string} props.label - トグルボタンのラベル（例: "ここからネタバレ"）
 * @param {React.ReactNode} props.children - 隠すコンテンツ
 */
export default function SpoilerBlock({ label = 'ここからネタバレあり', children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="spoiler-block">
      <button
        className="spoiler-toggle"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <span style={{ fontSize: '0.875rem', color: '#C0392B' }}>⚠</span>
        {open ? '▲ 非表示にする' : `▼ ${label}`}
      </button>
      {open && (
        <div className="spoiler-content">
          {children}
        </div>
      )}
    </div>
  );
}
