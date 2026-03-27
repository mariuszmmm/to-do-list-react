import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
    background-color: ${({ theme }) => theme.colors.backgroundPrimary};
    color: ${({ theme }) => theme.colors.textPrimary};
    color-scheme: ${({ theme }) => (theme.colors.textPrimary === "#151515ff" ? "light" : "dark")};
    overscroll-behavior: none;
    height: 100%;
    overflow: hidden;
  }

  *, ::after, ::before {
    box-sizing: inherit;
  }

  body {
    font-family: 'Montserrat', sans-serif;
    color: ${({ theme }) => theme.colors.textPrimary};
    background-color: ${({ theme }) => theme.colors.backgroundPrimary};
    min-width: 360px;
    font-size: 1rem;
    transition: background-color 0.5s ease-in-out;
    min-height: 100dvh;
    overscroll-behavior: none;  
    margin: 0;
    overflow: hidden;
  }

  #root {
    position: absolute;
    top: 50px;
    left: 0;
    width: 100vw;
    bottom: 0;
    overflow-y: scroll;
    overflow-x: hidden;
    scrollbar-width: thin;
    scrollbar-color: ${({ theme }) => theme.colors.scrollbar.primary} transparent;
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  
  ::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.scrollbar.primary};
    border-radius: 4px;
  }
`;

export default GlobalStyle;
