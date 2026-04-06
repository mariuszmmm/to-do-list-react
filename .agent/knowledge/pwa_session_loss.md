# Diagnoza: Utrata sesji uśpionego PWA

**Problem:** Aplikacja wylogowuje użytkownika po kilku dniach (lub krótszym czasie uśpienia) mimo aktywnej opcji "Pozostań zalogowany" i posiadania ważnego Refresh Tokena.

**Przyczyny (gotrue-js + PWA):**

1. Systemy mobilne (szczególnie iOS) agresywnie zamrażają wykonywanie kodu JavaScript dla aplikacji PWA działających w tle, w celu oszczędzania baterii.
2. Biblioteka `gotrue-js` od Netlify korzysta z _Single-Use Refresh Tokens_ (tokeny jednorazowe, które rotują podczas każdego odświeżania).
3. Pętla sprawdzająca czas ważności bieżącego `access_token` (`useTokenValidation.ts`) nie jest wywoływana, gdy aplikacja pozostaje zminimalizowana (kod jest zamrożony).
4. **Krytyczny moment wybudzenia z tła (Cold Network Start):**
   Gdy użytkownik otwiera ze skrótu nieaktywną od paru dni aplikację PWA:
   - Wznowiony JS odkrywa z opóźnieniem brak czasu ważności tokena (`tokenRemainingMs <= 0`) i _natychmiastowo_ woła `user.jwt()`.
   - Przeglądarka w tle właśnie próbuje na nowo nawiązać gniazda TLS (tzw. problem opóźnień sieci po wybudzeniu), co rzutuje `Network Error` do interfejsu klienta sieciowego.
   - Biblioteka `gotrue-js` (lub blok catch API) interpretuje niemożliwość wykorzystania "zapisanego, jednorazowego Refresh Tokenu" lub błąd zapytania jako nieważną sesję -> aplikacja czyści tokeny z `localStorage` i wymusza `user.logout()`.

**Zalecane rozwiązanie:**

- Nie reagować natychmiastowym czyszczeniem sesji na błędy sieciowe w `useTokenValidation` (szczególnie, gdy wyrzucany jest brak połączenia internetowego, a nie `401/403 Invalid Grant` od Netlify).
- Wprowadzić logikę nasłuchiwania na wznowienie PWA z tła `document.addEventListener("visibilitychange", ...)` lub z opóźnieniem ponownego strzału, by dać urządzeniu mobilnemu około 1-3 sekundy na nawiązanie połączenia przed ocenieniem stanu sesji za nieważny.
