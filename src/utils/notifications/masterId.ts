import { auth } from "../../api/auth";
import { syncToIndexedDB, restoreFromIndexedDB } from "../storage/storageSync";

/**
 * Klucze używane w LocalStorage i IndexedDB do przechowywania stanu powiadomień.
 */
const MASTER_ID_KEY = "onesignal_master_id";
const GLOBAL_RESET_FLAG_KEY = "notification_global_reset_active";
const PUSH_INITIALIZED_KEY = "push_initialized";

/**
 * Struktura rekordu Master ID.
 * t (timestamp) jest kluczowy przy rozwiązywaniu konfliktów (wybieramy starszy rekord).
 */
export interface MasterRecord {
  id: string;
  t: number; // timestamp utworzenia
}

export interface SyncResult {
  id: string | null;
  didUnify: boolean;
  previousId: string | null;
}

/**
 * Parsuje dane Master ID, obsługując stary format (sam string) i nowy (obiekt JSON).
 * Zapewnia kompatybilność wsteczną dla użytkowników, którzy mają stare ID w storage.
 */
const parseRecord = (data: any): MasterRecord | null => {
  if (!data) return null;
  try {
    const parsed = typeof data === "string" && data.startsWith("{") ? JSON.parse(data) : data;
    if (typeof parsed === "object" && parsed.id && parsed.t) {
      return parsed;
    }
    // Obsługa starego formatu (tylko string)
    if (typeof data === "string") {
      return { id: data, t: 1741842000000 };
    }
  } catch (e) {
    if (typeof data === "string") return { id: data, t: 1741842000000 };
  }
  return null;
};

/**
 * Pobiera aktualne Master ID jako prosty ciąg znaków (używane przez OneSignal SDK).
 */
export const getLocalMasterId = (): string | null => {
  const record = parseRecord(localStorage.getItem(MASTER_ID_KEY));
  return record ? record.id : null;
};

/**
 * Synchronizuje Master ID między Local Storage, IndexedDB a metadanymi użytkownika na serwerze (Netlify/GoTrue).
 * W przypadku konfliktu (różne ID na serwerze i lokalnie) wybiera starsze ID, aby zachować ciągłość profilu.
 */
export const syncMasterId = async (): Promise<SyncResult> => {
  const user = auth.currentUser();
  if (!user) return { id: null, didUnify: false, previousId: null };

  const localRecord = parseRecord(localStorage.getItem(MASTER_ID_KEY));
  const serverRecord = parseRecord(user.user_metadata?.onesignal_master_id);

  let winner: MasterRecord;
  let didUnify = false;
  let previousId: string | null = null;

  if (localRecord && serverRecord) {
    if (localRecord.id === serverRecord.id) {
      winner = localRecord;
    } else {
      // Rozwiązywanie konfliktu: Wybieramy starsze ID (niższy timestamp)
      if (localRecord.t <= serverRecord.t) {
        winner = localRecord;
        previousId = serverRecord.id;
      } else {
        winner = serverRecord;
        previousId = localRecord.id;
      }
      didUnify = true;
    }
  } else {
    // Jeśli brakuje danych, używamy tego co mamy lub generujemy nowe ID
    winner = localRecord || serverRecord || { id: crypto.randomUUID(), t: Date.now() };
  }

  const winnerString = JSON.stringify(winner);

  // 1. Aktualizacja lokalna (LS + IndexedDB)
  if (localStorage.getItem(MASTER_ID_KEY) !== winnerString) {
    localStorage.setItem(MASTER_ID_KEY, winnerString);
    await syncToIndexedDB(MASTER_ID_KEY, winner);
  }

  // 2. Aktualizacja na serwerze (Update metadanych Netlify Identity)
  if (JSON.stringify(user.user_metadata?.onesignal_master_id) !== winnerString) {
    try {
      await user.update({
        data: { onesignal_master_id: winner },
      });
    } catch (error) {
      console.error("Failed to sync Master ID to server:", error);
    }
  }

  return { id: winner.id, didUnify, previousId };
};

/**
 * Agresywne usuwanie baz danych utworzonych przez SDK OneSignal.
 * Jest to konieczne przy pełnym resecie ustawień powiadomień.
 */
