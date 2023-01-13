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
   background-color: #eee;
}
`;

export default GlobalStyle;