# Fussball Manager 26/27 — installierbare Web-App (PWA)

## Was ist das?
Eine fertige, installierbare Web-App-Version deines Fussball Managers. Kein Build-Schritt nötig —
React, Babel und Tailwind werden direkt im Browser über CDN geladen; `app.jsx` bleibt die
unveränderte Spiel-Datei (nur `window.storage` wurde durch echtes `localStorage` ersetzt, damit
Spielstände dauerhaft im Browser gespeichert werden, und am Ende steht der Render-Aufruf).

## Deployment auf Netlify
1. Diesen ganzen Ordner (`index.html`, `app.jsx`, `manifest.json`, `sw.js`, `netlify.toml`,
   `icons/`, `favicon-16.png`, `favicon-32.png`) als ZIP packen oder direkt den Ordner behalten.
2. Auf [app.netlify.com](https://app.netlify.com) einloggen → "Add new site" → "Deploy manually"
   → den Ordner (bzw. das ZIP, entpackt) per Drag & Drop in das Upload-Feld ziehen.
3. Fertig — Netlify vergibt automatisch eine URL (z.B. `dein-name.netlify.app`).

## Installieren
- **Android/Desktop (Chrome/Edge):** Seite öffnen → Adressleiste zeigt ein Installieren-Symbol,
  oder Menü → "App installieren".
- **iPhone/iPad (Safari):** Seite öffnen → Teilen-Symbol → "Zum Home-Bildschirm".

Einmal installiert, startet die App im Vollbild ohne Browser-Leiste, mit der Meisterschale als Icon.

## Offline-Nutzung
Ein Service Worker (`sw.js`) cacht alle Dateien inkl. der CDN-Ressourcen beim ersten Laden — danach
funktioniert die App auch ganz ohne Internetverbindung. Die eigentliche Spiel-Datei (`app.jsx`) wird
dabei bewusst "Network-First" geladen: bei bestehender Internetverbindung immer die neueste Version
vom Server, nur ohne Verbindung greift der Cache. So bleibt die App nach jedem Update automatisch
aktuell — sobald ein neues Update erkannt wird, lädt sich die Seite einmal automatisch neu.

**Nach diesem Update einmalig nötig:** Da die alte Version noch einen fehlerhaften Cache-Mechanismus
hatte, muss die App nach dem erneuten Netlify-Deploy einmal mit bestehender Internetverbindung
geöffnet werden, damit der neue Service Worker den alten ablöst (kurz warten oder die App einmal
manuell neu laden, falls sie nicht von selbst aktualisiert). Danach funktioniert die automatische
Aktualisierung zuverlässig von selbst.

## Spielstand
Wird automatisch im `localStorage` des Browsers gespeichert (Taste "Speicherstand" nicht nötig,
läuft automatisch nach jedem Spieltag). Achtung: `localStorage` ist geräte- und browserspezifisch —
es gibt keinen Cloud-Sync zwischen Handy und Desktop.

## Eigene Domain / Update
Bei jedem neuen Netlify-Deploy einfach den aktualisierten Ordner erneut hochladen (gleiche Site
"weiterbenutzen" wählen, nicht neu anlegen) — Netlify ersetzt die Dateien, der Spielstand im
Browser des Nutzers bleibt unangetastet.
