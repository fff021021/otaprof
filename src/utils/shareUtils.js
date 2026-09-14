// URL共有・Firebase共有ユーティリティ
// プロフィールや布教データをFirebaseに保存し、短いIDで共有する

import LZString from 'lz-string';

import {
  doc,
  setDoc,
  getDoc,
  collection,
} from 'firebase/firestore';

import {
  db,
  ensureAnonymousAuth,
} from '../firebase';


// ==================================================
// 旧形式URL用
// ==================================================

/**
 * データをURLパラメータにエンコードする
 *
 * ※既存の処理との互換性のため残している
 *
 * @param {object} data - エンコードするオブジェクト
 * @returns {string} - 圧縮されたURLパラメータ文字列
 */
export function encodeData(data) {
  const json = JSON.stringify(data);
  return LZString.compressToEncodedURIComponent(json);
}


/**
 * URLパラメータからデータをデコードする
 *
 * ※既存の d= 形式URLとの互換性のため残している
 *
 * @param {string} encoded - エンコードされた文字列
 * @returns {object|null} - デコードされたオブジェクト、失敗時はnull
 */
export function decodeData(encoded) {
  try {
    const json =
      LZString.decompressFromEncodedURIComponent(encoded);

    if (!json) return null;

    return JSON.parse(json);

  } catch (e) {
    return null;
  }
}


// ==================================================
// プロフィール
// ==================================================

/**
 * プロフィールデータをFirebaseに保存する
 *
 * 匿名認証を行い、
 * 保存データに ownerUid を付ける。
 *
 * @param {object} profileData - プロフィールデータ
 * @returns {Promise<string>} - 保存したデータのID
 */
export async function saveProfileData(profileData) {

  // 匿名ログインを確実に行う
  const user = await ensureAnonymousAuth();

  // Firestoreに新しいドキュメントを作成
  const ref = doc(collection(db, 'profiles'));

  // プロフィールデータ + 所有者UIDを保存
  await setDoc(ref, {
    ...profileData,
    ownerUid: user.uid,
  });

  return ref.id;
}


/**
 * Firebaseからプロフィールデータを取得する
 *
 * @param {string} id - プロフィールID
 * @returns {Promise<object|null>} - プロフィールデータ
 */
export async function loadProfileData(id) {

  try {

    const ref = doc(db, 'profiles', id);

    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
      return null;
    }

    return snapshot.data();

  } catch (e) {

    console.error(
      'プロフィールデータの取得に失敗しました:',
      e
    );

    return null;
  }
}


// ==================================================
// 布教ページ
// ==================================================

/**
 * 布教ページデータをFirebaseに保存する
 *
 * 匿名認証を行い、
 * 保存データに ownerUid を付ける。
 *
 * @param {object} fukyoData - 布教ページデータ
 * @returns {Promise<string>} - 保存したデータのID
 */
export async function saveFukyoData(fukyoData) {

  // 匿名ログインを確実に行う
  const user = await ensureAnonymousAuth();

  // Firestoreに新しいドキュメントを作成
  const ref = doc(collection(db, 'fukyo'));

  // 布教データ + 所有者UIDを保存
  await setDoc(ref, {
    ...fukyoData,
    ownerUid: user.uid,
  });

  return ref.id;
}


/**
 * Firebaseから布教ページデータを取得する
 *
 * @param {string} id - 布教ページID
 * @returns {Promise<object|null>} - 布教ページデータ
 */
export async function loadFukyoData(id) {

  try {

    const ref = doc(db, 'fukyo', id);

    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) {
      return null;
    }

    return snapshot.data();

  } catch (e) {

    console.error(
      '布教データの取得に失敗しました:',
      e
    );

    return null;
  }
}


// ==================================================
// 共有URL生成
// ==================================================

/**
 * プロフィールデータから共有URLを生成する
 *
 * Firebaseにデータを保存して、
 * 短いIDを使ったURLを生成する。
 *
 * @param {object} profileData - プロフィールデータ
 * @returns {Promise<string>} - 共有URL
 */
export async function generateProfileShareUrl(profileData) {

  const id = await saveProfileData(profileData);

  const base =
    window.location.origin +
    window.location.pathname;

  return `${base}#/profile/view?id=${id}`;
}


/**
 * 布教ページデータから共有URLを生成する
 *
 * Firebaseにデータを保存して、
 * 短いIDを使ったURLを生成する。
 *
 * @param {object} fukyoData - 布教ページデータ
 * @returns {Promise<string>} - 共有URL
 */
export async function generateFukyoShareUrl(fukyoData) {

  const id = await saveFukyoData(fukyoData);

  const base =
    window.location.origin +
    window.location.pathname;

  return `${base}#/fukyo/view?id=${id}`;
}