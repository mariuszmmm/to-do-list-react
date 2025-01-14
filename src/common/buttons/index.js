import styled from "styled-components";

export const Button = styled.button`
  border: none;
  color: ${({ theme }) => theme.color.white};
  width: 30px;
  height: 30px;
  padding: 0;
  font-size: 20px;
  transition: filter 0.25s;
  user-select: none;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMin}) {
    grid-row: 2 / 3;
    grid-column: span 2;
  }
   
  &:hover {
    cursor: pointer;
    filter: brightness(110%);
  }

  &:active {
    filter: brightness(120%);
  }

  &:disabled {
    cursor: default;
    opacity: 0.5;
  }
`;

export const ToggleButton = styled(Button)`
  background: ${({ theme }) => theme.color.forestGreen};
`;

export const EditButton = styled(Button)`
  background: ${({ theme }) => theme.color.empress};
`;

export const RemoveButton = styled(Button)`
  background: ${({ theme }) => theme.color.crimson};
`;