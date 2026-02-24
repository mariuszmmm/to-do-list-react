# Zadanie: Naprawa ostrzeżenia o brakujących kluczach w komponencie Modal

Użytkownik zgłosił błąd/ostrzeżenie w konsoli:
`installHook.js:1 Each child in a list should have a unique "key" prop.`
`Check the render method of Modal. It was passed a child from Trans.`

Błąd pojawia się po kliknięciu "usuń listę".

## Analiza

Ostrzeżenie wynika z faktu, że komponent `Trans` z biblioteki `react-i18next` zwraca tablicę węzłów (tekst + tagi HTML, np. `<strong>`), które są renderowane jako rodzeństwo wewnątrz `ModalDescription`. React wymaga, aby elementy w tablicy miały unikalne klucze. Choć `Trans` zwykle je dodaje, w pewnych konfiguracjach lub wersjach może to powodować problemy, jeśli nie jest poprawnie powiązany z instancją `t` lub jeśli rodzeństwo nie jest odpowiednio obsłużone.

## Rozwiązanie

1. Refaktoryzacja komponentu `Modal/index.tsx` w celu użycia hooka `useTranslation`.
2. Zastąpienie prostych wywołań `<Trans>` funkcją `t()`, co jest wydajniejsze i bezpieczniejsze dla prostych tekstów.
3. Przekazanie funkcji `t` jako prop do pozostałych komponentów `<Trans>`, co pomaga w poprawnej generacji kluczy przez `react-i18next`.
4. Upewnienie się, że fragmenty i warunkowe renderowanie nie wprowadzają dodatkowych problemów z kluczami.
