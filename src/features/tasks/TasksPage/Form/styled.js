import styled from "styled-components";

export const StyledForm = styled.form`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-gap: 20px;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}) {
    grid-template-columns: 1fr;
  }
`;

export const Button = styled.button`
  padding: 10px;
  background: ${({ theme }) => theme.color.teal};
  color: ${({ theme }) => theme.color.white};
  border: none;
  transition: 0.25s;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}) {
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