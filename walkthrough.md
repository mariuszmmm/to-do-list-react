# Podsumowanie zmian - Naprawa efektu "bounce" (overscroll)

Rozwiązałem problem "podskakiwania" strony (overscroll bounce) w aplikacji PWA, który powodował, że interfejs zachowywał się inaczej niż natywne aplikacje z Google Play.

## Opis zmian:

1. **Global Style**:
   - W pliku `src/theme/GlobalStyle.ts` dodałem właściwość `overscroll-behavior: none;` do elementów `html` oraz `body`.
   - Ta właściwość wyłącza domyślny efekt "rubber-banding" (gumowania) przeglądarki przy dotarciu do krawędzi przewijania oraz blokuje gest "pull-to-refresh".

## Efekt:

Aplikacja zyskała bardziej natywny charakter. Przewijanie zatrzymuje się sztywno na krawędziach treści, co jest standardem w aplikacjach mobilnych instalowanych ze sklepów.

## Rekomendacja dla innych projektów:

Jeśli Twoje aplikacje Next.js mają ten sam problem, możesz zastosować ten sam zabieg, dodając poniższy kod do globalnego pliku CSS (np. `globals.css`):

```css
html,
body {
  overscroll-behavior: none;
}
```

Dziękuję za zgłoszenie i załączenie nagrania – bardzo pomogło w diagnozie!
