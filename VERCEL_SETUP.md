# Vercel Serverless Auth Setup

Diese Anleitung erklärt, wie du die serverseitige Authentifizierung mit Vercel einrichtest.

## Warum Vercel?

- ✅ Passwort ist serverseitig und nicht im Client-Code sichtbar
- ✅ Bessere Sicherheit
- ✅ Kostenlos für kleine Projekte
- ✅ Funktioniert gut mit GitHub Pages

## Setup-Schritte

### Schritt 1: Vercel Account erstellen

1. Gehe zu: https://vercel.com
2. Melde dich mit GitHub an (empfohlen)
3. Account ist kostenlos

### Schritt 2: Neues Projekt erstellen

**Option A: Via GitHub (Empfohlen)**

1. Gehe zu: https://vercel.com/new
2. Wähle dein GitHub Repository: `9qdbds6xqc-png/trafosanf-remake`
3. Klicke "Import"
4. **WICHTIG:** Füge Environment Variable hinzu:
   - Key: `ADMIN_PASSWORD`
   - Value: `Meryem`
5. Klicke "Deploy"

**Option B: Via Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd /Users/davidwulff/RepoPrompt/trafosanf-remake
vercel

# Set environment variable
vercel env add ADMIN_PASSWORD
# Enter: Meryem

# Redeploy
vercel --prod
```

### Schritt 3: Environment Variable setzen

1. Gehe zu deinem Vercel Project Dashboard
2. Settings → Environment Variables
3. Füge hinzu:
   - **Name:** `ADMIN_PASSWORD`
   - **Value:** `Meryem`
   - **Environment:** Production, Preview, Development (alle)
4. Klicke "Save"

### Schritt 4: Auth API URL in GitHub Pages konfigurieren

1. Gehe zu: https://github.com/9qdbds6xqc-png/trafosanf-remake/settings/secrets/actions
2. Füge neuen Secret hinzu:
   - **Name:** `VITE_AUTH_API_URL`
   - **Value:** `https://deine-app.vercel.app/api/auth`
     - Ersetze `deine-app` mit deinem Vercel-Projektnamen
3. Klicke "Add secret"

### Schritt 5: Workflow neu starten

1. Gehe zu: https://github.com/9qdbds6xqc-png/trafosanf-remake/actions
2. Klicke "Deploy to GitHub Pages"
3. Klicke "Run workflow"

## Struktur

```
trafosanf-remake/
├── api/
│   └── auth.ts          # Vercel Serverless Function
├── vercel.json          # Vercel Config
└── src/
    └── lib/
        └── auth.ts      # Client-side Auth (ruft API auf)
```

## Wie es funktioniert

1. **Client** sendet Passwort an `/api/auth`
2. **Vercel Function** prüft Passwort serverseitig
3. **Response** bestätigt oder lehnt ab
4. **Client** speichert Auth-Status in localStorage

## Passwort ändern

Um das Passwort zu ändern:

1. Gehe zu Vercel Dashboard
2. Settings → Environment Variables
3. Ändere `ADMIN_PASSWORD`
4. Redeploy (automatisch oder manuell)

## Testing

Nach dem Setup:

1. Öffne: https://ki-vergabe.de/upload
2. Gib Passwort ein: `Meryem`
3. Sollte funktionieren!

## Troubleshooting

### "Failed to fetch" Fehler
- Prüfe ob `VITE_AUTH_API_URL` korrekt gesetzt ist
- Prüfe ob Vercel Function deployed ist
- Prüfe Browser-Konsole für Details

### Passwort funktioniert nicht
- Prüfe `ADMIN_PASSWORD` in Vercel Environment Variables
- Stelle sicher, dass es auf alle Environments gesetzt ist
- Redeploy das Vercel Project

### Fallback funktioniert
- Falls API nicht erreichbar ist, nutzt der Code einen Client-seitigen Fallback
- Das ist OK für Entwicklung, aber in Production sollte die API laufen

## Kosten

Vercel Free Tier:
- ✅ 100 GB Bandwidth/Monat
- ✅ Serverless Functions inklusive
- ✅ Für dieses Projekt völlig ausreichend

