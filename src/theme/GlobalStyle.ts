import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
  }

  *, ::after, ::before {
    box-sizing: inherit;
  }

  body {
    font-family: 'Montserrat', sans-serif;
    background: ${({ theme }) => theme.color.gallery};
    min-width: 300px;
    overflow-y: scroll;
    font-size: 1rem;
  }
`;

export default GlobalStyle;
