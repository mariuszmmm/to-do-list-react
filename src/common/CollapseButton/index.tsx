import styled from "styled-components";

export const CollapseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-left: 12px;
  padding: 0;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.color.teal};
  font-size: 20px;
  line-height: 1;
  transition: color 0.2s ease, filter 0.2s ease;

  &:hover {
    cursor: pointer;
    filter: brightness(110%);
  }

  &:active {
    filter: brightness(125%);
  }
`;

export const CollapseIcon = styled.span<{ $open: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  position: relative;

  &::before {
    content: "";
    display: block;
    width: 8px;
    height: 8px;
    border: 2px solid currentColor;
    border-top: 0;
    border-left: 0;
    transform: ${({ $open }) => ($open ? "rotate(225deg)" : "rotate(45deg)")};
    transition: transform 0.2s ease;
  }
`;
