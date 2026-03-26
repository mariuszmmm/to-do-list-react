# 🛠️ Development & Debugging Tools

Ten folder zawiera dodatkowe narzędzia wspierające rozwój aplikacji locally.

## Narzędzia

### 1. Cron Simulator (`simulate-cron.js`)
Skrypt symulujący mechanizm Cron działający w chmurze Netlify. Pozwala na testowanie powiadomień i innych funkcji czasowych w środowisku lokalnym.

**Działanie:**
- Uderza w lokalną funkcję Netlify `notification-cron` co 60 sekund.
- Pozwala sprawdzić, czy mechanizm rozsyłania powiadomień Push oraz E-mail działa poprawnie przed wdrożeniem na produkcję.

**Uruchomienie:**
```bash
npm run simulate-cron
```

---
*Autor: Antigravity AI Assistant*
