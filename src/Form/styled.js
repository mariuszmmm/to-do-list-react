import styled from "styled-components";

export const Container = styled.form`
   display: grid;
   grid-template-columns: 1fr auto;
   grid-gap: 20px;

   @media (max-width: 767px) {
      grid-template-columns: 1fr;
   }
`;

export const Input = styled.input`
    padding: 10px;
    border: 1px solid #ddd;
    min-width: 200px;
    border-radius: 5px;
`;

export const Button = styled.button`
   padding: 10px;
   background-color: hsl(180, 100%, 25%);
   color: white;
   border: none;
   transition: 250ms;

   @media (max-width: 767px) {
      background-color: hsl(180, 100%, 30%);
      transform: scale(1.02, 1.04);
   }

   &:hover {
      cursor: pointer;
      background-color: hsl(180, 100%, 30%);
      transform: scale(1.08);
   }

   &:active {
      background-color: hsl(180, 100%, 35%);
   }
`;