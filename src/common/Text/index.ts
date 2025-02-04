import styled, { css } from "styled-components";

interface TextProps {
  $error?: boolean;
  $loading?: boolean;
}

const Text = styled.p<TextProps>`
  line-height: 1.6;

  ${({ $error }) =>
    $error &&
    css`
      color: red;
    `}

  ${({ $loading }) =>
    $loading &&
    css`
      color: ${({ theme }) => theme.color.silver};
    `}
`;

export default Text;
