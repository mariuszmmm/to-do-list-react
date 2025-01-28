import styled, { css } from "styled-components";

interface TextProps {
  $error?: boolean;
  disabled?: boolean;
}

const Text = styled.p<TextProps>`
  line-height: 1.6;

  ${({ $error }) =>
    $error &&
    css`
      color: red;
    `}

  ${({ disabled }) =>
    disabled &&
    css`
      color: ${({ theme }) => theme.color.silver};
    `}
`;

export default Text;
