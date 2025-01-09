import styled from "styled-components";

export const ContainerDate = styled.div`
   display: flex;
   justify-content: flex-end;
   column-gap: 10px;
`;

export const Date = styled.span`
   font-family: 'Roboto Mono', monospace;
   font-size: 14px;
   margin: 0;
   text-align: right;
   color: ${({ theme }) => theme.color.black};

   @media (max-width: ${({ theme }) => theme.breakpoint.mobileMid}) {
      ${({ description }) => description && "display: none;"}
   }
`;