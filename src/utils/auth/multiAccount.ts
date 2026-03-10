import { closeAblyConnection } from "../sync/ably";
import {
  getTasksData,
  setTasksData,
  removeTasksData,
  FullTasksData,
} from "../storage/localStorage";
import { syncToIndexedDB } from "../storage/storageSync";

const MULTI_ACCOUNT_KEY = "saved_accounts";
const GOTRUE_KEY = "gotrue.user";

export interface SavedAccount {
  email: string;
  name?: string;
  sessionData: any;
  lastUsed: number;
  tasksData?: FullTasksData;
}

export const getSavedAccounts = (): SavedAccount[] => {
  try {
    const rawData = localStorage.getItem(MULTI_ACCOUNT_KEY);
    if (!rawData) return [];
    return JSON.parse(rawData);
  } catch (error) {
    console.error("Błąd podczas odczytu zapisanym w localStorage kont:", error);
    return [];
  }
};

export const saveCurrentAccount = () => {
  try {
    const gotrueRaw = localStorage.getItem(GOTRUE_KEY);
    if (!gotrueRaw) return;

    const gotrueData = JSON.parse(gotrueRaw);
    const email = gotrueData?.email;
    const name = gotrueData?.user_metadata?.full_name;

    if (!email) return;

    const currentAccounts = getSavedAccounts();
    const existingIndex = currentAccounts.findIndex(
      (acc) => acc.email === email,
    );

    const newAccount: SavedAccount = {
      email,
      name,
      sessionData: gotrueData,
      tasksData: getTasksData(),
      lastUsed: Date.now(),
    };

    if (existingIndex >= 0) {
      currentAccounts[existingIndex] = newAccount;
    } else {
      currentAccounts.push(newAccount);
    }

    localStorage.setItem(MULTI_ACCOUNT_KEY, JSON.stringify(currentAccounts));
    syncToIndexedDB(MULTI_ACCOUNT_KEY, currentAccounts);
  } catch (error) {
    console.error(
      "Błąd podczas zapisywania aktualnego konta do localStorage:",
      error,
    );
  }
};

export const switchAccount = async (email: string) => {
  try {
    // 1. Zabezpieczenie obecnego stanu przed przełączeniem
    saveCurrentAccount();

    // 2. Szukanie konta do którego chcemy się przełączyć
    const accounts = getSavedAccounts();
    const accountToSwitch = accounts.find((acc) => acc.email === email);

    if (!accountToSwitch) {
      console.warn("Nie znaleziono żądanego konta:", email);
      return;
    }

    // 3. Walidacja danych sesji
    const isSessionDataClean =
      accountToSwitch.sessionData && accountToSwitch.sessionData.token;

    if (!isSessionDataClean) {
      console.error("Konto posiada nieprawidłowe dane sesji:", email);
      // Czyścimy sessionData, aby wymusić nowy login, ale zostawiamy konto na liście
      accountToSwitch.sessionData = null;
      localStorage.setItem(MULTI_ACCOUNT_KEY, JSON.stringify(accounts));
      throw new Error("SESSION_MISSING");
    }

    // 4. Odświeżenie `lastUsed` i podmiana klucza auth
    accountToSwitch.lastUsed = Date.now();
    localStorage.setItem(MULTI_ACCOUNT_KEY, JSON.stringify(accounts));
    await syncToIndexedDB(MULTI_ACCOUNT_KEY, accounts);

    localStorage.setItem(
      GOTRUE_KEY,
      JSON.stringify(accountToSwitch.sessionData),
    );
    await syncToIndexedDB(GOTRUE_KEY, accountToSwitch.sessionData);

    // 5. Przywracamy zadania powiązane z tym kontem
    if (accountToSwitch.tasksData) {
      setTasksData(accountToSwitch.tasksData);
    } else {
      removeTasksData();
    }

    // 6. Ubijamy istniejące połączenie Ably
    closeAblyConnection();

    // 7. Hard reload dla zresetowania całego Reacta
    window.location.reload();
  } catch (error) {
    console.error("Błąd w trakcie przełączania konta:", error);
    throw error; // Rzucamy dalej, aby UI (AccountSwitcher) mógł go obsłużyć
  }
};

export const removeAccount = (email: string) => {
  try {
    const accounts = getSavedAccounts();
    const filteredAccounts = accounts.filter((acc) => acc.email !== email);
    localStorage.setItem(MULTI_ACCOUNT_KEY, JSON.stringify(filteredAccounts));
    syncToIndexedDB(MULTI_ACCOUNT_KEY, filteredAccounts);

    // Jesli usuwamy obecne aktywne konto z pamieci narzedzia multikont...
    const gotrueRaw = localStorage.getItem(GOTRUE_KEY);
    if (gotrueRaw) {
      const user = JSON.parse(gotrueRaw);
      if (user.email === email) {
        clearSessionForNewAccount();
      }
    }
  } catch (error) {
    console.error("Błąd podczas usuwania konta", error);
  }
};

export const clearSessionForNewAccount = async () => {
  // Zachowujemy obecny stan uzytkownika przed wylogowaniem lokalnym
  saveCurrentAccount();

  localStorage.removeItem(GOTRUE_KEY);
  await syncToIndexedDB(GOTRUE_KEY, null);
  removeTasksData();
  closeAblyConnection();
  window.location.reload();
};
