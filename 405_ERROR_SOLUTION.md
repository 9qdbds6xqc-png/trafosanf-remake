# Lösung für 405 Fehler

## Problem
Die API gibt einen 405 Fehler zurück mit `{"error":"Failed to save entry","details":""}`.

## Ursache
Der 405 Fehler kommt von Supabase, nicht von unserer Funktion. Das bedeutet:
1. ✅ Supabase ist konfiguriert (sonst würde der Fallback verwendet werden)
2. ❌ Supabase gibt 405 zurück (wahrscheinlich weil die Tabelle nicht existiert oder RLS blockiert)

## Lösung

### Option 1: Supabase Tabelle prüfen und erstellen (Empfohlen)

1. **Gehe zu Supabase Dashboard:**
   - Öffne dein Supabase Projekt
   - Gehe zu "Table Editor"

2. **Prüfe ob die Tabelle existiert:**
   - Suche nach `backlog_entries`
   - Falls nicht vorhanden, erstelle sie mit diesem SQL:

```sql
CREATE TABLE backlog_entries (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT NOT NULL,
  company_id TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  pdf_file_name TEXT,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  is_pricing_question BOOLEAN DEFAULT FALSE,
  error TEXT
);
```

3. **Prüfe RLS Policies:**
   - Gehe zu "Authentication" → "Policies"
   - Stelle sicher, dass INSERT erlaubt ist:

```sql
-- Allow anonymous inserts
CREATE POLICY "Allow anonymous inserts" ON backlog_entries
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow anonymous selects (optional, für GET requests)
CREATE POLICY "Allow anonymous selects" ON backlog_entries
FOR SELECT
TO anon
USING (true);
```

### Option 2: Fallback verwenden (Temporär)

Falls Supabase nicht funktionieren soll, entferne die Environment Variables in Vercel:
1. Gehe zu Vercel → Settings → Environment Variables
2. Entferne oder deaktiviere:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

Die Funktion wird dann den Fallback `handleSimple` verwenden (speichert nur im Speicher, nicht persistent).

### Option 3: Vercel Logs prüfen

Um die genaue Ursache zu sehen:
1. Gehe zu Vercel Dashboard → Deployments
2. Öffne das neueste Deployment
3. Gehe zu "Functions" → `/api/backlog`
4. Prüfe die Logs auf:
   - `=== Configuration Check ===`
   - `=== Supabase POST Request ===`
   - `Supabase response status: ...`
   - `Supabase error: ...`

## Nächste Schritte

1. ✅ Prüfe Vercel Logs (siehe Option 3)
2. ✅ Prüfe Supabase Tabelle (siehe Option 1)
3. ✅ Prüfe RLS Policies (siehe Option 1)
4. ✅ Teste erneut

## Erwartetes Ergebnis nach dem Fix

Nach dem Fix sollte die API `201 Created` zurückgeben mit:
```json
{
  "success": true,
  "entry": {
    "id": 1,
    "session_id": "test-123",
    "question": "Test Frage",
    "answer": "Test Antwort",
    ...
  }
}
```

