# Zadanie: Wyłączenie efektu "bounce" (overscroll) w PWA

Użytkownik zgłosił, że aplikacja "podskakuje" (efekt bounce/overscroll) przy przewijaniu na urządzeniach mobilnych, co nie występuje w natywnych aplikacjach z Google Play.

## Cel

Zablokowanie domyślnego efektu bounce przeglądarki, aby aplikacja zachowywała się jak natywna.

## Analiza

Problem wynika z domyślnego zachowania przeglądarek mobilnych (szczególnie Chrome i Safari), które dodają efekt "elastycznego przewijania" (rubber-banding) lub pull-to-refresh na końcach przewijalnej treści. Właściwość CSS `overscroll-behavior: none` pozwala na wyłączenie tego zachowania.

## Plan

1. Dodanie `overscroll-behavior: none;` do `GlobalStyle.ts` dla `html` i `body`.
2. Przetestowanie zmian (symulacja w przeglądarce, o ile to możliwe, lub poinformowanie o konieczności testu na mobile).
