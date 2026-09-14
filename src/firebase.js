// Firebase設定

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {
  getAuth,
  signInAnonymously,
} from 'firebase/auth';

import {
  initializeAppCheck,
  ReCaptchaEnterpriseProvider,
} from 'firebase/app-check';

// Firebaseの設定
const firebaseConfig = {
apiKey: "AIzaSyD3118Aq67eYETIq8J_KcIRWWD0SXcp5ek",
authDomain: "fuwafuwa-profile.firebaseapp.com",
projectId: "fuwafuwa-profile",
storageBucket: "fuwafuwa-profile.firebasestorage.app",
messagingSenderId: "13290620098",
appId: "1:13290620098:web:1be96853a99c2653a4a75b"
};

// Firebaseを初期化
const app = initializeApp(firebaseConfig);

// Firestore
export const db = getFirestore(app);

// Authentication
export const auth = getAuth(app);

// Firebase App Check
initializeAppCheck(app, {
  provider: new ReCaptchaEnterpriseProvider(
    '6LdearstAAAAAPNcOJPskeRNNSD7Cd-sVaAj4Zgy'
  ),
  isTokenAutoRefreshEnabled: true,
});

/**
 * 匿名ログインを確実に行う
 *
 * すでにログイン済みなら、そのユーザーをそのまま返す。
 * 未ログインなら匿名ユーザーを新しく作成する。
 *
 * @returns {Promise<import('firebase/auth').User>}
 */
export async function ensureAnonymousAuth() {
  if (auth.currentUser) {
    return auth.currentUser;
  }

  try {
    const result = await signInAnonymously(auth);

    return result.user;
  } catch (error) {
    console.error(
      '匿名ログインに失敗しました:',
      error
    );

    throw error;
  }
}