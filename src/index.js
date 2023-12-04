import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from 'styled-components';
import { Provider } from "react-redux"
import theme from './theme';
import GlobalStyle from './GlobalStyle';
import store from './store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
   <React.StrictMode>
      <Provider store={store}>
         <ThemeProvider theme={theme}>
            <GlobalStyle />
            <App />
         </ThemeProvider>
      </Provider>
   </React.StrictMode>
);

reportWebVitals();