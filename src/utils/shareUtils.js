// URL共有ユーティリティ - プロフィールや布教データをURLに変換する
import LZString from 'lz-string';

/**
 * データをURLパラメータにエンコードする
 * @param {object} data - エンコードするオブジェクト
 * @returns {string} - Base64圧縮されたURLパラメータ文字列
 */
export function encodeData(data) {
  const json = JSON.stringify(data);
  return LZString.compressToEncodedURIComponent(json);
}

/**
 * URLパラメータからデータをデコードする
 * @param {string} encoded - エンコードされた文字列
 * @returns {object|null} - デコードされたオブジェクト、失敗時はnull
 */
export function decodeData(encoded) {
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
}

/**
 * プロフィールデータから共有URLを生成する
 * @param {object} profileData - プロフィールデータ
 * @returns {string} - 共有URL
 */
export function generateProfileShareUrl(profileData) {
  const encoded = encodeData(profileData);
  const base = window.location.origin + window.location.pathname;
  return `${base}#/profile/view?d=${encoded}`;
}

/**
 * 布教ページデータから共有URLを生成する
 * @param {object} fukyoData - 布教ページデータ
 * @returns {string} - 共有URL
 */
export function generateFukyoShareUrl(fukyoData) {
  const encoded = encodeData(fukyoData);
  const base = window.location.origin + window.location.pathname;
  return `${base}#/fukyo/view?d=${encoded}`;
}
