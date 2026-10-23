/* 感想ノート — 電波が無くても開けるようにするための小さな仕掛け */
const V = "kansou-v2";
const SHELL = ["./", "./index.html", "./config.js", "./manifest.webmanifest", "./icon-32.png", "./icon-180.png", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).catch(() => {}));
});

/* 同じ github.io の下にほかのアプリもあるので、消すのは自分（kansou-）の古い控えだけ */
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k.startsWith("kansou-") && k !== V).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);

  // Firebase の部品（版の番号つきで中身が変わらない）と文字の書体は、一度取ったら控えから出す
  if ((url.host === "www.gstatic.com" && url.pathname.startsWith("/firebasejs/")) ||
      url.host === "fonts.googleapis.com" || url.host === "fonts.gstatic.com") {
    e.respondWith(caches.open(V).then(c => c.match(e.request).then(r => r || fetch(e.request).then(res => {
      if (res.ok || res.type === "opaque") c.put(e.request, res.clone());
      return res;
    }))));
    return;
  }
  if (url.origin !== location.origin) return;          // Firebase とのやりとりそのものは素通し

  // 本体と設定は「まず新しいものを取りに行く」。取れなければ手元の控えを出す
  if (e.request.mode === "navigate" || url.pathname.endsWith("/config.js")) {
    const key = e.request.mode === "navigate" ? "./index.html" : "./config.js";
    e.respondWith(
      fetch(e.request)
        .then(r => { const c = r.clone(); caches.open(V).then(x => x.put(key, c)); return r; })
        .catch(() => caches.match(key).then(r => r || caches.match("./")))
    );
    return;
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
