// タグ入力コンポーネント（フリー入力でタグを追加できる汎用部品）
import { useState } from 'react';

/**
 * @param {object} props
 * @param {string[]} props.values - 現在のタグ一覧
 * @param {function} props.onChange - タグ一覧変更ハンドラ
 * @param {string} props.placeholder - 入力プレースホルダー
 * @param {number} props.max - 最大タグ数
 */
export default function TagInput({ values = [], onChange, placeholder = '入力してEnter', max = 20 }) {
  const [input, setInput] = useState('');

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !values.includes(trimmed) && values.length < max) {
      onChange([...values, trimmed]);
    }
    setInput('');
  };

  const removeTag = (tag) => {
    onChange(values.filter((v) => v !== tag));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
    if (e.key === 'Backspace' && !input && values.length > 0) {
      removeTag(values[values.length - 1]);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 0 }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          style={{ borderRight: 0 }}
        />
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={addTag}
          disabled={!input.trim() || values.length >= max}
          style={{ flexShrink: 0, whiteSpace: 'nowrap' }}
        >
          追加
        </button>
      </div>
      {values.length > 0 && (
        <div className="tag-list">
          {values.map((tag) => (
            <span key={tag} className="tag">
              {tag}
              <button
                type="button"
                className="tag-remove"
                onClick={() => removeTag(tag)}
                aria-label={`${tag}を削除`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
        {values.length}/{max}件
      </p>
    </div>
  );
}
