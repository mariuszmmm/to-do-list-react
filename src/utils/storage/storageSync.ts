import { get, set, del } from "idb-keyval";

/**
 * Zapisuje wartość do bazy IndexedDB jako kopię zapasową dla localStorage.
 * Używane głownie po to, by przetrwać automatyczne czyszczenie localStorage przez Safari/iOS.
 *
 * @param key Klucz pod jakim zapisyjemy dane (zazwyczaj ten sam co w localStorage)
 * @param value Wartość do zapisania (zostanie zserializowana do JSON, jeśli to obiekt)
 */
export const syncToIndexedDB = async (
  key: string,
  value: any,
): Promise<void> => {
  try {
    if (value === null || value === undefined) {
      await del(key);
    } else {
      // Przygotowujemy dane do zapisu w taki sam sposób jak w localStorage
      const valueToSave =
        typeof value === "string" ? value : JSON.stringify(value);
      await set(key, valueToSave);
    }
  } catch (error) {
    console.error(`Błąd podczas zapisu do IndexedDB (klucz: ${key}):`, error);
  }
};

/**
 * Pobiera wartość z IndexedDB i opcjonalnie natychmiast wrzuca ją z powrotem do localStorage.
 * Używane przy starcie aplikacji (np. index.tsx), gdy localStorage zgubiło dane.
 *
 * @param key Klucz do odzyskania
 * @param restoreToLocalStorage Czy automatycznie zapisać odzyskaną wartość do localStorage?
 * @returns Zwraca wartość (string), null jeśli brak.
 */
export const restoreFromIndexedDB = async (
  key: string,
  restoreToLocalStorage: boolean = true,
): Promise<string | null> => {
  try {
    const value = await get<string>(key);
    if (value !== undefined && value !== null) {
      if (restoreToLocalStorage) {
        localStorage.setItem(key, value);
      }
      return value;
    }
    return null;
  } catch (error) {
    console.error(`Błąd podczas odczytu z IndexedDB (klucz: ${key}):`, error);
    return null;
  }
};
