import styled from "styled-components";

export const ButtonsContainer = styled.div`
display: block;
`;

export const Button = styled.button`
   border: solid 1px rgb(255, 255, 255);
   color: hsl(180 100% 25%);
   font-size: 16px;
   background-color: transparent;
   margin-left: 20px;
   padding: 0;
   transition: 250ms;

   @media (max-width: 767px) {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 15px 0;
      padding-top: 10px;
   }

   &:hover {
      cursor: pointer;
      color: hsl(180 100% 30%);
   }

   &:active {
      color: hsl(180 100% 35%);
   }

   &:disabled {
      color: #ddd;
   } 
`;