import styled from "styled-components";

export const H1 = styled.h1`
  line-height: 1.4;
`;

export const H2 = styled.h2<{ $sub2: boolean }>`
  line-height: 1.4;
  ${({ $sub2 }) => $sub2 && `margin-top: 4px;`}
`;
