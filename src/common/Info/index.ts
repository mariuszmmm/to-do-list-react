import styled, { css } from "styled-components";

interface InfoProps {
  $warning?: boolean;
  $loading?: boolean;
}

export const Info = styled.p<InfoProps>`
  min-height: 1rem;
  margin: 0;

  ${({ $loading }) =>
    $loading &&
    css`
      color: ${({ theme }) => theme.color.silver};
    `};

  ${({ $warning }) =>
    $warning &&
    css`
      color: ${({ theme }) => theme.color.red};
    `};
`;
