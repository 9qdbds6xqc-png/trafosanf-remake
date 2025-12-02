# Supabase Database Setup für Backlog

Diese Anleitung erklärt, wie du eine Datenbank für die Backlog-Speicherung einrichtest.

## Warum Supabase?

- ✅ Kostenlos für kleine Projekte
- ✅ PostgreSQL-Datenbank (robust und skalierbar)
- ✅ Einfache REST API
- ✅ Automatische Authentifizierung
- ✅ Real-time Updates möglich

## Schritt 1: Supabase Account erstellen

1. Gehe zu: https://supabase.com
2. Klicke "Start your project" (kostenlos)
3. Melde dich mit GitHub an
4. Erstelle ein neues Projekt:
   - **Name:** produkt-assistent-backlog
   - **Database Password:** (sicheres Passwort notieren)
   - **Region:** Wähle die nächstgelegene Region
5. Warte bis das Projekt erstellt ist (1-2 Minuten)

## Schritt 2: Datenbank-Tabelle erstellen

1. Gehe zu deinem Supabase Project Dashboard
2. Klicke auf **"SQL Editor"** (linke Sidebar)
3. Klicke **"New query"**
4. Füge diesen SQL-Code ein:

```sql
-- Create backlog entries table
CREATE TABLE IF NOT EXISTS backlog_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  company_id TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  pdf_file_name TEXT,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  is_pricing_question BOOLEAN DEFAULT FALSE,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_company_id ON backlog_entries(company_id);
CREATE INDEX IF NOT EXISTS idx_timestamp ON backlog_entries(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_session_id ON backlog_entries(session_id);

-- Enable Row Level Security (optional - für mehr Sicherheit)
ALTER TABLE backlog_entries ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all operations (für einfachen Zugriff)
CREATE POLICY "Allow all operations" ON backlog_entries
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

5. Klicke **"Run"** (oder Ctrl+Enter)

## Schritt 3: API Keys holen

1. Gehe zu **"Settings"** → **"API"**
2. Kopiere diese Werte:
   - **Project URL** (unter "Project URL")
   - **anon/public key** (unter "Project API keys")

## Schritt 4: Environment Variables in Vercel setzen

1. Gehe zu deinem Vercel Project Dashboard
2. **Settings** → **Environment Variables**
3. Füge hinzu:
   - **Name:** `SUPABASE_URL`
   - **Value:** Deine Project URL (z.B. `https://xxxxx.supabase.co`)
   - **Environments:** Production, Preview, Development

4. Füge hinzu:
   - **Name:** `SUPABASE_ANON_KEY`
   - **Value:** Dein anon/public key
   - **Environments:** Production, Preview, Development

5. Füge hinzu (optional):
   - **Name:** `SUPABASE_TABLE`
   - **Value:** `backlog_entries`
   - **Environments:** Production, Preview, Development

6. Klicke **"Save"** für jede Variable

## Schritt 5: API URL zu GitHub Secrets hinzufügen

1. Gehe zu: https://github.com/9qdbds6xqc-png/trafosanf-remake/settings/secrets/actions
2. Füge hinzu:
   - **Name:** `VITE_BACKLOG_API_URL`
   - **Value:** `https://deine-vercel-app.vercel.app/api/backlog`
     - Ersetze `deine-vercel-app` mit deinem Vercel-Projektnamen
3. Klicke **"Add secret"**

## Schritt 6: Deployment

1. Vercel wird automatisch redeployen, wenn du die Environment Variables änderst
2. Oder manuell: Gehe zu Vercel Dashboard → Deployments → "Redeploy"

3. GitHub Pages Workflow neu starten:
   - https://github.com/9qdbds6xqc-png/trafosanf-remake/actions
   - "Deploy to GitHub Pages" → "Run workflow"

## Schritt 7: Testing

1. Öffne: https://ki-vergabe.de
2. Stelle eine Frage im Chat
3. Gehe zu Supabase Dashboard → **"Table Editor"**
4. Öffne die Tabelle `backlog_entries`
5. Du solltest den Eintrag sehen!

## Alle Gespräche ansehen

### Option 1: Über Supabase Dashboard

1. Gehe zu Supabase Dashboard
2. **"Table Editor"** → `backlog_entries`
3. Du siehst alle Einträge mit Filter- und Sortieroptionen

### Option 2: Über Backlog-Seite mit Company-ID

1. Wenn du die Website an ein Unternehmen weitergibst, füge `?company=COMPANY_NAME` zur URL hinzu:
   - Beispiel: `https://ki-vergabe.de?company=AcmeCorp`
2. Alle Einträge von dieser Company-ID werden getrackt
3. Du kannst dann in Supabase nach `company_id` filtern

### Option 3: Admin-Interface erstellen (optional)

Ich kann dir auch eine Admin-Seite erstellen, wo du alle Gespräche einsehen kannst.

## Wichtige URLs

- **Supabase Dashboard:** https://app.supabase.com
- **Vercel Dashboard:** https://vercel.com
- **API Endpoint:** `https://deine-vercel-app.vercel.app/api/backlog`

## Troubleshooting

### Keine Einträge in der Datenbank?
- Prüfe ob `VITE_BACKLOG_API_URL` in GitHub Secrets gesetzt ist
- Prüfe ob Supabase Environment Variables in Vercel gesetzt sind
- Prüfe Vercel Function Logs für Fehler

### Row Level Security Fehler?
- Prüfe die Policy in Supabase SQL Editor
- Stelle sicher, dass die Policy "Allow all operations" aktiv ist

## Kosten

**Supabase Free Tier:**
- ✅ 500 MB Database
- ✅ 2 GB Bandwidth
- ✅ Für dieses Projekt völlig ausreichend

