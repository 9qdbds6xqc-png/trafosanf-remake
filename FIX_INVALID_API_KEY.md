# API-Key ist ungültig - Lösung

## Problem
Die Fehlermeldung "OpenAI API key is invalid" bedeutet, dass der API-Key nicht von OpenAI akzeptiert wird.

## Mögliche Ursachen

1. **API-Key ist abgelaufen oder wurde deaktiviert**
2. **API-Key wurde falsch kopiert** (Leerzeichen, Zeilenumbrüche)
3. **API-Key hat nicht die richtigen Berechtigungen**
4. **API-Key gehört zu einem anderen Account**

## Lösung

### Option 1: Neuen API-Key erstellen (Empfohlen)

1. **Gehe zu OpenAI:** https://platform.openai.com/api-keys
2. **Logge dich ein** mit deinem OpenAI Account
3. **Klicke:** "Create new secret key"
4. **Kopiere den neuen Key** (wird nur einmal angezeigt!)
5. **Füge ihn zu GitHub Secrets hinzu:**

   - Gehe zu: https://github.com/9qdbds6xqc-png/trafosanf-remake/settings/secrets/actions
   - Klicke auf den existierenden `VITE_OPENAI_API_KEY` Secret
   - Klicke **"Update"**
   - Füge den neuen Key ein
   - Klicke **"Update secret"**

6. **Workflow neu starten:**
   - https://github.com/9qdbds6xqc-png/trafosanf-remake/actions
   - Klicke "Deploy to GitHub Pages" → "Run workflow"

### Option 2: Existierenden API-Key überprüfen

1. **Prüfe OpenAI Account:**
   - https://platform.openai.com/api-keys
   - Ist der Key noch aktiv?
   - Hat er die richtigen Berechtigungen?

2. **Prüfe GitHub Secret:**
   - https://github.com/9qdbds6xqc-png/trafosanf-remake/settings/secrets/actions
   - Klicke auf `VITE_OPENAI_API_KEY`
   - Prüfe ob der Key korrekt ist:
     - Keine Leerzeichen am Anfang/Ende
     - Keine Zeilenumbrüche
     - Beginnt mit `sk-`
     - Vollständig kopiert

3. **Falls falsch:** Klicke "Update" und füge den korrekten Key ein

### Option 3: Secret komplett neu erstellen

Falls Update nicht funktioniert:

1. **Lösche den alten Secret:**
   - https://github.com/9qdbds6xqc-png/trafosanf-remake/settings/secrets/actions
   - Klicke auf `VITE_OPENAI_API_KEY`
   - Klicke **"Delete"**

2. **Erstelle neuen Secret:**
   - Klicke "New repository secret"
   - Name: `VITE_OPENAI_API_KEY`
   - Value: Dein neuer/gültiger OpenAI API Key
   - Klicke "Add secret"

3. **Workflow neu starten:**
   - https://github.com/9qdbds6xqc-png/trafosanf-remake/actions
   - "Deploy to GitHub Pages" → "Run workflow"

## API-Key Format

Ein gültiger OpenAI API Key sieht so aus:
- Beginnt mit `sk-` oder `sk-proj-`
- Ist ca. 50-70 Zeichen lang
- Keine Leerzeichen oder Zeilenumbrüche

**Beispiel:** `sk-proj-abc123...xyz` (viel länger in echt)

## Nach dem Update

1. **Warte** bis Workflow fertig ist (2-3 Minuten)
2. **Hard Refresh:** `Cmd+Shift+R` / `Ctrl+Shift+R`
3. **Teste** die Website erneut

## Falls es immer noch nicht funktioniert

- Prüfe ob OpenAI Account Credits hat
- Prüfe ob API-Zugriff aktiviert ist
- Kontaktiere OpenAI Support falls nötig

