import styled from "styled-components";

export const Container = styled.form`
   display: grid;
   grid-template-columns: 1fr auto;
   grid-gap: 20px;

   @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}px) {
      grid-template-columns: 1fr;
   }
`;

export const Input = styled.input`
    padding: 10px;
    border: 1px solid ${({ theme }) => theme.color.alto};
    min-width: 200px;
    border-radius: 5px;
`;

export const Button = styled.button`
   padding: 10px;
   background: ${({ theme }) => theme.color.teal};
   color: ${({ theme }) => theme.color.white};
   border: none;
   transition: 0.25s;

   @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}px) {
      background-color: ${({ theme }) => theme.color.teal};
      transform: scale(1.02);
   }

   &:hover {
      cursor: pointer;
      filter: brightness(110%);
      transform: scale(1.04);
   }

   &:active {
      filter: brightness(120%);
   }
`;