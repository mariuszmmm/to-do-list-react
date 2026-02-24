# Statystyki API: Cloudinary i Ably

Ten dokument zawiera wyjaśnienie struktury odpowiedzi z API Cloudinary (użycie konta) oraz API Ably (statystyki aplikacji), aby ułatwić ich interpretację.

## 1. Cloudinary API Usage (`getCloudinaryUsage`)

Cloudinary opiera się na systemie **kredytów (Credits)**, który ujednolica rozliczanie przestrzeni dyskowej, transferu i transformacji plików.

- **`plan`**: Typ aktualnego planu (np. "Free").
- **`last_updated`**: Data ostatniej aktualizacji statystyk po stronie Cloudinary.
- **`date_requested`**: Data i czas pobrania tych statystyk przez aplikację.
- **`transformations`**:
  - `usage`: Całkowita liczba operacji na obrazach/wideo (np. zmiana rozmiaru, nałożenie filtrów).
  - `credits_usage`: Koszt tych przekształceń w kredytach.
- **`objects`**: Całkowita liczba wszystkich plików przechowywanych na koncie.
- **`bandwidth`** (Transfer):
  - `usage`: Ilość pobranych przez użytkowników danych (w bajtach).
  - `credits_usage`: Koszt transferu w kredytach (1 GB to zazwyczaj 1 kredyt).
- **`storage`** (Przestrzeń):
  - `usage`: Łączny rozmiar wszystkich plików zapisanych na dyskach serwera Cloudinary (w bajtach).
  - `credits_usage`: Koszt przestrzeni w kredytach.
- **`impressions`**: Liczba wyświetleń (pobrań) zasobów przez przeglądarkę, generalnie darmowe w niższych planach.
- **`credits`** (Kluczowe podsumowanie limitów):
  - `usage`: Suma zużytych kredytów (transfer + transformacje + miejsce).
  - `limit`: Całkowita miesięczna pula kredytów dla planu (np. 25).
  - `used_percent`: Aktualne procentowe zużycie limitu miesięcznego.
- **`resources`**: Liczba oryginalnych (wgranych samodzielnie) plików.
- **`derived_resources`**: Liczba plików "pochodnych" wygenerowanych przez Cloudinary (np. automatycznie zmniejszone po wgraniu).
- **`media_limits`**: Maksymalne dozwolone parametry dla pojedynczego pliku (waga pliku, maksymalne rozdzielczości obrazu w pikselach itp.).
- **`rate_limit_*`**: Parametry limitujące same wywołania do API:
  - `rate_limit_allowed`: Max liczba zapytań na godzinę (np. 500).
  - `rate_limit_remaining`: Pozostała liczba zapytań w aktualnym zakresie czasu.

## 2. Ably API Stats (`ably.stats()`)

Zwracane dane reprezentują zagregowane zużycie zasobów Ably (np. z całego miesiąca, jeśli `unit: 'month'`). Dane nie zawierają bezpośrednio strukturalnych list kanałów czy identyfikatorów połączeń, a jedynie parametry ilościowe.

Kluczowe modyfikatory:

- `.count` – liczba wystąpień zdarzenia.
- `.data` – całkowity transfer w bajtach dla danej operacji.
- `.billableCount` – liczba zdarzeń podlegających rozliczeniu z limitu konta (np. darmowe 6 milionów).

### Kategorie statystyk Ably:

1.  **`messages` (Wiadomości)**:
    - `messages.all.all.*` – Suma wszystkich wiadomości (przychodzące i wychodzące).
    - Podział `inbound` (np. publikowane przez aplikację/serwer REST API) i `outbound` (dostarczane do subskrybentów WebSocket w przeglądarce).
    - `messages.*.messages.*` – Standardowe wiadomości z danymi.
    - `messages.*.presence.*` – Specjalistyczne wiadomości powiadamiające o "wejściu" i "wyjściu" z danego kanału użytkowników.
2.  **`connections` (Połączenia WebSocket/Realtime)**:
    - `connections.all.peak` – Najwyższa używana jednocześnie liczba połączeń (np. max 6 podłączonych urządzeń/zakładek jednocześnie). Limit dla darmowego konta, np. 200.
    - `connections.all.mean` – Średnia liczba urządzeń podłączonych do aplikacji (aktywnie utrzymujących połączenie w mierzonym przedziale).
    - `connections.all.opened` – Ilość pojedynczych aktów wejścia do aplikacji.
3.  **`channels` (Kanały komunikacyjne)**:
    - `channels.peak` – Oszacowana maksymalna aktywna jednoczesna liczba kanałów.
    - `channels.opened` – Sumaryczna liczba otwarć kanałów przez klientów w podanym czasie.
    - **UWAGA**: Endpoint `stats` nie wymienia z jakich konkretnie kanałów aplikacja korzysta. API dostarcza w tym miejscu wyłącznie ilości / woluminy ruchu.
4.  **`apiRequests` (Ruch HTTP API/REST)**:
    - `apiRequests.all.succeeded` – Liczba pozytywnie puszczonych żądań REST.
    - `apiRequests.all.refused` – Zapytania odrzucone lub zablokowane.
    - `apiRequests.tokenRequests.succeeded` – Żądania mające na celu wydanie nowego tokena uprawniającego do komunikacji z siecią WebSocket.
