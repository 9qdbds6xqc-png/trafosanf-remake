# GitHub Secret Prüfung: VITE_BACKLOG_API_URL

## ✅ Status: Secret existiert

Das Secret `VITE_BACKLOG_API_URL` wurde am **2025-12-02T12:33:26Z** erstellt.

## 🔍 Prüfung des Wertes

Da GitHub Secrets aus Sicherheitsgründen nicht direkt gelesen werden können, müssen wir den Wert manuell prüfen oder aktualisieren.

### Erwarteter Wert:
```
https://trafosanf-remake-k3z3987g0-davids-projects-abae1d70.vercel.app/api/backlog
```

**Wichtig:** Die URL muss mit `/api/backlog` enden!

## 📋 So prüfst du den aktuellen Wert:

### Option 1: Über GitHub Web Interface
1. Gehe zu: `https://github.com/9qdbds6xqc-png/trafosanf-remake/settings/secrets/actions`
2. Suche nach `VITE_BACKLOG_API_URL`
3. Klicke auf "Update" (nicht löschen!)
4. Prüfe den aktuellen Wert (wird als Punkte angezeigt)
5. Falls falsch, aktualisiere auf den erwarteten Wert

### Option 2: Über GitHub CLI
```bash
# Prüfe ob das Secret existiert (bereits gemacht ✅)
gh secret list

# Setze/aktualisiere den Wert (falls nötig)
gh secret set VITE_BACKLOG_API_URL --body "https://trafosanf-remake-k3z3987g0-davids-projects-abae1d70.vercel.app/api/backlog"
```

## ✅ So setzt du den korrekten Wert:

### Über GitHub CLI:
```bash
cd /Users/davidwulff/RepoPrompt/trafosanf-remake
gh secret set VITE_BACKLOG_API_URL --body "https://trafosanf-remake-k3z3987g0-davids-projects-abae1d70.vercel.app/api/backlog"
```

### Über GitHub Web Interface:
1. Gehe zu: `https://github.com/9qdbds6xqc-png/trafosanf-remake/settings/secrets/actions`
2. Klicke auf `VITE_BACKLOG_API_URL`
3. Klicke auf "Update"
4. Setze den Wert: `https://trafosanf-remake-k3z3987g0-davids-projects-abae1d70.vercel.app/api/backlog`
5. Klicke auf "Update secret"

## 🧪 Test nach dem Setzen:

Nach dem Setzen des Secrets:
1. **Trigger einen neuen Build:**
   ```bash
   # Erstelle einen leeren Commit um Build zu triggern
   git commit --allow-empty -m "Trigger build to test VITE_BACKLOG_API_URL"
   git push origin main
   ```

2. **Prüfe die Build-Logs:**
   - Gehe zu: `https://github.com/9qdbds6xqc-png/trafosanf-remake/actions`
   - Öffne den neuesten Workflow Run
   - Prüfe die Build-Logs auf Fehler

3. **Teste in der Anwendung:**
   - Öffne `https://ki-vergabe.de`
   - Öffne die Browser-Konsole (F12)
   - Stelle eine Frage im Chat
   - Prüfe die Konsole auf:
     - ✅ `Saving to database via API: https://...`
     - ✅ `Successfully saved backlog entry to database`
     - ❌ KEINE Warnung: "Backlog API URL not configured"

## 🔍 So prüfst du ob der Wert korrekt ist:

### Im Build-Log prüfen:
Nach einem Build kannst du in den Logs prüfen, ob die Warnung erscheint:
- ❌ `Backlog API URL not configured. Entries will only be stored locally.`
- ✅ `Saving to database via API: https://...`

### In der Browser-Konsole prüfen:
Nach dem Deployment auf `https://ki-vergabe.de`:
1. Öffne die Browser-Konsole (F12)
2. Führe aus:
   ```javascript
   console.log('API URL:', import.meta.env.VITE_BACKLOG_API_URL);
   ```
3. Prüfe ob die URL korrekt ist

## ⚠️ Häufige Fehler:

1. **URL endet nicht mit `/api/backlog`**
   - ❌ Falsch: `https://...vercel.app`
   - ✅ Richtig: `https://...vercel.app/api/backlog`

2. **HTTP statt HTTPS**
   - ❌ Falsch: `http://...`
   - ✅ Richtig: `https://...`

3. **Alte Vercel URL verwendet**
   - Prüfe die aktuelle Vercel Production URL
   - Aktualisiere das Secret falls nötig

## 📝 Nächste Schritte:

1. ✅ Secret existiert - **ERLEDIGT**
2. ⚠️ Prüfe ob der Wert korrekt ist (siehe oben)
3. ⚠️ Falls falsch, aktualisiere den Wert
4. ⚠️ Trigger einen neuen Build
5. ⚠️ Teste in der Anwendung

