# CNAME Record - Erklärung Schritt für Schritt

## Was ist ein CNAME Record?

**CNAME** = "Canonical Name" (kanonischer Name)

**Einfach erklärt:**
- Ein CNAME Record ist wie ein **Alias** oder **Weiterleitung**
- Er sagt: "Wenn jemand nach `www.ki-vergabe.de` fragt, zeige auf `9qdbds6xqc-png.github.io`"
- Es ist eine **Namens-Weiterleitung**, keine IP-Adresse

---

## Warum brauchst du einen CNAME Record?

### Für `www.ki-vergabe.de`:

**Ohne CNAME:**
- `www.ki-vergabe.de` → funktioniert nicht
- Nur `ki-vergabe.de` funktioniert

**Mit CNAME:**
- `www.ki-vergabe.de` → zeigt auf GitHub Pages
- `ki-vergabe.de` → zeigt auch auf GitHub Pages
- Beide funktionieren!

---

## Was ist der Unterschied zu A Records?

### A Records:
- Zeigen direkt auf **IP-Adressen** (z.B. `185.199.108.153`)
- Werden für die **Hauptdomain** verwendet (`ki-vergabe.de`)

### CNAME Records:
- Zeigen auf einen **anderen Domain-Namen** (z.B. `9qdbds6xqc-png.github.io`)
- Werden für **Subdomains** verwendet (`www.ki-vergabe.de`)

---

## Wie richtest du einen CNAME Record in GoDaddy ein?

### Schritt-für-Schritt:

1. **Logge dich ein bei GoDaddy:**
   - Gehe zu: https://www.godaddy.com
   - Logge dich ein

2. **Gehe zu DNS-Verwaltung:**
   - Klicke auf "Meine Produkte"
   - Finde `ki-vergabe.de`
   - Klicke auf "DNS verwalten" oder "DNS"

3. **Füge CNAME Record hinzu:**
   - Scrolle zu "Records" (Einträge)
   - Klicke "Hinzufügen" oder "Add"
   - Wähle Typ: **CNAME**

4. **Fülle aus:**
   - **Name/Host:** `www`
     - Wichtig: Nur `www` eingeben, NICHT `www.ki-vergabe.de`
   - **Wert/Points to:** `9qdbds6xqc-png.github.io`
     - Das ist deine GitHub Pages URL
   - **TTL:** `600` (oder Standard)

5. **Speichere:**
   - Klicke "Speichern" oder "Save"
   - Warte 5-10 Minuten auf DNS-Propagierung

---

## Beispiel-Bildschirm in GoDaddy:

```
Typ:     CNAME
Name:    www
Wert:    9qdbds6xqc-png.github.io
TTL:     600 Sekunden
```

---

## Prüfe ob CNAME Record funktioniert:

### Test-Command (falls Terminal verfügbar):
```bash
dig www.ki-vergabe.de CNAME +short
```

**Erwartete Antwort:**
```
9qdbds6xqc-png.github.io.
```

### Oder im Browser:
- Öffne: `http://www.ki-vergabe.de`
- Sollte auf deine GitHub Pages Website zeigen

---

## Zusammenfassung deiner DNS-Records:

### Für `ki-vergabe.de` (Hauptdomain):
**A Records:**
- `@` → `185.199.108.153`
- `@` → `185.199.109.153`
- `@` → `185.199.110.153`
- `@` → `185.199.111.153`

### Für `www.ki-vergabe.de` (Subdomain):
**CNAME Record:**
- `www` → `9qdbds6xqc-png.github.io`

---

## Wichtige Hinweise:

1. **CNAME und A Record können NICHT gleichzeitig für die gleiche Domain existieren**
   - `ki-vergabe.de` → A Records ✅
   - `www.ki-vergabe.de` → CNAME Record ✅
   - Das ist korrekt!

2. **TTL (Time To Live):**
   - Wie lange DNS-Änderungen gecacht werden
   - `600` = 10 Minuten (gut für Tests)
   - `3600` = 1 Stunde (Standard)

3. **DNS-Propagierung:**
   - Änderungen brauchen Zeit zum Verbreiten
   - Kann 5 Minuten bis 48 Stunden dauern
   - Meistens aber innerhalb von 1 Stunde

---

## Falls du Probleme hast:

### Problem: "CNAME Record existiert bereits"
- Prüfe ob bereits ein CNAME für `www` existiert
- Falls ja: Bearbeite den bestehenden Record
- Falls falsch: Lösche und erstelle neu

### Problem: "CNAME funktioniert nicht"
- Prüfe ob Wert korrekt ist: `9qdbds6xqc-png.github.io`
- Prüfe ob Name nur `www` ist (nicht `www.ki-vergabe.de`)
- Warte auf DNS-Propagierung (kann bis zu 1 Stunde dauern)

---

## Nächste Schritte:

1. **Gehe zu GoDaddy DNS-Verwaltung**
2. **Prüfe ob CNAME Record für `www` existiert**
3. **Falls nicht:** Füge ihn hinzu (siehe oben)
4. **Falls falsch:** Korrigiere ihn
5. **Warte** auf DNS-Propagierung
6. **Teste:** `http://www.ki-vergabe.de`

**Sag mir, ob du den CNAME Record finden oder hinzufügen konntest!**

