# Konfiguracja PWA i Zasoby (Icons)

## Manifest PWA (`public/manifest.json`)

- **Kolorystyka**:
  - `theme_color`: `#359b09`
  - `background_color`: `#359b09`
- **Ikony**:
  - Ustawione na `purpose: "any maskable"`.
  - Rozmiar standardowy: `512x512`.

## Ikony Aplikacji

- **Główny Kolor**: `#359b09` (odcień zieleni wybrany przez użytkownika).
- **Styl Wizualny**: 3D, biały checkmark z głębią i cieniem.
- **Specyfikacja dla Androida (Adaptive Icons)**:
  - Aby uniknąć efektu nadmiernego powiększenia (zoomu) na pulpicie Androida, plik ikony (`logo512.png`, `logo192.png`) musi posiadać **dodatkowy margines tła** wokół zaokrąglonego kwadratu grafiki.
  - Sam zaokrąglony kwadrat z logo powinien zajmować ok. 60-70% całkowitej powierzchni pliku 512x512.
  - Rogi pliku PNG powinny być przeźroczyste (jeśli grafika jest zaokrąglona), ale tło za grafiką musi być wystarczająco duże, by systemowa maska ( adaptive icon) nie "wycinała" samej zawartości logo.

## Pliki Projektowe

- `public/logo512.png`: Główna ikona wysokiej rozdzielczości.
- `public/logo192.png`: Kopia 512x512 (ze względu na kompatybilność).
- `public/favicon.png`: Kopia ikony 3D.
- `public/index.html`: Zawiera meta tag `<meta name="theme-color" content="#359b09" />` oraz `<link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />`.
