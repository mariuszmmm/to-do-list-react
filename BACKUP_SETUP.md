# Google Drive Backup & Restore - Konfiguracja

## Wymagane zmienne środowiskowe

### Frontend (.env.local lub Netlify UI)

```env
REACT_APP_GOOGLE_DRIVE_CLIENT_ID=YOUR_CLIENT_ID_HERE
REACT_APP_GOOGLE_DRIVE_REDIRECT_URI=https://yourdomain.com/auth/google/callback
```

### Backend (Netlify Functions)

Na Netlify dodaj następujące zmienne w ustawieniach projektu:

```env
MONGODB_URI=your_mongodb_uri
MONGODB_DATABASE=your_database_name
GOOGLE_DRIVE_CLIENT_ID=YOUR_CLIENT_ID_HERE
GOOGLE_DRIVE_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
GOOGLE_DRIVE_REDIRECT_URI=https://yourdomain.com/auth/google/callback
```

## Setup Google OAuth 2.0

### 1. Utwórz projekt w Google Cloud Console

1. Przejdź na https://console.cloud.google.com/
2. Zaloguj się na swoje konto Google
3. Kliknij "Select a Project" → "NEW PROJECT"
4. Podaj nazwę projektu (np. "To-Do List Backup")
5. Kliknij "CREATE"

### 2. Włącz Google Drive API

1. W Google Cloud Console przejdź do "APIs & Services" → "Library"
2. Wyszukaj "Google Drive API"
3. Kliknij na wynik i kliknij "ENABLE"

### 3. Utwórz OAuth 2.0 Credentials

1. Przejdź do "APIs & Services" → "Credentials"
2. Kliknij "CREATE CREDENTIALS" → "OAuth client ID"
3. Jeśli pojawi się dialog o consent screen:
   - Kliknij "CONFIGURE CONSENT SCREEN"
   - Wybierz "External" (dla testów)
   - Wypełnij wymagane pola:
     - App name: "To-Do List"
     - User support email: Twój email
     - Developer contact: Twój email
   - Pomiń pozostałe kroki i kliknij "SAVE AND CONTINUE" → "SAVE AND CONTINUE" → "BACK TO DASHBOARD"

4. Wróć do Credentials, kliknij "CREATE CREDENTIALS" → "OAuth client ID"
5. Wybierz "Web application"
6. Dodaj do "Authorized redirect URIs":
   - `http://localhost:3000/auth/google/callback` (dla dev)
   - `https://yourdomain.com/auth/google/callback` (dla produkcji)
7. Kliknij "CREATE"
8. Skopiuj Client ID i Client Secret

### 4. Dodaj zmienne do Netlify

1. W dashboard Netlify przejdź do Site settings → Build & deploy → Environment
2. Dodaj zmienne:
   - `GOOGLE_DRIVE_CLIENT_ID` = Skopiowany Client ID
   - `GOOGLE_DRIVE_CLIENT_SECRET` = Skopiowany Client Secret
   - `GOOGLE_DRIVE_REDIRECT_URI` = `https://yourdomain.com/auth/google/callback`

3. W projekcie .env.local dodaj zmienne frontend:
   ```env
   REACT_APP_GOOGLE_DRIVE_CLIENT_ID=Skopiowany_Client_ID
   REACT_APP_GOOGLE_DRIVE_REDIRECT_URI=https://yourdomain.com/auth/google/callback
   ```

## Jak działa flow

### Pobieranie backupu na dysk lokalny

1. Admin klika przycisk "Download Backup"
2. Aplikacja pobiera dane z `/backupData`
3. Dane są zapisywane jako plik JSON na dysk

### Wysyłanie backupu na Google Drive

1. Admin klika "Authorize Google" jeśli nie jest zalogowany
2. Zostaje przekierowany na Google login
3. Po zalogowaniu, aplikacja pobiera dane z `/backupData`
4. Dane są wysyłane na Google Drive poprzez `/backup-uploadAllUsersToGoogleDrive`
5. Backup jest zapisywany w Google Drive usera

### Przywracanie z Google Drive

1. Admin musi być zalogowany (krok 1-2 powyżej)
2. Admin klika "Restore from Google Drive"
3. Podaje File ID backupu (do implementacji: file picker)
4. System pobiera plik z Google Drive i przywraca dane w MongoDB
5. Aplikacja przeładowuje się, aby odzwierciedlić zmienne dane

## Funkcje Netlify

### /backupData (GET)
- **Wymaga**: Authorization header
- **Zwraca**: Backup JSON z wszystkimi listami i zadaniami
- **Czy dostępne**: Dla zalogowanych użytkowników

### /backup-uploadAllUsersToGoogleDrive (POST)
- **Wymaga**: Authorization header + backupData + accessToken
- **Zwraca**: File ID i nazwę pliku na Google Drive
- **Czy dostępne**: Dla zalogowanych użytkowników z Google auth

### /backup-restoreBackupFromGoogleDrive (POST)
- **Wymaga**: Authorization header + fileId + accessToken
- **Zwraca**: Liczba przywróconych list
- **Czy dostępne**: Dla zalogowanych użytkowników z Google auth

## Bezpieczeństwo

⚠️ **UWAGA**: Obecna implementacja przechowuje access token po stronie klienta w localStorage.

Dla produkcji rekomenduje się:
- Przechowywanie refresh token na serwerze
- Wymiana kodu OAuth na token backend (nie frontend)
- Dodanie dodatkowych walidacji autoryzacji
- Szyfrowanie wrażliwych danych

## Troubleshooting

**Problem**: "Missing Google Drive configuration"
- **Rozwiązanie**: Sprawdź czy zmienne `REACT_APP_GOOGLE_DRIVE_CLIENT_ID` i `REACT_APP_GOOGLE_DRIVE_REDIRECT_URI` są ustawione w .env.local

**Problem**: "Redirect URI mismatch"
- **Rozwiązanie**: Upewnij się że URI w Google Console dokładnie odpowiada `REACT_APP_GOOGLE_DRIVE_REDIRECT_URI`

**Problem**: 401 Unauthorized przy uploading
- **Rozwiązanie**: Access token może być wygasły. Spróbuj ponownie zalogować się do Google.

## Przyszłe ulepszenia

- [ ] File picker w Google Drive zamiast wpisywania File ID
- [ ] Lista dostępnych backupów w Google Drive
- [ ] Automatyczne backupy
- [ ] Planowanie backupów (codziennie, co tydzień, itp.)
- [ ] Szyfrowanie backupów
- [ ] Przywracanie selektywne (wybór których list przywrócić)
- [ ] Backend token management (nie localStorage)
