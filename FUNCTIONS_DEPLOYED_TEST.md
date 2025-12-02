# ✅ Functions sind deployed - Test-Anleitung

## Status
Die Vercel Functions sind erfolgreich deployed:
- ✅ `/api/backlog` - Backlog API
- ✅ `/api/auth` - Authentication API

## Test-Schritte

### 1. Vercel Deployment URL finden
1. Gehe zu [Vercel Dashboard](https://vercel.com/dashboard)
2. Öffne dein Projekt `trafosanf-remake`
3. Kopiere die **Production URL** (z.B. `https://trafosanf-remake-xxx.vercel.app`)

### 2. API direkt testen (Browser)

#### Test 1: OPTIONS Preflight Request
Öffne die Browser-Konsole auf `https://ki-vergabe.de` und führe aus:

```javascript
fetch('https://DEINE-VERCEL-URL.vercel.app/api/backlog', {
  method: 'OPTIONS',
  headers: {
    'Origin': 'https://ki-vergabe.de'
  }
})
.then(response => {
  console.log('Status:', response.status);
  console.log('CORS Headers:', {
    'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
    'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
    'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
  });
  return response.text();
})
.then(text => console.log('Response:', text))
.catch(error => console.error('Error:', error));
```

**Erwartetes Ergebnis:**
- Status: `200`
- `Access-Control-Allow-Origin`: `https://ki-vergabe.de` oder `*`
- Keine CORS-Fehler in der Konsole

#### Test 2: GET Request
```javascript
fetch('https://DEINE-VERCEL-URL.vercel.app/api/backlog')
.then(response => {
  console.log('Status:', response.status);
  return response.json();
})
.then(data => console.log('Backlog entries:', data))
.catch(error => console.error('Error:', error));
```

**Erwartetes Ergebnis:**
- Status: `200`
- JSON-Response mit `{ entries: [...] }`
- Keine CORS-Fehler

#### Test 3: POST Request
```javascript
fetch('https://DEINE-VERCEL-URL.vercel.app/api/backlog', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    sessionId: 'test-session-123',
    question: 'Test Frage',
    answer: 'Test Antwort',
    isPricingQuestion: false
  })
})
.then(response => {
  console.log('Status:', response.status);
  return response.json();
})
.then(data => console.log('Saved entry:', data))
.catch(error => console.error('Error:', error));
```

**Erwartetes Ergebnis:**
- Status: `201` (Created)
- JSON-Response mit `{ success: true, entry: {...} }`
- Keine CORS-Fehler

### 3. GitHub Secret prüfen

Stelle sicher, dass `VITE_BACKLOG_API_URL` korrekt gesetzt ist:

1. Gehe zu GitHub Repository → Settings → Secrets and variables → Actions
2. Prüfe ob `VITE_BACKLOG_API_URL` existiert
3. Wert sollte sein: `https://DEINE-VERCEL-URL.vercel.app/api/backlog`

**Wichtig:** Die URL muss mit `/api/backlog` enden!

### 4. In der Anwendung testen

1. Öffne `https://ki-vergabe.de`
2. Öffne die Browser-Konsole (F12)
3. Stelle eine Frage im Chat
4. Prüfe die Konsole auf:
   - ✅ `Saving to database via API: https://...`
   - ✅ `Successfully saved backlog entry to database`
   - ❌ KEINE CORS-Fehler

### 5. Vercel Logs prüfen

1. Gehe zu Vercel Dashboard → Deployments
2. Klicke auf das neueste Deployment
3. Gehe zu "Functions" Tab
4. Klicke auf `/api/backlog`
5. Prüfe die Logs auf:
   - `=== CORS DEBUG ===`
   - `Request method: OPTIONS` oder `Request method: POST`
   - `Origin header: https://ki-vergabe.de`
   - `Allowed origin: https://ki-vergabe.de`

## Häufige Probleme

### Problem: CORS-Fehler bleibt bestehen
**Lösung:**
1. Prüfe ob die Vercel URL in `VITE_BACKLOG_API_URL` korrekt ist
2. Stelle sicher, dass ein neuer Build mit der korrekten URL erstellt wurde
3. Prüfe Vercel Logs auf Fehler
4. Hard Refresh im Browser (Ctrl+Shift+R / Cmd+Shift+R)

### Problem: "Backlog API URL not configured"
**Lösung:**
1. Prüfe GitHub Secret `VITE_BACKLOG_API_URL`
2. Stelle sicher, dass ein neuer Build nach dem Setzen des Secrets erstellt wurde
3. Prüfe `.github/workflows/deploy.yml` - sollte `VITE_BACKLOG_API_URL` enthalten

### Problem: 401 Unauthorized
**Lösung:**
1. Prüfe Vercel Environment Variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_TABLE` (optional, default: `backlog_entries`)

## Erfolgreiche Tests

Wenn alle Tests erfolgreich sind:
- ✅ OPTIONS Request gibt 200 zurück
- ✅ GET Request gibt Backlog-Einträge zurück
- ✅ POST Request speichert erfolgreich
- ✅ Keine CORS-Fehler in der Browser-Konsole
- ✅ Vercel Logs zeigen erfolgreiche Requests

## Nächste Schritte

Wenn alles funktioniert:
1. Teste die komplette Chat-Funktionalität
2. Prüfe ob Einträge in Supabase gespeichert werden
3. Teste die Admin-Seite zum Anzeigen des Backlogs

