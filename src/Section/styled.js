import styled from "styled-components";

export const StyledSection = styled.section`
   margin: 10px 0;
   background: white;
   box-shadow: 0 0 5px #ddd;
`;

export const Header = styled.h2`
   display: flex;
   flex-direction: row;
   justify-content: space-between;
   font-size: 20px;
   padding: 20px;
   margin: 0;
   border-bottom: 1px solid #ddd;

   @media (max-width: 767px) {
      flex-direction: column;
      padding-bottom: 10px;
   }
`;

export const Body = styled.div`
   padding: 20px;
`;