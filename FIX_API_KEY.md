# API-Key Problem beheben - Schritt für Schritt

## Das Problem

Vite baut Environment Variables zur **Build-Zeit** in den Code ein. Das bedeutet:
- Der Secret muss **vor dem Build** vorhanden sein
- Nach dem Hinzufügen des Secrets muss der **Workflow neu gestartet** werden
- Ein einfacher Push reicht nicht - der Build muss mit dem Secret neu laufen

## Lösung: Workflow NEU starten

### Schritt 1: Prüfe ob Secret vorhanden ist

1. Gehe zu: https://github.com/9qdbds6xqc-png/trafosanf-remake/settings/secrets/actions
2. Prüfe: Siehst du `VITE_OPENAI_API_KEY` in der Liste?
3. Falls **NEIN**: Füge ihn hinzu (siehe unten)

### Schritt 2: Workflow NEU starten (WICHTIG!)

1. Gehe zu: https://github.com/9qdbds6xqc-png/trafosanf-remake/actions

2. **Links im Menü:** Klicke auf **"Deploy to GitHub Pages"**

3. **Rechts oben:** Klicke auf **"Run workflow"** Dropdown

4. Wähle:
   - Branch: `main`
   - Klicke **"Run workflow"**

5. **Warte** bis der Workflow durchgelaufen ist (ca. 2-3 Minuten)

6. Prüfe ob er **grün** ist

### Schritt 3: Website testen

1. **Hard Refresh:** `Cmd+Shift+R` (Mac) oder `Ctrl+Shift+R` (Windows)
2. Teste die Website: https://ki-vergabe.de
3. Stelle eine Frage mit einem PDF

## Falls Secret noch nicht vorhanden ist

### Secret hinzufügen:

1. Gehe zu: https://github.com/9qdbds6xqc-png/trafosanf-remake/settings/secrets/actions
2. Klicke **"New repository secret"**
3. Name: `VITE_OPENAI_API_KEY` (EXAKT so, keine Leerzeichen)
4. Value: `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`
5. Klicke **"Add secret"**

**DANN:** Gehe zurück zu Schritt 2 (Workflow neu starten)

## Prüfen ob es funktioniert

1. **Browser-Konsole öffnen:** F12 → Console Tab
2. Stelle eine Frage
3. **Falls Fehler:** Kopiere die Fehlermeldung

**Mögliche Fehler:**
- "OpenAI API key not found" → Secret nicht vorhanden oder Workflow nicht neu gestartet
- "401 Unauthorized" → API-Key ist ungültig
- "Rate limit" → Zu viele Anfragen, warte kurz

