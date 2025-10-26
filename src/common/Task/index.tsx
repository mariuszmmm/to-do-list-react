import styled, { css } from "styled-components";

export const Task = styled.span<{ $done?: boolean, $ListName?: boolean }>`
  padding-left: 2px;
  white-space: pre-line;

  ${({ $done }) =>
    $done &&
    css`
      text-decoration: 1px line-through black;
    `};

  ${({ $ListName }) =>
    $ListName &&
    css`
      font-weight: bold  ;
    `}
`;