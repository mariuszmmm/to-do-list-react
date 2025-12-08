import i18n from "./utils/i18n";
import { I18nextProvider } from "react-i18next";
import React from "react";
import ReactDOM from "react-dom/client";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "react-redux";
import { store } from "./store";
import { ThemeProvider } from "styled-components";
import { theme } from "./theme/theme";
import { Normalize } from "styled-normalize";
import GlobalStyle from "./theme/GlobalStyle";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { getTokenFromURL } from "./utils/getTokenFromURL";

const currentUrl = window.location.href;
getTokenFromURL(currentUrl);

const root = ReactDOM.createRoot(document.getElementById("root")!);
const queryClient = new QueryClient();

const AppProviders = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <I18nextProvider i18n={i18n}>
        <Normalize />
        <GlobalStyle />
        <QueryClientProvider client={queryClient}>
          {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
          {children}
        </QueryClientProvider>
      </I18nextProvider>
    </ThemeProvider>
  </Provider>
);

root.render(
  // process.env.NODE_ENV === "development" ? (
  //   <React.StrictMode>
  //     <AppProviders>
  //       <App />
  //     </AppProviders>
  //   </React.StrictMode>
  // ) : (
  <AppProviders>
    <App />
  </AppProviders>
  // )
);
