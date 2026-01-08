import styled from "styled-components";
import { StyledSpan } from "../StyledList";

export const FieldDescription = styled(StyledSpan)`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecendary};
  margin-left: -3px;
`;
