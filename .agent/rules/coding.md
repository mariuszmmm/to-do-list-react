# Standardy Kodowania

- **Stylowanie**: Używamy WYŁĄCZNIE `styled-components`.
  - **ZAKAZ** stosowania styli inline (`style={{...}}`).
  - Wszystkie style muszą znajdować się w dedykowanym pliku `styled.ts` obok komponentu (lub w `src/theme/` dla globalnych motywów).
- **Komponenty**:
  - Twórz komponenty generyczne i wielokrotnego użytku.
  - **ZAKAZ** usuwania istniejących propsów z komponentów znajdujących się w katalogu `common`. Możesz jedynie dodawać do nich nowe propsy w celu rozszerzenia ich funkcjonalności.
  - Zawsze przeszukuj aplikację, czy nie istnieje już podobny komponent. Jeśli taki znajdziesz i chcesz go użyć, przenieś go do katalogu `common` i ewentualnie dostosuj poprzez dodanie nowych propsów (w celu dokładnego dopasowania).
  - Kod powinien być czysty, czytelny i dobrze otypowany w TypeScript.
- **Project Structure**:
  - Logika biznesowa (niezwiązana z UI) powinna być wydzielona do hooków lub sag, jeśli to możliwe.
  - Unikaj "magic numbers" - używaj stałych lub wartości z `theme`.
- **Typowanie**:
  - Unikaj typu `any`. Definiuj interfejsy i typy dla wszystkich propsów i stanów.
