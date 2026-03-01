import styled, { css } from "styled-components";

interface InfoProps {
  $warning?: boolean;
  $ellipsis?: boolean;
  $secondary?: boolean;
}

export const Info = styled.p<InfoProps>`
  min-height: 1rem;
  margin: 0;
  white-space: pre-line;

  ${({ $warning }) =>
    $warning &&
    css`
      color: ${({ theme }) => theme.colors.status.error};
    `};

  ${({ $ellipsis }) =>
    $ellipsis &&
    css`
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `};

  ${({ $secondary }) =>
    $secondary &&
    css`
      color: ${({ theme }) => theme.colors.textSecendary};
      font-size: 0.9em;
    `};
`;
