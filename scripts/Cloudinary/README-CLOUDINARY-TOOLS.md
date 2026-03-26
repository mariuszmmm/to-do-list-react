# Cloudinary Backup & Restore Tools

Zestaw narzędzi do wykonywania pełnych kopii zapasowych oraz przywracania danych z Cloudinary, z pełnym wsparciem dla folderów („Asset Folders”).

## Główne Skrypty

### 1. Backup Lokalny (`backup-cloudinary.js`)
Pobiera wszystkie zasoby z Twojego konta Cloudinary i zapisuje je lokalnie.

**Uruchomienie:**
```powershell
npm run cdn:backup
```

**Kluczowe funkcje:**
- **Pełna rekurencja**: Skanuje wszystkie foldery i podfoldery na koncie.
- **Wszystkie typy**: Pobiera obrazy (image), wideo (video) oraz pliki surowe (raw).
- **Struktura katalogów**: Odtwarza strukturę folderów Cloudinary lokalnie w folderze `backups`.
- **Sanityzacja nazw**: Automatycznie poprawia nazwy folderów dla zgodności z systemem Windows (np. zamienia `"` na `_`).
- **Metadane**: Tworzy plik `metadata.json` z kompletnymi informacjami do odtworzenia konta (Asset Folders, Public IDs).

---

### 2. Backup do Google Drive (`backup-cloudinary-google-drive.js`) ☁️
Tworzy archiwum ZIP wszystkich zasobów Cloudinary i przesyła je bezpośrednio na Dysk Google.

**Uruchomienie:**
```powershell
npm run cdn:backup:drive
```

**Kluczowe funkcje:**
- **Jeden plik ZIP**: Cała zawartość Cloudinary (obrazy, wideo, raw) + `metadata.json` spakowana w jednym archiwum.
- **Bezpośrednia wysyłka**: Wykorzystuje `resumable upload` dla stabilności przy większych plikach.
- **Lokalizacja**: Pliki trafiają do folderu `To-do-list_Backups / Cloudinary-Backups` na Dysku Google.
- **Automatyka**: Pobiera tokeny autoryzacyjne bezpośrednio z Twojej bazy MongoDB (sama autoryzacja odbywa się w interfejsie aplikacji).

---

### 3. Restore Lokalny (`restore-cloudinary.js`)
Wysyła pliki z wybranego backupu z powrotem na Cloudinary.

**Uruchomienie (najnowszy backup):**
```powershell
npm run cdn:restore
```

---

### 4. Restore z Google Drive (`restore-cloudinary-google-drive.js`) ☁️
Pobiera ZIPa z Dysku Google, rozpakowuje go i przesyła pliki na Cloudinary.

**Uruchomienie:**
```powershell
npm run cdn:restore:drive
```

**Kluczowe funkcje:**
- **Pobieranie w locie**: Pobiera wybrane archiwum ZIP bezpośrednio do tymczasowego folderu.
- **Interaktywne wybieranie**: Skanuje folder `Cloudinary-Backups` na Dysku Google i pozwala na wybór konkretnej kopii do przywrócenia.
- **Odtwarzanie struktury**: Zachowuje oryginalne `Asset Folders` i metadane pliku.
- **Automatyczne sprzątanie**: Po zakończeniu procesu usuwa pobrany plik ZIP oraz rozpakowaną zawartość.

---

**Uruchomienie (konkretny backup):**
```powershell
node scripts/Cloudinary/restore-cloudinary.js nazwa_folderu_z_backupem
```

**Kluczowe funkcje:**
- **Odtwarzanie struktury**: Dzięki metadanym pliki trafiają do swoich oryginalnych "Asset Folders", nawet jeśli `public_id` nie zawierało ścieżki.
- **Nadpisywanie**: Skrypt używa `overwrite: true`, więc zaktualizuje pliki o tych samych identyfikatorach.
- **Invalidacja cache**: Automatycznie czyści cache CDN (`invalidate: true`), aby nowe wersje były widoczne od razu.

---

## Konfiguracja

Skrypty korzystają z pliku `.env` w głównym katalogu projektu. Wymagane są następujące klucze:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

---

## Przechowywanie danych

Kopie zapasowe są zapisywane w:
`scripts/Cloudinary/backups/cloudinary_backup_[ISO-DATE]/`

Folder `backups/` jest dodany do `.gitignore`, aby uniknąć przesyłania dużych plików mediów do repozytorium.
