# Plan implementacji - Naprawa kluczy w Modal

## Kroki

1. **Analiza kodu `Modal/index.tsx`** - Znaleziono wielokrotne użycie `<Trans>` dla prostych kluczy oraz jedno złożone użycie dla wiadomości z tagiem `<strong>`. [ZAKOŃCZONE]
2. **Dodanie hooka `useTranslation`** - Import i inicjalizacja `t` wewnątrz komponentu `Modal`. [ZAKOŃCZONE]
3. **Refaktoryzacja prostych tłumaczeń** - Zmiana `<Trans i18nKey="..." />` na `{t("...")}` dla:
   - Tytułu modala.
   - Tekstu przycisków (Anuluj, Usuń, Tak, Nie, Zamknij). [ZAKOŃCZONE]
4. **Poprawa złożonego tłumaczenia (`message`)** - Przekazanie propa `t={t}` do komponentu `<Trans>` obsługującego wiadomość, aby zapewnić spójność i poprawne generowanie kluczy. [ZAKOŃCZONE]
5. **Weryfikacja** - Sprawdzenie czy wszystkie komponenty `Trans` zostały obsłużone. [W TOKU]

## Oczekiwany rezultat

Ostrzeżenie `Each child in a list should have a unique "key" prop` powinno zniknąć, a modale powinny nadal poprawnie wyświetlać przetłumaczone treści, w tym pogrubienia i znaki nowej linii.
