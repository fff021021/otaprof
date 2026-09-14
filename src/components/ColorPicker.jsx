// アクセントカラーピッカー: 選択した色をCSS変数にリアルタイム反映
import { useEffect } from 'react';

// プリセットカラーパレット
const PRESET_COLORS = [
  { value: '#FF6B2B', label: 'オレンジ（デフォルト）' },
  { value: '#E84393', label: 'ピンク' },
  { value: '#7B5EA7', label: 'パープル' },
  { value: '#2B7FFF', label: 'ブルー' },
  { value: '#00A878', label: 'グリーン' },
  { value: '#C0392B', label: 'レッド' },
  { value: '#2C3E50', label: 'ネイビー' },
  { value: '#D4A017', label: 'ゴールド' },
];

/**
 * @param {object} props
 * @param {string} props.value - 現在の選択色（HEX）
 * @param {function} props.onChange - 色変更ハンドラ
 * @param {boolean} props.applyGlobally - trueのとき、選択した色をCSS変数に即座に反映
 */
export default function ColorPicker({ value, onChange, applyGlobally = false }) {
  // CSS変数にリアルタイム反映
  useEffect(() => {
    if (applyGlobally && value) {
      document.documentElement.style.setProperty('--accent', value);
      // --accent-paleを自動計算（元色を薄くする）
      document.documentElement.style.setProperty('--accent-pale', hexToAlpha(value, 0.12));
    }
  }, [value, applyGlobally]);

  return (
    <div className="color-picker-section">
      <p className="color-picker-title">アクセントカラーを選択</p>
      <div className="color-swatches">
        {PRESET_COLORS.map((color) => (
          <button
            key={color.value}
            className={`color-swatch ${value === color.value ? 'selected' : ''}`}
            style={{ background: color.value }}
            onClick={() => onChange(color.value)}
            title={color.label}
            aria-label={color.label}
          />
        ))}
        {/* カスタムカラー入力 */}
        <input
          type="color"
          className="color-custom-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          title="カスタムカラーを選択"
        />
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
          {value}
        </span>
      </div>
    </div>
  );
}

/**
 * HEXカラーをRGBA（または薄いHEX）に変換する補助関数
 * ここではシンプルに半透明の白を混ぜた近似色を返す
 */
function hexToAlpha(hex, alpha) {
  // CSS rgba記法で返す
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
