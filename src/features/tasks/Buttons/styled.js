import styled from "styled-components";

export const ButtonsContainer = styled.div`
   display: block;
`;

export const Button = styled.button`
   border: none;
   color: ${({ theme }) => theme.color.teal};
   font-size: 16px;
   background: transparent;
   margin: 0 0 0 20px;
   padding: 0;
   transition: filter 0.8s;

   @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}px) {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 15px 0;
      padding-top: 10px;
   }

   &:hover {
      cursor: pointer;
      filter: brightness(110%);
   }

   &:active {
      filter: brightness(120%);
   }

   &:disabled {
      color: ${({ theme }) => theme.color.silver};
   } 
`;