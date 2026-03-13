import { restoreFromIndexedDB, syncToIndexedDB } from "../storage/storageSync";
import {
  FullTasksData,
  getTasksData,
  removeTasksData,
  setTasksData,
} from "../storage/localStorage";

declare global {
  interface Window {
    ably: any;
  }
}

const MULTI_ACCOUNT_KEY = "saved_accounts";
const GOTRUE_KEY = "gotrue.user";

export interface SavedAccount {
  email: string;
  name?: string;
  sessionData: any;
  tasksData: FullTasksData | null;
  lastUsed: number;
}

const closeAblyConnection = () => {
  if (window.ably) {
    window.ably.close();
    console.log("Ably connection closed because of account switch");
  } else {
    console.log("Ably connection not found during switch");
  }
};

export const getSavedAccounts = (): SavedAccount[] => {
  const data = localStorage.getItem(MULTI_ACCOUNT_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveCurrentAccount = async () => {
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

    const tasksData = getTasksData();
    const lastUsed = Date.now();

    console.log(`[saveCurrentAccount] Zapisywanie danych dla: ${email}`, {
      taskCount: tasksData.tasks?.length || 0,
      listName: tasksData.meta?.name
    });

    if (existingIndex >= 0) {
      currentAccounts[existingIndex] = {
        ...currentAccounts[existingIndex],
        sessionData: gotrueData,
        tasksData,
        lastUsed,
      };
    } else {
      currentAccounts.push({
        email,
        name,
        sessionData: gotrueData,
        tasksData,
        lastUsed,
      });
    }

    localStorage.setItem(MULTI_ACCOUNT_KEY, JSON.stringify(currentAccounts));
    await syncToIndexedDB(MULTI_ACCOUNT_KEY, currentAccounts);
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
    await saveCurrentAccount();

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
      accountToSwitch.sessionData = null;
      localStorage.setItem(MULTI_ACCOUNT_KEY, JSON.stringify(accounts));
      throw new Error("SESSION_MISSING");
    }

    // 4. Najpierw przygotowujemy zadania dla nowego konta w localStorage
    if (accountToSwitch.tasksData) {
      await setTasksData(accountToSwitch.tasksData);
    } else {
      await removeTasksData();
    }

    // 5. Dopiero gdy zadania są na miejscu, podmieniamy klucz auth i odświeżamy lastUsed
    accountToSwitch.lastUsed = Date.now();
    localStorage.setItem(MULTI_ACCOUNT_KEY, JSON.stringify(accounts));
    await syncToIndexedDB(MULTI_ACCOUNT_KEY, accounts);

    localStorage.setItem(
      GOTRUE_KEY,
      JSON.stringify(accountToSwitch.sessionData),
    );
    await syncToIndexedDB(GOTRUE_KEY, accountToSwitch.sessionData);

    // 6. Ubijamy istniejące połączenie Ably
    closeAblyConnection();

    // 7. Przeładowujemy stronę natychmiast
    // NIE czyścimy sessionStorage.clear(), bo potrzebujemy tam account_switch_target dla modala sukcesu
    window.location.reload();
  } catch (error) {
    console.error("Błąd podczas przełączania kont:", error);
    sessionStorage.removeItem("account_switch_target");
    throw error;
  }
};

export const removeAccount = async (email: string) => {
  let accounts = getSavedAccounts();
  accounts = accounts.filter((acc) => acc.email !== email);
  localStorage.setItem(MULTI_ACCOUNT_KEY, JSON.stringify(accounts));
  await syncToIndexedDB(MULTI_ACCOUNT_KEY, accounts);
};

export const markSessionAsExpired = async (email: string) => {
  const accounts = getSavedAccounts();
  const accountIndex = accounts.findIndex((acc) => acc.email === email);

  if (accountIndex >= 0) {
    accounts[accountIndex].sessionData = null;
    localStorage.setItem(MULTI_ACCOUNT_KEY, JSON.stringify(accounts));
    await syncToIndexedDB(MULTI_ACCOUNT_KEY, accounts);
  }
};

export const restoreAccountsFromIndexedDB = async () => {
  const accounts = await restoreFromIndexedDB(MULTI_ACCOUNT_KEY, true);
  return Array.isArray(accounts) ? (accounts as SavedAccount[]) : [];
};

export const clearSessionForNewAccount = async () => {
  // Zachowujemy obecny stan uzytkownika przed wylogowaniem lokalnym
  await saveCurrentAccount();

  localStorage.removeItem(GOTRUE_KEY);
  await syncToIndexedDB(GOTRUE_KEY, null);
  await removeTasksData();
  closeAblyConnection();
  window.location.reload();
};
