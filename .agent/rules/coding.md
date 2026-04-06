# Standardy Kodowania

- **Stylowanie**: Używamy WYŁĄCZNIE `styled-components`.
  - **ABSOLUTNY ZAKAZ** stosowania styli inline (`style={{...}}`).
  - Wszystkie style muszą znajdować się w dedykowanym pliku `styled.ts` obok komponentu (lub w `src/theme/` dla globalnych motywów).
- **Komponenty i Reużywalność (ZŁOTA ZASADA DRY)**:
  - Zanim stworzysz jakikolwiek nowy element UI, MUSISZ:
    1. Przeszukać katalog `src/common` pod kątem istniejących lub bardzo podobnych komponentów. Jeśli znajdziesz – użyj go, dopasowując zachowanie przez propsy.
    2. Jeśli w `common` nic nie pasuje, przeszukaj inne pliki `styled.ts` w całej aplikacji. Jeśli znajdziesz pasujący styl, PRZENIEŚ go do `src/common`, stwórz z niego wspólny komponent i użyj go w nowym miejscu (oraz zaktualizuj stare miejsce).
    3. **Usuń zduplikowany/niepotrzebny kod** ze starego pliku `styled.ts` po przeniesieniu komponentu do `common`.
  - **Dopasowanie przez propsy**: Wykorzystuj transient props (zaczynające się od `$`, np. `$color`, `$variant`) do modyfikacji wyglądu wspólnych komponentów, aby nie "zaśmiecać" atrybutów HTML w DOM.
  - **Ostateczność**: Tworzenie nowych komponentów lokalnie w `styled.ts` jest dopuszczalne WYŁĄCZNIE, gdy powyższe kroki nie przyniosły rezultatu.
  - **ZAKAZ** usuwania istniejących propsów z komponentów w `common`. Możesz jedynie rozszerzać ich funkcjonalność przez dodawanie nowych, opcjonalnych propsów.
- **Project Structure**:
  - Logika biznesowa (niezwiązana z UI) powinna być wydzielona do hooków lub sag.
  - Unikaj "magic numbers" - używaj stałych lub wartości z `theme`.
- **Typowanie**:
  - Unikaj typu `any`. Definiuj interfejsy i typy dla wszystkich propsów i stanów.
  - Kod musi być czysty, czytelny i w pełni otypowany w TypeScript.
