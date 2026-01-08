import i18n from "./utils/i18n";
import { setInputAutoFocusFlagIfRoot } from "./utils/setFirstLoadFlagIfRoot";
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
import { handleAuthTokensFromUrl } from "./utils/getTokenFromURL";
import { handleGoogleOAuthCodeFromUrl } from "./utils/getGoogleOAuthCode";
import { useAppSelector } from "./hooks";
import { selectIsDarkTheme } from "./common/ThemeSwitch/themeSlice";

handleAuthTokensFromUrl();
handleGoogleOAuthCodeFromUrl();
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
          <TimeProvider>
            {children}
          </TimeProvider>
        </QueryClientProvider>
      </I18nextProvider>
    </ThemeProvider>
  )
};

root.render(
  process.env.NODE_ENV === "development" ? (
    // <React.StrictMode>
    <Provider store={store}>
      <AppProviders>
        <App />
      </AppProviders>
    </Provider>
    // </React.StrictMode>
  ) : (
    <Provider store={store}>
      <AppProviders>
        <App />
      </AppProviders>
    </Provider>
  )
);
