import styled, { css } from "styled-components";

interface FormButtonWrapperProps {
  $taskDetails?: boolean;
}

export const FormButtonWrapper = styled.div<FormButtonWrapperProps>`
  display: flex;
  flex-direction: column;
  gap: 10px;

  ${({ $taskDetails }) =>
    $taskDetails &&
    css`
      margin-top: 60px;
      align-items: flex-end;
    `}

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMid}) {
    flex-direction: row;
  }
`;
