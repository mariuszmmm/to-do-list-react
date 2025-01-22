import styled, { css } from "styled-components";

interface FormProps {
  $singleInput?: boolean;
  $noInputs?: boolean;
}

export const Form = styled.form<FormProps>`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  grid-gap: 20px;

  ${({ $singleInput }) =>
    $singleInput &&
    css`
      grid-template-columns: 1fr auto;
    `};

  ${({ $noInputs }) =>
    $noInputs &&
    css`
      grid-template-columns: 1fr;
    `};

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}) {
    grid-template-columns: 1fr 1fr;

    ${({ $singleInput }) =>
      $singleInput &&
      css`
        grid-template-columns: 1fr auto;
      `};
  }

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMid}) {
    grid-template-columns: 1fr;
  }
`;
