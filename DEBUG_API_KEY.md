# API-Key Problem beheben

## Problem diagnostizieren

### 1. Prüfe Workflow-Logs

1. Gehe zu: https://github.com/9qdbds6xqc-png/trafosanf-remake/actions
2. Klicke auf den **neuesten Workflow-Run**
3. Klicke auf den **"build" Job**
4. Scroll zum **"Build" Schritt**
5. Prüfe, ob Fehler angezeigt werden

**Was zu suchen:**
- ❌ "VITE_OPENAI_API_KEY is not defined"
- ❌ "Missing environment variable"
- ❌ Build-Fehler

### 2. Prüfe GitHub Secrets

1. Gehe zu: https://github.com/9qdbds6xqc-png/trafosanf-remake/settings/secrets/actions
2. **Prüfe:**
   - ✅ Existiert `VITE_OPENAI_API_KEY`?
   - ✅ Ist der Name **genau** so (Groß-/Kleinschreibung)?

### 3. Workflow neu starten

**WICHTIG:** Nach dem Hinzufügen des Secrets muss der Workflow neu gestartet werden!

1. Gehe zu: https://github.com/9qdbds6xqc-png/trafosanf-remake/actions
2. Klicke links auf **"Deploy to GitHub Pages"**
3. Klicke **"Run workflow"** → Branch: `main` → **"Run workflow"**
4. Warte bis der Workflow **grün** ist

### 4. Browser-Cache leeren

Nach dem Deployment:
1. **Hard Refresh:** `Cmd+Shift+R` (Mac) oder `Ctrl+Shift+R` (Windows)
2. Oder: Browser-Cache komplett leeren

### 5. Prüfe Browser-Konsole

1. Öffne: https://ki-vergabe.de
2. Drücke **F12** (DevTools öffnen)
3. Gehe zu **Console** Tab
4. Stelle eine Frage
5. **Was siehst du?**
   - ❌ "OpenAI API key not found"
   - ❌ "401 Unauthorized"
   - ❌ Andere Fehler?

## Häufige Probleme

### Problem 1: Secret wurde nach dem Build hinzugefügt
**Lösung:** Workflow muss **neu gestartet** werden (siehe Schritt 3)

### Problem 2: Falscher Secret-Name
**Lösung:** Prüfe ob Name exakt ist: `VITE_OPENAI_API_KEY` (keine Leerzeichen, richtige Groß-/Kleinschreibung)

### Problem 3: Browser-Cache
**Lösung:** Hard Refresh oder Cache leeren

### Problem 4: API-Key ist ungültig/abgelaufen
**Lösung:** Prüfe OpenAI Account, erstelle neuen Key falls nötig

