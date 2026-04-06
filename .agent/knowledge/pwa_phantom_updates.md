# Mechanizm Aktualizacji PWA: Eliminacja Phantom Updates i Zarządzanie na Mobile

## Wstęp
Aplikacje typu PWA ze wsparciem dla Service Workerów (SW) na urządzeniach mobilnych (iOS/Android) potrafią zgłaszać fałszywe zdarzenia o dostępności aktualizacji (tzw. "Phantom Updates"). Dzieje się tak, gdy przeglądarka instaluje w tle nową instancję Service Workera w wyniku nieznacznej zmiany metadanych, mimo braku jakichkolwiek rzeczywistych zmian w kodzie JS widocznym z punktu widzenia wersji. 

Powodowało to ciągłe wyświetlanie modala "Dostępna aktualizacja" po odświeżeniu aplikacji przez użytkownika, mimo że wersja logicznie się nie zmieniła. Ten sam problem powodował wpadnięcie aplikacji w tak zwaną nieskończoną pętlę przeładowań po aktualizacji okna.

## Rozwiązanie problemu i architektura logiki SW w to-do-list-react:

Mechanizm zapisany w `src/common/UpdateNotification/index.tsx` rozwiązuje te dwa problemy poprzez komunikację postMessage z instalującym się Service Workerem i badanie jego `VERSION_INFO`.

### 1. Rozpoznawanie Phantom Updates
Podczas zdarzeń `waiting` lub `installing` (nowy Service Worker został znaleziony), skrypt wysyła zapytanie `GET_VERSION` na wydzielonym kanale komunikacyjnym `MessageChannel` odpowiednio do obecnego i nowego workera.

```typescript
// Pseudokod sprawdzania:
const activeVersion = await getWorkerVersion(activeWorker, "ActiveWorker");
const waitingVersion = await getWorkerVersion(worker, "NewWorker");

if (activeVersion && waitingVersion && activeVersion === waitingVersion) {
  // Wykryto Phantom Update (wersje identyczne). Omijanie...
  worker.postMessage({ type: "SKIP_WAITING" });
  return true; // Pomijamy wyświetlanie okienka UI
}
```
Jeżeli wersje się zgadzają, worker zostaje po cichu zaktywowany w tle (`SKIP_WAITING`) bez niepokojenia użytkownika i bez wpadania w pętlę przeładowań.

### 2. Wykrywanie "Prawdziwej" Aktualizacji
Jeżeli z zapytania dla obu workerów okaże się, że nowa wersja jest różna (`todo-list-v[nowa] != todo-list-v[stara]`), mechanizm określa to jako:
```
[UpdateNotification] Wykryto REALNĄ aktualizację. Pokazuję powiadomienie.
```
W tym momencie wyświetlony zostaje interaktywny modal pytający użytkownika o "Aktualizuj".

### 3. Agresywne wymuszanie sprawdzania na Mobile (visibilitychange)
Z powodu specyfiki zarządzania żywotnością aplikacji na pulpicie Androida (Chrome instalacyjne PWA usypia), natychmiastowe aktualizacje były wstrzymywane. Aby zniwelować ten efekt, dodano `visibilitychange` jako agresywny "wyzwalacz" na zdarzenie powrotu do aplikacji.

```typescript
const handleRevisit = async () => {
  if (document.visibilityState === "visible") {
    console.log("[UpdateNotification] Powrót do aplikacji. Sprawdzanie aktualizacji wymuszone.");
    const reg = await navigator.serviceWorker.getRegistration();
    if (reg) {
      await reg.update(); // <- Natychmiastowe zmuszenie przeglądarki do pingnięcia serwera (Netlify) o sw.js
      checkUpdateState(reg);
    }
  }
};
document.addEventListener("visibilitychange", handleRevisit);
```

To pozwala na wyświetlenie realnej najnowszej wersji po wejściu z pulpitu na mobile, zminimalizowaniu aplikacji i ponownym jej ukontentym podniesieniu z ostatnich kart.

### 4. Całkowite Czyszczenie przy restarcie 
Po kliknięciu przycisku aktualizuj w modalu (`handleUpdate`):
1. **Zabezpieczenie przed powtarzaniem:** System zapisuje w `localStorage` flagę `pwa_updating_global="true"`.
2. **Killed Cache:** Wykorzystywana jest logika `caches.keys()` by wykasować absolutnie cały starożytny `caches`.
3. **Aktywacja Workera:** Powielenie pętli `worker.postMessage({ type: "SKIP_WAITING" })` dla podtrzymania stabilności podczas trwającego procesu usuwania cache (3 strzały co pauza 300ms).
4. **Reload z flagi na wszystkich kontrolach:** Nastąpi wpadnięcie w blok zdarzeń `controllerchange`, które bezwzględnie przeładują okno w locie `window.location.reload()`, zapewniając płynny i ostateczny finał procesu aktualizacji.
