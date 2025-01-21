import styled, { css } from "styled-components";

interface DateProps {
  $description?: boolean;
}

export const DateContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  column-gap: 10px;
`;

export const Date = styled.span<DateProps>`
  font-family: "Roboto Mono", monospace;
  font-size: 14px;
  margin: 0;
  text-align: right;
  color: ${({ theme }) => theme.color.black};

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMid}) {
    ${({ $description }) =>
      $description &&
      css`
        display: none;
      `};
  }
`;
