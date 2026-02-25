# Wiedza Techniczna: Konfiguracja PWA i Dynamika Kolorów

## System Ikon (Folder `public/`)

- **`favicon.png`**: Logo powiększone (90-95% powierzchni), zminimalizowane marginesy. Używane w `index.html` dla kart przeglądarki.
- **`logo192.png` & `logo512.png`**: Ikony typu **maskable**. Posiadają "bezpieczny margines" (logo zajmuje ok. 60-70% środka), co chroni przed ucinaniem przez system Android przy nakładaniu masek (koła/kwadratu).
- **`manifest.json`**: Rozdzielono parametry `"purpose"` na osobne wpisy (`maskable` i `any`) dla każdego rozmiaru. Rozwiązuje to problem "podskakiwania" lub nagłej zmiany rozmiaru ikony podczas startu aplikacji na Androidzie.

## Kolory Systmowe i PWA

- **`theme_color` (Belka systemowa)**:
  - Usunięto niestandardowe ustawienia. Używamy domyślnego zachowania przeglądarki i systemu operacyjnego.
- **`background_color` (Splash Screen)**: Przywrócono oryginalny kolor `#359b09` (zsynchronizowany z tłem ikony). Służy jako tło podczas inicjalizacji aplikacji przez system operacyjny.

## Optymalizacja "Białego Błysku" (FOUC)

- Usunięto niestandardowe skrypty i style. Aplikacja ładuje się w sposób domyślny dla przeglądarki.

## Standardy Kolorystyczne Belki (Navigation Sync)

- Tryb Jasny: `#007380` (Teal)
- Tryb Ciemny: `#005c67` (Dark Teal)
- Tło Aplikacji Jasne: `#eeeeee`
- Tło Aplikacji Ciemne: `#151515`
- Kolor Marki (Ikona): `#359b09` (Vivid Green)
