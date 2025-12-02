# Schritt 3 Überprüfung - SQL Tabelle vs API Code

## ✅ SQL Tabelle Definition (Schritt 3)

```sql
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
```

**Spalten in der Tabelle:**
- `id` (UUID, auto-generiert)
- `session_id` (TEXT, NOT NULL)
- `company_id` (TEXT, nullable)
- `timestamp` (TIMESTAMPTZ, NOT NULL)
- `pdf_file_name` (TEXT, nullable)
- `question` (TEXT, NOT NULL)
- `answer` (TEXT, NOT NULL)
- `is_pricing_question` (BOOLEAN, default FALSE)
- `error` (TEXT, nullable)
- `created_at` (TIMESTAMPTZ, auto)

---

## ✅ API Code (api/backlog.ts)

**POST Request sendet:**
```typescript
{
  session_id: entry.sessionId,          // ✓
  company_id: entry.companyId || null,  // ✓
  timestamp: new Date(...).toISOString(), // ✓
  pdf_file_name: entry.pdfFileName || null, // ✓
  question: entry.question,             // ✓
  answer: entry.answer,                 // ✓
  is_pricing_question: entry.isPricingQuestion || false, // ✓
  error: entry.error || null,           // ✓
}
```

**GET Request liest:**
```typescript
{
  id: row.id,                           // ✓
  sessionId: row.session_id,            // ✓
  companyId: row.company_id,            // ✓
  timestamp: new Date(row.timestamp).getTime(), // ✓
  pdfFileName: row.pdf_file_name,       // ✓
  question: row.question,               // ✓
  answer: row.answer,                   // ✓
  isPricingQuestion: row.is_pricing_question, // ✓
  error: row.error,                     // ✓
}
```

---

## ✅ VERIFICATION - Alles stimmt überein!

**Alle Spalten passen perfekt:**
- ✅ `session_id` ✓
- ✅ `company_id` ✓
- ✅ `timestamp` ✓
- ✅ `pdf_file_name` ✓
- ✅ `question` ✓
- ✅ `answer` ✓
- ✅ `is_pricing_question` ✓
- ✅ `error` ✓

**Hinweise:**
- `id` und `created_at` werden automatisch von Supabase generiert
- API sendet keine `id` beim POST (korrekt)
- API sendet keine `created_at` beim POST (korrekt - wird auto-generiert)

---

## 🔍 Potenzielle Probleme

### Problem 1: RLS (Row Level Security) Policy

Die SQL erstellt eine Policy:
```sql
CREATE POLICY "Allow all operations" ON backlog_entries
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

**Prüfung nötig:**
- Ist RLS aktiviert? → `ALTER TABLE backlog_entries ENABLE ROW LEVEL SECURITY;`
- Existiert die Policy? → Prüfe in Supabase Dashboard

### Problem 2: API Endpunkt

**Frontend sendet an:**
- `${API_URL}` = `https://xxx.vercel.app/api/backlog`

**Vercel API erwartet:**
- POST `/api/backlog` → Speichert in Supabase
- GET `/api/backlog` → Liest aus Supabase

**✓ Korrekt konfiguriert!**

---

## 🧪 Test SQL Query

Falls die Tabelle leer bleibt, teste diese Query in Supabase SQL Editor:

```sql
-- Prüfe ob Tabelle existiert
SELECT * FROM backlog_entries LIMIT 1;

-- Prüfe ob RLS aktiv ist
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'backlog_entries';

-- Prüfe Policies
SELECT * FROM pg_policies 
WHERE tablename = 'backlog_entries';

-- Test Insert (manuell)
INSERT INTO backlog_entries (
  session_id, 
  question, 
  answer, 
  is_pricing_question
) VALUES (
  'test-session-123',
  'Test Frage?',
  'Test Antwort',
  false
);

-- Prüfe ob Insert funktioniert hat
SELECT * FROM backlog_entries WHERE session_id = 'test-session-123';
```

---

## ✅ Ergebnis

**Schritt 3 ist korrekt implementiert!**

Die SQL-Tabelle und der API-Code stimmen überein. Falls die Tabelle leer bleibt, liegt das Problem wahrscheinlich an:

1. **Environment Variables in Vercel nicht gesetzt** → API kann nicht auf Supabase zugreifen
2. **RLS Policy fehlt oder ist falsch** → API kann nicht speichern
3. **Vercel Deployment nicht neu gestartet** → Alte Version ohne Env Vars läuft noch

