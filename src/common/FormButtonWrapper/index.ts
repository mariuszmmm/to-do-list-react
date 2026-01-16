import styled, { css } from "styled-components";

interface FormButtonWrapperProps {
  $taskDetails?: boolean;
  $taskImage?: boolean;
}

export const FormButtonWrapper = styled.div<FormButtonWrapperProps>`
  display: flex;
  flex-direction: column;
  gap: 10px;

  ${({ $taskDetails }) =>
    $taskDetails &&
    css`
      margin-top: 50px;
      align-items: flex-end;
    `}

  ${({ $taskImage }) =>
    $taskImage &&
    css`
      display: grid;
      flex-direction: column;

      button {
        justify-self: end;
      }
    `}

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMid}) {
    flex-direction: row;
  }
`;
