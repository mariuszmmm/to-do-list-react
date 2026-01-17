
import React, { useRef, useLayoutEffect, useState } from "react";
import { NavLink, NavLinkProps } from "react-router-dom";
import styled, { DefaultTheme } from "styled-components";

import { ReactNode } from "react";

interface AutoMinWidthNavLinkProps extends NavLinkProps {
  children: ReactNode;
  text?: string;
  $inactive?: boolean;
  className?: string;
}

const StyledNavLink = styled(NavLink) <{ $inactive?: boolean; $width?: number }>`
  text-decoration: none;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.nav.text};
  transition: color 0.2s ease-in-out;
  width: ${({ $width }) => ($width ? `${$width}px` : "auto")};
  display: inline-block;

  &:hover {
    text-decoration: underline;
    text-underline-offset: 5px;
  }

  &.active {
    font-weight: ${({ theme }: { theme: DefaultTheme }) => theme.fontWeight.bold};
    ${({ $inactive }) =>
    $inactive &&
    `font-weight: ${({ theme }: { theme: DefaultTheme }) => theme.fontWeight.normal};`}
  }
`;

export const AutoMinWidthNavLink: React.FC<AutoMinWidthNavLinkProps> = ({ children, text, $inactive, className, ...props }) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState<number | undefined>(undefined);

  useLayoutEffect(() => {
    if (spanRef.current) {
      setWidth(spanRef.current.getBoundingClientRect().width);
    }
  }, [text]);

  return (
    <>
      <span
        ref={spanRef}
        style={{
          position: "absolute",
          visibility: "hidden",
          fontWeight: "bold",
          fontFamily: "inherit",
          fontSize: "inherit",
          letterSpacing: "inherit",
          textTransform: "inherit",
          whiteSpace: "pre",
          pointerEvents: "none",
        }}
      >
        {text}
      </span>
      <StyledNavLink $inactive={$inactive} $width={width} className={className} {...props}>
        {children}
      </StyledNavLink>
    </>
  );
};
