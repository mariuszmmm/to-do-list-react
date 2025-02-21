import styled, { css } from "styled-components";

interface InfoProps {
  $warning?: boolean;
}

export const Info = styled.p<InfoProps>`
  min-height: 1rem;
  margin: 0;

  ${({ $warning }) =>
    $warning &&
    css`
      color: ${({ theme }) => theme.color.red};
    `};
`;
