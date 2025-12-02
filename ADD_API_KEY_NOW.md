# API-Key SOFORT hinzufügen - 2 Minuten

## Option 1: Über GitHub Web-Interface (Einfachste Methode)

1. **Öffne diesen Link:**
   https://github.com/9qdbds6xqc-png/trafosanf-remake/settings/secrets/actions

2. **Klicke auf den grünen Button:** "New repository secret"

3. **Fülle aus:**
   - **Name:** `VITE_OPENAI_API_KEY`
   - **Secret:** `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`

4. **Klicke:** "Add secret"

5. **Workflow neu starten:**
   - Gehe zu: https://github.com/9qdbds6xqc-png/trafosanf-remake/actions
   - Klicke links auf "Deploy to GitHub Pages"
   - Klicke "Run workflow" → "Run workflow"

**Fertig!** 🎉

---

## Option 2: Über Terminal (Wenn du GitHub CLI nutzen willst)

Falls du GitHub CLI authentifiziert hast:

```bash
gh secret set VITE_OPENAI_API_KEY \
  --repo 9qdbds6xqc-png/trafosanf-remake \
  --body "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"
```

