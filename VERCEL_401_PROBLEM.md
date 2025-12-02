# Vercel 401 Problem - OPTIONS Anfrage wird blockiert

## Problem:
OPTIONS-Anfrage gibt **HTTP 401** zurück - "Authentication Required"

Das bedeutet: Vercel blockiert die Anfrage **bevor** sie die Function erreicht.

---

## Mögliche Ursachen:

### 1. Vercel Project Protection aktiviert
- Vercel Dashboard → Projekt → Settings → **Deployment Protection**
- Falls aktiviert: Deaktiviere es für `/api/*` Routes

### 2. Vercel Authentication erforderlich
- Die Function ist möglicherweise geschützt
- Prüfe: Vercel Dashboard → Settings → **General**

### 3. Function wurde nicht deployed
- Prüfe: Vercel Dashboard → Deployments → Functions
- Siehst du `/api/backlog`?

---

## Lösung: Prüfe Vercel Settings

### Schritt 1: Prüfe Deployment Protection

1. **Gehe zu:** Vercel Dashboard → Projekt → Settings → **Deployment Protection**
2. **Prüfe:** Ist "Vercel Authentication" aktiviert?
3. **Falls JA:** Deaktiviere es ODER füge Ausnahmen hinzu für `/api/*`

### Schritt 2: Prüfe ob Function deployed wurde

1. **Gehe zu:** Vercel Dashboard → Deployments → Neuester Deployment
2. **Gehe zu Tab:** **"Functions"**
3. **Prüfe:** Siehst du `/api/backlog`?

**Falls NEIN:**
- Die Function wurde nicht deployed
- Prüfe ob `api/backlog.ts` im Repository existiert
- Prüfe Vercel Build Logs

### Schritt 3: Prüfe Vercel Logs

1. **Vercel Dashboard** → Deployments → Neuester Deployment
2. **Functions** → `/api/backlog` → **View Logs**
3. **Prüfe:** Siehst du Logs wie:
   - `Request method: OPTIONS`
   - `Handling OPTIONS preflight request`

**Falls KEINE Logs:**
- Die Function wird nicht aufgerufen
- OPTIONS-Anfrage wird vorher blockiert

---

## Alternative Lösung: Proxy über GitHub Pages

Falls Vercel weiterhin Probleme macht, können wir einen Proxy über GitHub Pages einrichten.

**Aber zuerst:** Prüfe die Vercel Settings oben!

---

## Zusammenfassung:

| Problem | Prüfen |
|---------|--------|
| 401 Fehler | Vercel blockiert Anfrage |
| Deployment Protection? | Settings → Deployment Protection |
| Function deployed? | Deployments → Functions |
| Logs vorhanden? | Functions → View Logs |

**Bitte prüfe die Vercel Settings und sag mir, was du siehst!**

