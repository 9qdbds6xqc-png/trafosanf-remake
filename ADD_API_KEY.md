# OpenAI API Key zu GitHub Secrets hinzufügen

## Schritt-für-Schritt Anleitung

Der API-Key muss als **Secret** in GitHub gespeichert werden, damit er beim Build verwendet wird.

### Schritt 1: Gehe zu Repository Secrets

1. Öffne: https://github.com/9qdbds6xqc-png/trafosanf-remake/settings/secrets/actions

### Schritt 2: Neues Secret hinzufügen

1. Klicke auf **"New repository secret"** (grüner Button oben rechts)

2. **Name:** `VITE_OPENAI_API_KEY`
   - **Wichtig:** Der Name muss GENAU so sein (Groß-/Kleinschreibung beachten!)

3. **Secret:** Füge deinen OpenAI API Key ein:
   ```
   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
   ```

4. Klicke **"Add secret"**

### Schritt 3: Workflow erneut ausführen

1. Gehe zu: https://github.com/9qdbds6xqc-png/trafosanf-remake/actions

2. Klicke auf den neuesten Workflow-Run

3. Klicke **"Re-run all jobs"** oder **"Re-run failed jobs"**

   ODER

4. Klicke auf **"Deploy to GitHub Pages"** (links)
5. Klicke **"Run workflow"** → Branch: `main` → **"Run workflow"**

### Schritt 4: Prüfen

Nach erfolgreichem Deployment sollte die Website wieder funktionieren. Die API-Calls sollten jetzt durchgehen.

## Falls der API-Key nicht funktioniert

- Prüfe, ob der API-Key noch aktiv ist
- Prüfe, ob du Credits auf deinem OpenAI Account hast
- Prüfe die Workflow-Logs auf Fehlermeldungen

