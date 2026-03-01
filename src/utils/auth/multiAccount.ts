import { closeAblyConnection } from "../sync/ably";
import {
  getTasksData,
  setTasksData,
  removeTasksData,
  FullTasksData,
} from "../storage/localStorage";

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
  } catch (error) {
    console.error(
      "Błąd podczas zapisywania aktualnego konta do localStorage:",
      error,
    );
  }
};

export const switchAccount = (email: string) => {
  try {
    // 1. Zabezpieczenie na wszelki wypadek obecnego stanu na inne konto przed przelaczeniem
    saveCurrentAccount();

    // 2. Szukanie konta do ktorego chcemy się podpiąć
    const accounts = getSavedAccounts();
    const accountToSwitch = accounts.find((acc) => acc.email === email);
    if (!accountToSwitch) {
      console.warn("Nie znaleziono żądanego konta:", email);
      return;
    }

    // 3. Odswiezenie `lastUsed` wybranego konta i podmiana głownego klucza auth
    accountToSwitch.lastUsed = Date.now();
    localStorage.setItem(MULTI_ACCOUNT_KEY, JSON.stringify(accounts));
    localStorage.setItem(
      GOTRUE_KEY,
      JSON.stringify(accountToSwitch.sessionData),
    );

    // 4. Przywracamy zadania powiązane z tym kontem
    if (accountToSwitch.tasksData) {
      setTasksData(accountToSwitch.tasksData);
    } else {
      removeTasksData();
    }

    // 5. Ubijamy istniejace polaczenie Ably
    closeAblyConnection();

    // 6. Hard reload dla zresetowania całego Reacta
    window.location.reload();
  } catch (error) {
    console.error("Błąd w trakcie przełączania konta:", error);
  }
};

export const removeAccount = (email: string) => {
  try {
    const accounts = getSavedAccounts();
    const filteredAccounts = accounts.filter((acc) => acc.email !== email);
    localStorage.setItem(MULTI_ACCOUNT_KEY, JSON.stringify(filteredAccounts));

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

export const clearSessionForNewAccount = () => {
  // Zachowujemy obecny stan uzytkownika przed wylogowaniem lokalnym
  saveCurrentAccount();

  localStorage.removeItem(GOTRUE_KEY);
  removeTasksData();
  closeAblyConnection();
  window.location.reload();
};
