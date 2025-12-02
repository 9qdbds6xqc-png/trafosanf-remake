# Vercel Deployment Guide - Schritt für Schritt

## Prüfe deine Vercel-Konfiguration:

### 1. Ist Vercel mit GitHub verbunden?

**Prüfe:**
1. Gehe zu: https://vercel.com/dashboard
2. Wähle Projekt: `trafosanf-remake`
3. Gehe zu: **Settings** → **Git**
4. **Prüfe:** Ist das Repository verbunden?

**Falls NICHT verbunden:**
- Klicke "Connect Git Repository"
- Wähle `9qdbds6xqc-png/trafosanf-remake`
- Vercel wird automatisch bei jedem Push deployen

---

### 2. Prüfe ob Auto-Deploy aktiviert ist

**Prüfe:**
1. Vercel Dashboard → Projekt → **Settings** → **Git**
2. **Prüfe:** "Production Branch" = `main`?
3. **Prüfe:** "Auto Deploy" = ✅ aktiviert?

**Falls nicht:**
- Aktiviere "Auto Deploy"
- Jeder Push zu `main` deployt automatisch

---

### 3. Prüfe Build Settings

**Prüfe:**
1. Vercel Dashboard → Projekt → **Settings** → **General**
2. **Prüfe:**
   - Framework Preset: `Vite` oder `Other`
   - Build Command: `npm run build` (oder leer)
   - Output Directory: `dist` (oder leer)
   - Install Command: `npm install` (oder leer)

**Falls falsch:**
- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

---

### 4. Prüfe ob API-Funktionen erkannt werden

**Prüfe:**
1. Vercel Dashboard → Projekt → **Deployments**
2. Klicke auf neuesten Deployment
3. Gehe zu Tab **"Functions"**
4. **Prüfe:** Siehst du `/api/backlog`?

**Falls NICHT:**
- Die `api/` Dateien werden nicht erkannt
- Prüfe ob `api/backlog.ts` im Repository existiert

---

### 5. Manuelles Deployment auslösen

**Falls Auto-Deploy nicht funktioniert:**

**Option A: Via Vercel Dashboard**
1. Vercel Dashboard → Projekt → **Deployments**
2. Klicke **"Create Deployment"** (rechts oben)
3. Branch: `main`
4. Klicke **"Deploy"**

**Option B: Via Vercel CLI** (falls installiert)
```bash
cd /Users/davidwulff/RepoPrompt/trafosanf-remake
vercel --prod
```

---

### 6. Prüfe Environment Variables

**Prüfe:**
1. Vercel Dashboard → Projekt → **Settings** → **Environment Variables**
2. **Prüfe ob gesetzt:**
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_TABLE` = `backlog_entries`

**Falls fehlen:**
- Füge sie hinzu
- Wähle alle Environments (Production, Preview, Development)
- **WICHTIG:** Nach dem Hinzufügen → Redeploy!

---

## Häufige Probleme:

### Problem 1: "API-Funktion nicht gefunden"
**Lösung:**
- Prüfe ob `api/backlog.ts` im Repository existiert
- Prüfe ob Datei-Endung `.ts` ist (nicht `.js`)
- Prüfe ob Datei im `api/` Ordner ist

### Problem 2: "Deployment läuft, aber API funktioniert nicht"
**Lösung:**
- Prüfe Vercel Logs (Deployments → Functions → View Logs)
- Prüfe ob Environment Variables gesetzt sind
- Prüfe ob Code-Fehler in Logs sichtbar sind

### Problem 3: "CORS-Fehler besteht weiterhin"
**Lösung:**
- Prüfe ob neues Deployment nach Code-Änderungen erstellt wurde
- Prüfe ob `/api/backlog` Function existiert
- Teste OPTIONS-Anfrage direkt (siehe unten)

---

## Test nach Deployment:

### Test 1: Prüfe ob Function deployed wurde
```bash
curl -X OPTIONS "https://trafosanf-remake-bcq0d0f3e-davids-projects-abae1d70.vercel.app/api/backlog" \
  -H "Origin: https://ki-vergabe.de" \
  -H "Access-Control-Request-Method: POST" \
  -i
```

**Erwartete Antwort:**
```
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://ki-vergabe.de
```

**Falls 404:**
→ Function wurde nicht deployed

**Falls 401:**
→ Function existiert, aber Authentication-Problem

**Falls keine CORS-Header:**
→ Code wurde nicht deployed oder CORS-Code ist falsch

---

## Nächste Schritte:

1. **Prüfe alle Punkte oben**
2. **Falls Auto-Deploy nicht aktiv:** Aktiviere es
3. **Falls Environment Variables fehlen:** Füge sie hinzu
4. **Redeploy manuell** falls nötig
5. **Teste erneut**

---

## Zusammenfassung:

| Item | Prüfen |
|------|--------|
| Git verbunden? | Settings → Git |
| Auto-Deploy aktiv? | Settings → Git |
| Build Settings korrekt? | Settings → General |
| API-Funktionen sichtbar? | Deployments → Functions |
| Environment Variables gesetzt? | Settings → Environment Variables |

**Sag mir, was du siehst, dann kann ich dir gezielt helfen!**

