# SSL-Zertifikat Problem - "bad_authz"

## Problem gefunden:

Das SSL-Zertifikat hat den Status **"bad_authz"** - das bedeutet:
- Die ACME-Autorisierung ist fehlgeschlagen
- GitHub kann das SSL-Zertifikat nicht ausstellen
- Wahrscheinlich DNS-Problem

---

## Lösung: DNS-Einstellungen prüfen

### Schritt 1: Prüfe DNS-Records in GoDaddy

**Gehe zu:** GoDaddy DNS-Verwaltung für `ki-vergabe.de`

**Prüfe ob diese Records existieren:**

**A Records (IPv4):**
- `@` → `185.199.108.153`
- `@` → `185.199.109.153`
- `@` → `185.199.110.153`
- `@` → `185.199.111.153`

**CNAME Record:**
- `www` → `9qdbds6xqc-png.github.io`

**Falls fehlen oder falsch:**
- Füge/korrigiere die Records
- Warte auf DNS-Propagierung (kann bis zu 48h dauern)

---

### Schritt 2: Prüfe ob Domain richtig aufgelöst wird

**Test-Command:**
```bash
dig ki-vergabe.de +short
```

**Erwartete Antwort:**
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**Falls andere IPs:**
- DNS-Records sind falsch
- Korrigiere sie in GoDaddy

---

### Schritt 3: Domain in GitHub Pages neu verifizieren

**Nach DNS-Korrektur:**

1. **Gehe zu:** https://github.com/9qdbds6xqc-png/trafosanf-remake/settings/pages
2. **Entferne** die Custom Domain temporär
3. **Warte** 1 Minute
4. **Füge** die Domain wieder hinzu: `ki-vergabe.de`
5. **Warte** 5-10 Minuten
6. GitHub wird versuchen, SSL-Zertifikat neu auszustellen

---

## Temporäre Lösung: HTTPS trotzdem verwenden

**Auch wenn SSL-Zertifikat fehlt:**
- Du kannst trotzdem **https://ki-vergabe.de** verwenden
- Browser zeigt Warnung, aber funktioniert
- CORS sollte trotzdem funktionieren

**Test:**
- Öffne: https://ki-vergabe.de
- Klicke "Advanced" → "Proceed to ki-vergabe.de"
- Teste CORS

---

## Zusammenfassung:

| Item | Status |
|------|--------|
| SSL-Zertifikat Status | ❌ "bad_authz" (fehlgeschlagen) |
| HTTPS aktiviert | ⚠️ Versucht |
| DNS-Records korrekt? | ⚠️ Prüfe |
| Domain verifiziert? | ⚠️ Prüfe |

---

## Nächste Schritte:

1. **Prüfe DNS-Records** in GoDaddy
2. **Korrigiere** falls nötig
3. **Warte** auf DNS-Propagierung
4. **Entferne und füge Domain neu hinzu** in GitHub Pages
5. **Warte** auf SSL-Zertifikat (kann bis zu 24h dauern)

**Oder:** Verwende https:// trotz Warnung - CORS sollte trotzdem funktionieren!

