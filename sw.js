// Bei jedem inhaltlichen Update dieser Datei (oder von app.jsx/index.html) MUSS sich dieser Name
// ändern — sonst erkennt der "activate"-Handler unten den alten Cache nie als veraltet, und Nutzer
// bleiben auf einer alten, zum Rest der App nicht mehr passenden app.jsx hängen (genau das hat zu
// scheinbar zufällig kaputten Buttons geführt: verschiedene Programmteile passten nicht mehr zusammen).
const CACHE_NAME = "fussball-manager-v96";

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./app.jsx",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-512-maskable.png",
  "./icons/apple-touch-icon.png",
  "./favicon-32.png",
  "./favicon-16.png"
];

// Diese Dateien entscheiden über das tatsächliche Verhalten der App — hier IMMER zuerst das Netz
// versuchen (Network-First) und nur bei fehlender Verbindung auf die zwischengespeicherte Version
// zurückfallen. Alles andere (Icons, CDN-Bibliotheken wie React/Babel/Tailwind) darf weiterhin
// aggressiv aus dem Cache bedient werden (Stale-While-Revalidate) — die ändern sich kaum und profitieren
// von schnellerem Start bzw. vollständigem Offline-Betrieb.
const NETWORK_FIRST_PATHS = ["/", "/index.html", "/app.jsx", "/manifest.json"];

function istNetworkFirst(url) {
  const pathname = new URL(url).pathname;
  return NETWORK_FIRST_PATHS.some((p) => pathname === p || pathname.endsWith(p.replace("./", "/")));
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  if (istNetworkFirst(req.url)) {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const copy = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return networkRes;
        })
        .catch(() => caches.match(req))
    );
    return;
  }

  // Stale-while-revalidate für alles Übrige (Icons, CDN-Ressourcen) — liefert sofort aus dem Cache
  // (auch offline nutzbar), aktualisiert im Hintergrund für den nächsten Aufruf.
  event.respondWith(
    caches.match(req).then((cached) => {
      const fetchAndUpdate = fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const copy = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return networkRes;
        })
        .catch(() => cached);
      return cached || fetchAndUpdate;
    })
  );
});