export const deleteOneSignalDatabase = async (): Promise<void> => {
  let dbNames: string[] = ["OneSignalSDKDatabase", "OneSignalSDKIndices", "OneSignal", "onesignal"];
  
  try {
    // Próba wykrycia wszystkich baz powiązanych z OneSignal
    if ("databases" in indexedDB) {
      const dbs = await (indexedDB as any).databases();
      dbNames = [...new Set([...dbNames, ...dbs.map((db: any) => db.name).filter((n: string) => n.toLowerCase().includes("onesignal"))])];
    }
  } catch (e) {
    console.warn("MasterIdUtil: Could not list databases, using default list.");
  }

  for (const dbName of dbNames) {
    console.log(`MasterIdUtil: Requesting deletion of ${dbName}...`);
    await new Promise<void>((resolve) => {
      const request = indexedDB.deleteDatabase(dbName);
      
      request.onsuccess = () => {
        console.log(`MasterIdUtil: DB ${dbName} deleted successfully.`);
        resolve();
      };
      
      request.onerror = () => {
        console.error(`MasterIdUtil: Failed to delete DB ${dbName}.`);
        resolve();
      };

      request.onblocked = () => {
        console.warn(`MasterIdUtil: Deletion of ${dbName} is BLOCKED. Waiting...`);
        // Jeśli baza jest otwarta w innej karcie, czekamy krótko
        setTimeout(resolve, 500);
      };

      // Zabezpieczenie przed nieskończonym oczekiwaniem
      setTimeout(resolve, 2000);
    });
  }
};

/**
 * Całkowity reset stanu powiadomień. 
 * Proces obejmuje:
 * 1. Usunięcie profilu z serwerów OneSignal (REST API)
 * 2. Wylogowanie z SDK
 * 3. Wyrejestrowanie Service Workera
 * 4. Wyczyszczenie Cache Storage
 * 5. Usunięcie baz IndexedDB
 * 6. Wyczyszczenie Local/Session Storage oraz ciasteczek
 * 7. Aktualizacja metadanych na serwerze Netlify
 */
export const resetMasterId = async (
  onDelete?: (id: string, email?: string, subscriptionId?: string, onesignalId?: string) => Promise<any>,
  onLogout?: () => Promise<any>,
  extraIds?: { email?: string; subscriptionId?: string; onesignalId?: string }
): Promise<void> => {
  const user = auth.currentUser();
  const currentId = getLocalMasterId();

  // 1. Usunięcie z OneSignal (REST API) - musi nastąpić przed wylogowaniem SDK
  if (onDelete && currentId) {
    try {
      console.log("MasterIdUtil: Requesting OneSignal profile deletion for:", { 
        currentId, 
        ...extraIds 
      });
      await onDelete(
        currentId, 
        extraIds?.email, 
        extraIds?.subscriptionId, 
        extraIds?.onesignalId
      );
    } catch (error) {
      console.error("MasterIdUtil: OneSignal profile deletion failed:", error);
    }
  }

  // 2. Wylogowanie z SDK OneSignal
  if (onLogout) {
    try {
      console.log("MasterIdUtil: Requesting OneSignal SDK Logout...");
      await onLogout();
    } catch (error) {
      console.error("MasterIdUtil: OneSignal logout failed:", error);
    }
  }
  
  // 3. Czyszczenie elementów przeglądarki (SW, Cache)
  try {
    await unregisterOneSignalServiceWorker();
    await clearCacheStorage();
  } catch (err) {
    console.warn("MasterIdUtil: Service Worker or Cache cleanup failed:", err);
  }

  // 4. Fizyczne usunięcie baz danych
  await deleteOneSignalDatabase();
  
  // 5. Usuwanie kluczy z LocalStorage i SessionStorage
  [localStorage, sessionStorage].forEach(storage => {
    Object.keys(storage).forEach(key => {
      if (key.toLowerCase().includes("onesignal") || key === PUSH_INITIALIZED_KEY) {
        storage.removeItem(key);
      }
    });
  });

  // 6. Usuwanie ciasteczek pomocniczych
  document.cookie.split(";").forEach(c => {
    const name = c.split("=")[0].trim();
    if (name.toLowerCase().includes("onesignal")) {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
    }
  });

  // 7. Synchronizacja stanu 'wyłączone powiadomienia' z serwerem Netlify
  if (user) {
    try {
      console.log("MasterIdUtil: Updating Netlify metadata (onesignal_master_id: null)...");
      await user.update({
        data: { 
          onesignal_master_id: null,
          notificationsDisabled: true 
        },
      });
      // Odświeżenie sesji lokalnej, aby odzwierciedlić zmiany w metadanych
      await (user as any).getUserData();
      console.log("MasterIdUtil: Server metadata and local session object refreshed.");
    } catch (error) {
      console.error("MasterIdUtil: Failed to update user metadata on server:", error);
    }
  }
};

