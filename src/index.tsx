import i18n from "./utils/i18n";
import "./utils/debug/consoleLogger";
import { setInputAutoFocusFlagIfRoot } from "./utils/navigation/setFirstLoadFlagIfRoot";
import { I18nextProvider } from "react-i18next";
import React from "react";
import ReactDOM from "react-dom/client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "react-redux";
import { store } from "./store";
import { ThemeProvider } from "styled-components";
import { themeDark, themeLight } from "./theme/theme";
import { Normalize } from "styled-normalize";
import GlobalStyle from "./theme/GlobalStyle";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { TimeProvider } from "./context/TimeContext";
import { handleAuthTokensFromUrl } from "./utils/auth/getTokenFromURL";
import { handleGoogleOAuthCodeFromUrl } from "./utils/googleDrive/getGoogleOAuthCode";
import { useAppSelector } from "./hooks";
import { selectIsDarkTheme } from "./common/ThemeSwitch/themeSlice";
import { restoreFromIndexedDB } from "./utils/storage/storageSync";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

// Obsługa tokenów uwierzytelniających i kodów OAuth z adresu URL (np. po powrocie z logowania Google)
console.log("Aplikacja startuje..."); // Inicjalizacja pierwszej linii logów
handleAuthTokensFromUrl();
handleGoogleOAuthCodeFromUrl();

// Ustawienie flagi dla automatycznego fokusu na inputach przy starcie (jeśli jesteśmy na stronie głównej)
setInputAutoFocusFlagIfRoot();

const root = ReactDOM.createRoot(document.getElementById("root")!);
const queryClient = new QueryClient();

const AppProviders = ({ children }: { children: React.ReactNode }) => {
  const isDarkTheme = useAppSelector(selectIsDarkTheme);

  return (
    <ThemeProvider theme={isDarkTheme ? themeDark : themeLight}>
      <I18nextProvider i18n={i18n}>
        <Normalize />
        <GlobalStyle />
        <QueryClientProvider client={queryClient}>
          {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
          <TimeProvider>{children}</TimeProvider>
        </QueryClientProvider>
      </I18nextProvider>
    </ThemeProvider>
  );
};

/**
 * Główna funkcja inicjalizująca aplikację.
 * Zawiera krytyczną logikę odzyskiwania danych z IndexedDB przed renderowaniem Reacta,
 * co zapobiega utracie sesji po odświeżeniu lub w trybie PWA.
 */
const initApp = async () => {
  const savedAccounts = localStorage.getItem("saved_accounts");
  const gotrueUser = localStorage.getItem("gotrue.user");

  /**
   * Jeśli w localStorage brakuje kluczowych danych (np. użytkownika lub kont),
   * próbujemy je przywrócić z IndexedDB (magazyn o większej trwałości).
   */
  if (!savedAccounts || !gotrueUser) {
    const keysToRestore = [
      "saved_accounts",
      "gotrue.user",
      "settings",
      "archivedLists",
      "autoRefreshEnabled",
      "tasks",
      "taskListMetaData",
    ];

    for (const key of keysToRestore) {
      await restoreFromIndexedDB(key, true);
    }
  }

  // Renderowanie głównego drzewa komponentów
  root.render(
    process.env.NODE_ENV === "development" ? (
      <>
        <React.StrictMode>
          <Provider store={store}>
            <AppProviders>
              <App />
            </AppProviders>
          </Provider>
        </React.StrictMode>
      </>
    ) : (
      <Provider store={store}>
        <AppProviders>
          <App />
        </AppProviders>
      </Provider>
    ),
  );

  // Opcjonalna rejestracja Service Workera dla funkcjonalności offline i instalacji jako PWA
  serviceWorkerRegistration.register();
};

initApp();
