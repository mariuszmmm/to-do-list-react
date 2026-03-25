# 🔐 Bitwarden & Netlify Sync - Instrukcja

Ten projekt używa narzędzia **Bitwarden Secrets Manager CLI (`bws`)** oraz **Netlify CLI** do bezpiecznej synchronizacji zmiennych środowiskowych między chmurą Bitwardena a projektem Netlify i lokalnym środowiskiem deweloperskim.

> [!IMPORTANT]
> **TO JEST NARZĘDZIE LOKALNE:** Ten skrypt służy wyłącznie do przygotowywania Twojego komputera (Windows) i panelu Netlify przed publikacją. Nie jest on częścią funkcjonalności Twojej strony internetowej. Nie zadziała po wysłaniu na serwery Netlify, ponieważ wymaga on środowiska Windows i interaktywnego terminala.

---

## 📋 Co robi `npm run secrets:sync`?

Jedna komenda wykonuje trzy rzeczy automatycznie:
1. Pobiera wszystkie sekrety z **dwóch projektów** w Bitwarden Secrets Manager.
2. Zapisuje je do odpowiednich plików:
   - Projekt **`to-do-list-react`** → plik **`.env`** (produkcja / Netlify)
   - Projekt **`to-do-list-react-local`** → plik **`.env.local`** (lokalny deweloperski)
   - Oba projekty → plik **`.env.example`** (wzorzec z samymi nazwami kluczy, bez haseł)
3. Pyta, czy wgrać zmienne do **Netlify** (wpisz `T` lub `N`).

---

## 🖥️ Konfiguracja na nowym komputerze (krok po kroku)

### KROK 1: Sklonuj repozytorium
```bash
git clone https://github.com/TWOJ_LOGIN/to-do-list-react.git
cd to-do-list-react
```

### KROK 2: Zainstaluj zależności projektu
```bash
npm install
```

### KROK 3: Zainstaluj Netlify CLI (globalnie)
```bash
npm install -g netlify-cli
```

### KROK 4: Zaloguj się do Netlify
```bash
netlify login
```
*(Otworzy się przeglądarka – kliknij „Authorize". Po zalogowaniu wróć do terminala.)*

### KROK 5: Pobierz Bitwarden CLI (`bws.exe`)
1. Wejdź na: [https://github.com/bitwarden/sdk/releases](https://github.com/bitwarden/sdk/releases)
2. Pobierz plik: **`bws-x86_64-pc-windows-msvc-x.x.x.zip`**
3. Wypakuj archiwum i skopiuj plik **`bws.exe`** do folderu: `scripts/Bitwarden/`

   *(Plik ten jest ignorowany przez Git – musisz go pobrać ręcznie na każdą nową maszynę.)*

### KROK 6: Uzyskaj Access Token z Bitwardena
1. Zaloguj się na: [https://vault.bitwarden.eu](https://vault.bitwarden.eu)
2. Wejdź w: **Secrets Manager** → **Machine Accounts**
3. Wybierz konto **`to-do-list`** i przejdź do zakładki **Access Tokens**
4. Kliknij **„New access token"** i skopiuj wygenerowany klucz (zaczyna się od `0.`)

### KROK 7: Zapisz token w systemie Windows (jednorazowo)
Wklej poniższą komendę w terminalu PowerShell, zastępując `TUTAJ_WKLEJ_TOKEN` swoim kluczem:
```powershell
[System.Environment]::SetEnvironmentVariable("BWS_ACCESS_TOKEN", "TUTAJ_WKLEJ_TOKEN", "User")
```
> **WAŻNE:** Słowo `"User"` na końcu zostaw bez zmian – to parametr systemowy.

### KROK 8: Zrestartuj terminal
Zamknij okno terminala w VS Code i otwórz je ponownie.  
*(System Windows musi „odczytać" nowo ustawioną zmienną środowiskową.)*

### KROK 9: Uruchom synchronizację
```bash
npm run secrets:sync
```
Skrypt automatycznie wypełni pliki `.env`, `.env.local` i `.env.example`.  
Na końcu zapyta, czy wysłać dane do Netlify – wpisz `T` (tak) lub `N` (nie).

---

## 🔄 Regularna synchronizacja (gdy coś zmieniasz w Bitwardenie)

Kiedykolwiek dodasz lub zmienisz sekret w Bitwardenie, wystarczy wpisać:
```bash
npm run secrets:sync
```

---

## ⬆️ Wysyłanie zmian do Bitwardena (gdy coś zmieniasz lokalnie)

Jeśli zmieniłeś wartość w pliku `.env` lub `.env.local` i chcesz zaktualizować Bitwarden:
```bash
npm run secrets:push
```
Skrypt zapyta, który plik wysłać (`.env` lub `.env.local`), porówna wartości z Bitwardenem i:
- **Zaktualizuje** klucze, których wartości się zmieniły.
- **Zapyta**, czy dodać nowe klucze, których jeszcze nie ma w Bitwardenie.
- **Pominie** klucze bez zmian.

---

## 🗂️ Struktura plików

| Plik | Lokalizacja | Opis |
|------|------------|------|
| `bws.exe` | `scripts/Bitwarden/` | Bitwarden CLI (pobierz ręcznie, nie jest w Git) |
| `sync-secrets.ps1` | `scripts/Bitwarden/` | Skrypt pobierania (Bitwarden -> .env) |
| `push-secrets.ps1` | `scripts/Bitwarden/` | Skrypt wysyłania (.env -> Bitwarden) |
| `.env` | katalog główny | Zmienne produkcyjne z Bitwardena (nie w Git!) |
| `.env.local` | katalog główny | Zmienne lokalne z Bitwardena (nie w Git!) |
| `.env.example` | katalog główny | Wzorzec z samymi nazwami kluczy (jest w Git) |

---

## 🐛 Rozwiązywanie problemów

**Błąd: `Nie wykryto zmiennej environment: BWS_ACCESS_TOKEN`**
→ Wróć do KROKU 7 i upewnij się, że po wpisaniu komendy **zrestartowałeś terminal** (KROK 8).

**Błąd: `522` lub `404` przy połączeniu z Bitwardenem**
→ Skrypt jest skonfigurowany dla regionu EU (`vault.bitwarden.eu`). Jeśli Twoje konto jest na `vault.bitwarden.com`, zmień URL w skrypcie `sync-secrets.ps1`.

**Sprawdzenie, czy token jest poprawnie ustawiony:**
```powershell
echo $env:BWS_ACCESS_TOKEN
```

**Usunięcie tokena z systemu (reset):**
```powershell
[System.Environment]::SetEnvironmentVariable("BWS_ACCESS_TOKEN", $null, "User")
```

---
*Autor: Antigravity AI Assistant*
