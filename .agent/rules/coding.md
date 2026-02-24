# Standardy Kodowania

- **Stylowanie**: Używamy WYŁĄCZNIE `styled-components`.
  - **ZAKAZ** stosowania styli inline (`style={{...}}`).
  - Wszystkie style muszą znajdować się w dedykowanym pliku `styled.ts` obok komponentu (lub w `src/theme/` dla globalnych motywów).
- **Komponenty**:
  - Twórz komponenty generyczne i wielokrotnego użytku.
  - Kod powinien być czysty, czytelny i dobrze otypowany w TypeScript.
- **Project Structure**:
  - Logika biznesowa (niezwiązana z UI) powinna być wydzielona do hooków lub sag, jeśli to możliwe.
  - Unikaj "magic numbers" - używaj stałych lub wartości z `theme`.
- **Typowanie**:
  - Unikaj typu `any`. Definiuj interfejsy i typy dla wszystkich propsów i stanów.
