import { get, set, del } from "idb-keyval";

/**
 * Zapisuje wartość do bazy IndexedDB jako kopię zapasową dla localStorage.
 * Jest to kluczowy mechanizm "Security Net", który pozwala przetrwać agresywne 
 * czyszczenie localStorage przez niektóre przeglądarki (np. Safari na iOS po 7 dniach braku interakcji).
 *
 * @param key Klucz pod jakim zapisujemy dane (zazwyczaj zgodny z kluczem w localStorage)
 * @param value Wartość do zapisania (obiekty są automatycznie serializowane do JSON)
 */
export const syncToIndexedDB = async (
  key: string,
  value: any,
): Promise<void> => {
  try {
    if (value === null || value === undefined) {
      // Jeśli wartość jest pusta, usuwamy klucz również z IndexedDB
      await del(key);
    } else {
      // Przygotowujemy dane do zapisu: stringi zostają bez zmian, obiekty zamieniamy na JSON
      const valueToSave =
        typeof value === "string" ? value : JSON.stringify(value);
      await set(key, valueToSave);
    }
  } catch (error: any) {
    /**
     * Podobnie jak przy odczycie, ignorujemy błędy otwierania bazy danych
     * tuż po jej wyczyszczeniu przez użytkownika.
     */
    if (error?.name === "UnknownError" || error?.message?.includes("Internal error")) {
      return;
    }

    // Pozostałe błędy logujemy jako ostrzeżenie tylko w trybie deweloperskim
    if (process.env.NODE_ENV === "development") {
      console.warn(`[IndexedDB Sync] Błąd zapisu klucza "${key}":`, error);
    }
  }
};

/**
 * Próbuje odzyskać wartość z IndexedDB i opcjonalnie wrzuca ją z powrotem do localStorage.
 * Wywoływane głównie podczas startu aplikacji (index.tsx), jeśli localStorage jest pusty.
 *
 * @param key Klucz do odzyskania
 * @param restoreToLocalStorage Czy automatycznie zasilić localStorage odzyskaną wartością?
 * @returns Zwraca wartość (string) lub null, jeśli klucz nie istnieje lub wystąpił błąd.
 */
export const restoreFromIndexedDB = async (
  key: string,
  restoreToLocalStorage: boolean = true,
): Promise<string | null> => {
  try {
    /**
     * Używamy idb-keyval do prostego dostępu klucz-wartość w IndexedDB.
     * UWAGA: get() może zwrócić UnknownError, jeśli baza jest właśnie czyszczona lub blokowana.
     */
    const value = await get<string>(key);
    
    if (value !== undefined && value !== null) {
      if (restoreToLocalStorage) {
        localStorage.setItem(key, value);
      }
      return value;
    }
    return null;
  } catch (error: any) {
    /**
     * Specyficzna obsługa błędów dla przeglądarek (np. Edge/Chrome).
     * Błąd "UnknownError" przy otwieraniu "backing store" zdarza się często tuż po 
     * ręcznym wyczyszczeniu danych przez użytkownika w DevTools.
     */
    if (error?.name === "UnknownError" || error?.message?.includes("Internal error")) {
      // Nie wyrzucamy błędu – prawdopodobnie baza jest właśnie inicjalizowana na nowo
      return null;
    }

    if (process.env.NODE_ENV === "development") {
      console.error(`[IndexedDB Restore] Błąd odczytu klucza "${key}":`, error);
    }
    return null;
  }
};
