# Cloudinary Backup & Restore Tools

Zestaw narzędzi do wykonywania pełnych kopii zapasowych oraz przywracania danych z Cloudinary, z pełnym wsparciem dla folderów („Asset Folders”).

## 📋 Dostępne Komendy (`npm run ...`)

Możesz zarządzać swoimi zarchiwizowanymi obrazami z poziomu głównego katalogu na 4 proste sposoby:

### 1. `npm run cdn:backup` (Ręczna Kopia Zapasowa na Dysk)
Pobiera wszystkie grafiki i zasoby RAW przypięte do Twojego konta Cloudinary i skrupulatnie odtwarza struktury hierarchiczne (foldery) na lokalnym dysku SSD. Posiada mechanizm na wypadek podwójnych nazw z Windowsa.
*   **Kiedy używać:** Jak w banku — profilaktycznie do testowania lub przed głębszą zmianą ułożenia bazy w sieci.
*   **Kluczowe cechy:** Skanuje rekurencyjnie podfoldery wideo i RAW, zamykając konfigurację logistyczną potężnym zrzutem spoiwa `metadata.json`, który zabezpieczy tyły przy imporcie.

### 2. `npm run cdn:backup:drive` (Kopia Zapasowa na Google Drive) ☁️
Przeprowadza bezobsługowy proces pełnego archiwum mediacyjnego Cloudinary bezpośrednio zamykając pliki w ZIPie — wyprowadzonym od razu połączonym skryplem typu `resumable upload` u Ciebie na dysku w chmurze Google.
*   **Kiedy używać:** Bezpieczniejsza i "chmurowa" odnoga zwykłego zapisu (z komendy nr 1). Dysk nie ulega mechanicznym uszkodzeniom. 

### 3. `npm run cdn:restore` (Przywracanie z Dysku Lokalnego)
Wypycha paczkę testową potężnych rezerw bezpośrednio z wewnątrz Twojego peceta instalując to natywnie z ukształtowaną metadaną.
*   **Kiedy używać:** Jeśli przypadkiem pominąłeś parę kluczowych zrzutów oznaczając je jako śmietnik - wpychanie ratuje logikę nadpisania nadpisując klucze i unieważniając ich stare obrazy (`invalidate: true`).
*(Pojedynczy backup o wybranej dacie wymuszasz podając w konsoli np.: `node scripts/Cloudinary/restore-cloudinary.js NAZWA_FOLDERU`)*

### 4. `npm run cdn:restore:drive` (Przywracanie z Google Drive) ☁️
Interaktywny system odtwarzania. Pokazuje w terminalu tabelkę dostępnych archiwizacji uwięzionych na zapleczu konta Dysku Google. Na Twoje żądanie zaciąga ten konkretny ładunek do siebie na wirtualny pulpit temp. Rozkleja strukture media i instaluje idealnie w miejsce chmury Cloudinary. Autoczyszczenie po skończonym wgrywaniu dba o zachowanie zasobów sprzętu.
*   **Kiedy używać:** Sposób ewakuacji z opcją zera limitu bez naruszania struktury folderów na maszynie.

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
