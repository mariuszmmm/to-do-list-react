import styled, { DefaultTheme } from "styled-components";
import { StyledSpan } from "../StyledList";

export const FieldDescription = styled(StyledSpan)`
  font-size: 0.8rem;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.color.empress};
  margin-left: -3px;
`;