/**
 * Przełącza flagę wyłączenia powiadomień w metadanych użytkownika (Netlify).
 */
export const setNotificationsDisabled = async (disabled: boolean): Promise<void> => {
  const user = auth.currentUser();
  if (user) {
    await user.update({
      data: { notificationsDisabled: disabled }
    });
  }
};

/**
 * Sprawdza czy powiadomienia są oznaczone jako wyłączone na poziomie metadanych.
 */
export const isNotificationsDisabled = (): boolean => {
  const user = auth.currentUser();
  return !!user?.user_metadata?.notificationsDisabled;
};

/**
 * Zarządzanie flagą inicjalizacji Push w LocalStorage.
 * Zapobiega wielokrotnej, niepotrzebnej inicjalizacji SDK przy każdym przeładowaniu.
 */
export const setPushInitialized = (initialized: boolean) => {
  if (initialized) {
    localStorage.setItem(PUSH_INITIALIZED_KEY, "true");
  } else {
    localStorage.removeItem(PUSH_INITIALIZED_KEY);
  }
};

export const isPushInitialized = (): boolean => {
  return localStorage.getItem(PUSH_INITIALIZED_KEY) === "true";
};

/**
 * Pobiera flagę "Global Reset", która wymusza przelogowanie wszystkich kont
 * w przypadku krytycznych zmian w infrastrukturze powiadomień.
 */
export const getGlobalResetFlag = async (): Promise<boolean> => {
  const local = localStorage.getItem(GLOBAL_RESET_FLAG_KEY) === "true";
  return local; 
};

/**
 * Ustawia flagę "Global Reset" (synchronizowane z IndexedDB dla trwałości).
 */
export const setGlobalResetFlag = async (active: boolean): Promise<void> => {
  if (active) {
    localStorage.setItem(GLOBAL_RESET_FLAG_KEY, "true");
    await syncToIndexedDB(GLOBAL_RESET_FLAG_KEY, "true");
  } else {
    localStorage.removeItem(GLOBAL_RESET_FLAG_KEY);
    await syncToIndexedDB(GLOBAL_RESET_FLAG_KEY, null);
  }
};

/**
 * Sprawdza flagę resetu we wszystkich dostępnych magazynach danych.
 */
export const checkGlobalResetFlag = async (): Promise<boolean> => {
  const local = localStorage.getItem(GLOBAL_RESET_FLAG_KEY) === "true";
  if (local) return true;
  
  const indexed = await restoreFromIndexedDB(GLOBAL_RESET_FLAG_KEY);
  return indexed === "true";
};

/**
 * Czyści CAŁY Cache Storage przeglądarki (podejście atomowe).
 */
export const clearCacheStorage = async (): Promise<void> => {
  if ("caches" in window) {
    try {
      const keys = await caches.keys();
      console.log("MasterIdUtil: Nuking ALL caches:", keys);
      await Promise.all(keys.map(key => caches.delete(key)));
      console.log("MasterIdUtil: Cache storage cleared.");
    } catch (error) {
      console.error("MasterIdUtil: Failed to clear cache storage:", error);
    }
  }
};

/**
 * Siłowo wyrejestrowuje wszystkie aktywne Service Workery (szczególnie te od OneSignal).
 */
export const unregisterOneSignalServiceWorker = async (): Promise<boolean> => {
  if ("serviceWorker" in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      let found = false;
      for (const registration of registrations) {
        console.log("MasterIdUtil: Unregistering Service Worker:", registration.active?.scriptURL);
        await registration.unregister();
        found = true;
      }
      return found;
    } catch (error) {
      console.error("MasterIdUtil: Failed to unregister Service Worker:", error);
      return false;
    }
  }
  return false;
};
