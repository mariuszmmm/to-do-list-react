# 🔐 Bitwarden & Netlify Sync - Instrukcja

Ten projekt używa narzędzia **Bitwarden Secrets Manager CLI (`bws`)** oraz **Netlify CLI** do bezpiecznej synchronizacji zmiennych środowiskowych między chmurą Bitwardena a projektem Netlify i lokalnym środowiskiem deweloperskim.

> [!IMPORTANT]
> **TO JEST NARZĘDZIE LOKALNE:** Ten skrypt służy wyłącznie do przygotowywania Twojego komputera (Windows) i panelu Netlify przed publikacją. Nie jest on częścią funkcjonalności Twojej strony internetowej. Nie zadziała po wysłaniu na serwery Netlify, ponieważ wymaga on środowiska Windows i interaktywnego terminala.

---

## 📋 Dostępne Komendy (`npm run ...`)

Zarządzaj swoją zsynchronizowaną bazą zmiennych środowiskowych z poziomu głównego katalogu projektu:

### 1. `npm run secrets:sync` (Pobieranie Pełnej Konfiguracji z Bitwardena)
Jedna komenda pobiera najświeższe sekrety z obu środowisk (produkcji i lokalnego) i odtwarza uporządkowane pliki: `.env`, `.env.local` oraz szkieletowy `.env.example`. Na końcu ułatwia natychmiastowe wysłanie nowej wersji na platformę Netlify.
*   **Kiedy używać:** Zawsze gdy zaczynasz kodować na nowym komputerze, współpracujesz na nowym dysku lub jeśli ręcznie edytowałeś stany sekretów w panelu przeglądarki Bitwardena.

### 2. `npm run secrets:push` (Wysyłanie Zmian ze Skryptów do Bitwardena)
Skanuje fizyczny plik `.env` (lub `.env.local`) wyłuskując nie tylko zaktualizowane wartości kluczy, ale również przepina i odczytuje mądrze odrębne "notatki" umieszczone za pomocą znaku '#'. Porównuje je na bieżąco z chmurą i interaktywnie uzgadnia co wysłać.
*   **Kiedy używać:** Idealne po tym, gdy w szale pisania kodu utworzysz lokalnie 5 nowych bramek w `.env`. Komenda zabezpieczy te pliki wrzucając stan bezpośrednio w szyfrowaną otchłań konta.

### 3. `npm run secrets:netlify` (Błyskawiczny, Celowy Import do Netlify)
Narzędzie eksportujące środowisko do Netlify, omijające skrupulatny Bitwarden. Uzupełnione o ochronny wstrzykiwacz cudzysłowów na trudnych urlach typu Router Hash.
*   **Kiedy używać:** Gdy na próbę chcesz dorzucić tylko jedną opcję konfiguracyjną i nie chcesz odpalać do tego procedury całego skanera (z punktu 1).

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

_(Otworzy się przeglądarka – kliknij „Authorize". Po zalogowaniu wróć do terminala.)_

### KROK 5: Pobierz Bitwarden CLI (`bws.exe`)

1. Wejdź na: [https://github.com/bitwarden/sdk/releases](https://github.com/bitwarden/sdk/releases)
2. Pobierz plik: **`bws-x86_64-pc-windows-msvc-x.x.x.zip`**
3. Wypakuj archiwum i skopiuj plik **`bws.exe`** do folderu: `scripts/Bitwarden/`

   _(Plik ten jest ignorowany przez Git – musisz go pobrać ręcznie na każdą nową maszynę.)_

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
_(System Windows musi „odczytać" nowo ustawioną zmienną środowiskową.)_

### KROK 9: Uruchom synchronizację

```bash
npm run secrets:sync
```

Skrypt automatycznie wypełni pliki `.env`, `.env.local` i `.env.example`.  
Na końcu zapyta, czy wysłać dane do Netlify – wpisz `T` (tak) lub `N` (nie).

---



## 🗂️ Struktura plików

| Plik               | Lokalizacja          | Opis                                            |
| ------------------ | -------------------- | ----------------------------------------------- |
| `bws.exe`          | `scripts/Bitwarden/` | Bitwarden CLI (pobierz ręcznie, nie jest w Git) |
| `sync-secrets.ps1` | `scripts/Bitwarden/` | Skrypt pobierania (Bitwarden -> .env)           |
| `push-secrets.ps1` | `scripts/Bitwarden/` | Skrypt wysyłania (.env -> Bitwarden)            |
| `.env`             | katalog główny       | Zmienne produkcyjne z Bitwardena (nie w Git!)   |
| `.env.local`       | katalog główny       | Zmienne lokalne z Bitwardena (nie w Git!)       |
| `.env.example`     | katalog główny       | Wzorzec z samymi nazwami kluczy (jest w Git)    |

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

_Autor: Antigravity AI Assistant_
