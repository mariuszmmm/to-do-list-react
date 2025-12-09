# Quick Start - Google Drive Setup (5 minutes)

## Minimum Setup Required

Aby włączyć Google Drive backup potrzebujesz: **Google Client ID**.

### Krok 1: Utwórz Client ID w Google Cloud Console (2 min)

1. Otwórz https://console.cloud.google.com/
2. Kliknij "Select a Project" → "NEW PROJECT"
3. Wpisz nazwę (np. "todo-backup"), kliknij "CREATE"
4. Czekaj aż projekt będzie gotowy
5. W search bar wpisz "Google Drive API" → kliknij ENABLE
6. Idź do "Credentials" w lewym menu
7. Kliknij "CREATE CREDENTIALS" → "OAuth client ID" → "Web application"
8. W "Authorized redirect URIs" dodaj:
   - `http://localhost:3000/`
9. Kliknij "CREATE"
10. **SKOPIUJ Client ID** (duży ciąg znaków)

### Krok 2: Wklej Client ID do .env (1 min)

**Plik**: `d:\dev\to-do-list-react\.env`

Zmień tę linię:
```env
REACT_APP_GOOGLE_DRIVE_CLIENT_ID=
```

Na:
```env
REACT_APP_GOOGLE_DRIVE_CLIENT_ID=skopiowany_client_id_tutaj
```

### Krok 3: Restart aplikacji (2 min)

```bash
# W terminalu gdzie uruchomiona jest aplikacja:
# Wciśnij Ctrl+C aby wyłączyć serwer
# Potem uruchom ponownie:
npm start
```

### Krok 4: Test

1. Otwórz http://localhost:3000/
2. Zaloguj się na konto admina
3. Idź do Account page
4. Kliknij "Authorize Google Drive"
5. Zaloguj się do Google
6. Przyznaj uprawnienia
7. Powinieneś zobaczyć "Authorization successful"

## Gotowe! 

Teraz możesz:
- ✅ Pobierać backup na komputer
- ✅ Wysyłać backup na Google Drive
- ✅ Przywracać backup z Google Drive

## Jeśli coś nie działa

- **"Brakuje konfiguracji Google Drive"** → .env nie ma Client ID
- **"Failed to authorize"** → Sprawdź czy Client ID jest poprawny
- **Brak odpowiedzi od Google** → Czekaj, czasami Google Drive API potrzebuje chwili

## Deployment na Netlify

Gdy będziesz gotów do deployment:
1. W Google Cloud Console dodaj do redirect URIs: `https://twoja-domena.netlify.app/`
2. W Netlify dashboard dodaj env variables (patrz GOOGLE_DRIVE_SETUP.md)
3. Push do gita
4. Netlify automatycznie zdeployuje
