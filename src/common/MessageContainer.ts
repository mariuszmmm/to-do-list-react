import styled from "styled-components";

export const MessageContainer = styled.div`
  min-height: ${({ children }) => (children ? "50px" : "0")};
  margin-bottom: ${({ children }) => (children ? "10px" : "0")};
  display: flex;
  align-items: center;
  transition: min-height 0.2s ease, margin-bottom 0.2s ease;
`;
