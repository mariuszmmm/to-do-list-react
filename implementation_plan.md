# Plan implementacji - Wyłączenie efektu "bounce" (overscroll)

Użytkownik zgłosił problem z efektem "podskakiwania" strony (overscroll bounce) w aplikacjach PWA zainstalowanych przez przeglądarkę, co odróżnia je od aplikacji natywnych z Google Play. Rozwiązaniem jest zastosowanie właściwości CSS `overscroll-behavior: none;`.

## Kroki:

1. **Aktualizacja stylów globalnych**:
   - Edytuj plik `src/theme/GlobalStyle.ts`.
   - Dodaj `overscroll-behavior: none;` do selektorów `html` oraz `body`.
   - To ustawienie zapobiegnie efektowi "gumowania" przy przewijaniu do krawędzi oraz wyłączy gest pull-to-refresh, co przybliży zachowanie PWA do aplikacji natywnej.

2. **Weryfikacja**:
   - Sprawdź, czy style są poprawnie aplikowane.
   - (Aplikacja wymaga odświeżenia na urządzeniu mobilnym, aby efekt był widoczny).

## Rationale:

Właściwość `overscroll-behavior` pozwala kontrolować zachowanie przeglądarki, gdy użytkownik dotrze do granicy obszaru przewijania. W aplikacjach mobilnych (PWA) domyślne zachowanie przeglądarki (bounce) często psuje wrażenie "natywności" aplikacji.
