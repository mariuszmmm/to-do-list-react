# Architektura Projektu

## Struktura Katalogów

- `src/api/`: Metody komunikacji z API i funkcjami Netlify.
- `src/common/`: Komponenty wielokrotnego użytku, generyczne UI, stałe.
- `src/features/`: Moduły funkcjonalne aplikacji (np. zadania, admin, ustawienia). Każdy folder feature zawiera zazwyczaj:
  - `index.tsx`: Główny komponent.
  - `styled.ts`: Style komponentu.
  - `*Slice.ts`: Stan Redux.
  - `*Saga.ts`: Logika efektów ubocznych.
- `src/theme/`: Definicja motywu (kolory, breakpointy, spacing) dla Styled Components.
- `src/translations/`: Pliki tłumaczeń (pl.ts, en.ts, de.ts).
- `src/hooks/`: Customowe hooki React.
- `src/utils/`: Funkcje pomocnicze.

## Kluczowe Wzorce

- **Feature-based structure**: Kod jest grupowany według funkcjonalności, a nie typu pliku.
- **Separation of Concerns**: UI (JSX) oddzielone od styli (styled.ts) i logiki biznesowej (sagi/hooki).
- **Generic First**: Przy tworzeniu nowych komponentów w `src/common/` dążymy do maksymalnej generyczności.
- **Strict Typing**: Wszystkie dane przychodzące z API oraz stany Redux muszą być dokładnie otypowane.

## Zarządzanie Stanem

- Głębsza logika procesowa (np. złożone operacje na danych, synchronizacja Ably) jest obsługiwana przez Sagi.
- Proste zapytania do bazy danych są obsługiwane przez React Query.
- Globalny stan UI (np. wybrany motyw, język) jest w Redux lub Context.
