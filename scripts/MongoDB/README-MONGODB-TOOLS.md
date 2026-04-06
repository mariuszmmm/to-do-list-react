# 🛠️ MongoDB Database Tools - Instrukcja Obsługi

Ten folder zawiera zestaw profesjonalnych narzędzi do zarządzania bazą danych MongoDB Atlas dla projektu To-Do List React. Wszystkie skrypty są przygotowane do bezpiecznej pracy lokalnej na systemie Windows.

> [!CAUTION]
> **OSTRZEŻENIE:** To są narzędzia techniczne przeznaczone wyłącznie do użytku deweloperskiego (lokalnego). Nie są częścią kodu strony na Netlify i nie zadziałają w chmurze (wymagają terminala i zapisu na dysku).

---

## 📋 Dostępne Komendy (`npm run ...`)

Możesz zarządzać swoją bazą za pomocą trzech prostych komend z poziomu głównego katalogu projektu:

### 1. `npm run db:backup` (Ręczna Kopia Zapasowa na Dysk)
Służy do szybkiego wykonania zrzutu obecnej bazy (`MONGODB_URI`) do plików JSON na dysk lokalny.
*   **Kiedy używać:** Przed wprowadzeniem dużych zmian w danych lub profilaktycznie.

### 2. `npm run db:backup:drive` (Kopia Zapasowa na Google Drive) ☁️
Wykonuje pełny zrzut bazy danych i przesyła go jako jeden plik JSON bezpośrednio na Twój Dysk Google.
*   **Kiedy używać:** Gdy chcesz mieć kopię chmurową gotową do przywrócenia jednym kliknięciem na stronie.

### 3. `npm run db:restore` (Przywracanie z Dysku Lokalnego)
Pozwala wybrać jedną z istniejących kopii z folderu `backups/` i wgrać ją do bazy danych.
*   **Kiedy używać:** Gdy masz pobrane pliki JSON na komputerze.

### 4. `npm run db:restore:drive` (Przywracanie z Google Drive) ☁️
Pobiera listę kopii z chmury, pozwala wybrać jedną i przywraca ją bezpośrednio do bazy.
*   **Kiedy używać:** Najszybsza metoda na cofnięcie zmian przy użyciu kopii z Dysku Google.

### 5. `npm run db:migrate` (Migracja na Nowy Klaster)
Kopiuje wszystkie dane ze starej bazy (`MONGODB_URI`) do nowej bazy docelowej (`NEW_MONGODB_URI`).
*   **Kiedy używać:** Przy przenoszeniu projektu na nowe konto MongoDB Atlas.

---

## 🛡️ Mechanizmy Bezpieczeństwa

Skrypty posiadają wbudowane inteligentne zabezpieczenia:
1.  **Auto-.gitignore:** Skrypty automatycznie sprawdzają plik `.gitignore`. Jeśli folder `backups/` nie jest na liście, skrypt sam go dopisze, aby Twoje dane nigdy nie wyciekły na GitHub.
2.  **Wymuszone DNS:** Skrypty wymuszają użycie DNS `1.1.1.1` i `8.8.8.8`, aby linki typu `mongodb+srv://` działały bezbłędnie na Windowsie (rozwiązuje błąd `querySrv ECONNREFUSED`).
3.  **Weryfikacja .env:** Wszystkie dane czytane są bezpośrednio z Twojego głównego pliku `.env`.

---

## 🗂️ Gdzie szukać kopii?

Wszystkie kopie zapasowe trafiają do:
`scripts/MongoDB/backups/`

Pliki są zapisane w czytelnym formacie `.json` (jeden plik na każdą kolekcję w bazie).

---

## 🐛 Rozwiązywanie Problemów

*   **Błąd połączenia:** Upewnij się, że Twój adres IP jest dodany do "Network Access" w panelu MongoDB Atlas.
*   **Błąd zmiennych:** Sprawdź, czy w `.env` masz poprawnie ustawione `MONGODB_URI` oraz `MONGODB_DATABASE`.

---
*Autor: Antigravity AI Assistant*
