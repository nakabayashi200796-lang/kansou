// Firebase の設定。Firebase の画面「プロジェクトの設定」→「マイアプリ」に出る firebaseConfig の中身をここへ写す。
// この値は秘密の鍵ではない（誰が見ても、データは保存のルールで kyo 以外に読めない）。
// apiKey が空のままだと「お試しモード」で動き、この端末の中だけに保存する。
export const CONFIG = {
  apiKey: "AIzaSyDUZr_ux2rr7rYc_x1zfR5Thb3ssPp48QQ",
  authDomain: "kansou-note.firebaseapp.com",
  projectId: "kansou-note",
  storageBucket: "kansou-note.firebasestorage.app",
  messagingSenderId: "575296050236",
  appId: "1:575296050236:web:9d725d6aff82de1bf39f39"
};
