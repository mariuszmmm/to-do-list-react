import styled from "styled-components";
import { FormButton } from "../FormButton";

export const PaginationContainer = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
`;

export const PaginationButton = styled(FormButton)<{ $cancel?: boolean }>`
  padding: 10px 16px;
  min-width: 110px;
  height: 42px;
  margin: 0;
`;

export const ArrowIcon = styled.span<{ $left?: boolean }>`
  display: inline-block;
  margin: 0 6px;
  transform: ${({ $left }) => ($left ? "rotate(180deg)" : "none")};
`;
