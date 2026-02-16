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

const StyledNavLink = styled.span<{ $inactive?: boolean; $width?: number; $isActive?: boolean }>`
  text-decoration: none;
  color: ${({ theme }: { theme: DefaultTheme }) => theme.colors.nav.text};
  transition: color 0.2s ease-in-out;
  width: ${({ $width }) => ($width ? `${$width}px` : "auto")};
  display: inline-block;
  text-align: center;
  font-weight: ${({ theme, $isActive, $inactive }) =>
    $isActive ? theme.fontWeight.bold : $inactive ? theme.fontWeight.normal : theme.fontWeight.normal};

  &:hover {
    text-decoration: underline;
    text-underline-offset: 5px;
  }
`;

export const AutoMinWidthNavLink: React.FC<AutoMinWidthNavLinkProps> = ({
  children,
  text,
  $inactive,
  className,
  ...props
}) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState<number | undefined>(undefined);

  useLayoutEffect(() => {
    if (spanRef.current) {
      setWidth(spanRef.current.getBoundingClientRect().width);
    }
  }, [text]);

  return (
    <NavLink {...props} className={className}>
      {({ isActive }) => (
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
          <StyledNavLink $inactive={$inactive} $width={width} $isActive={isActive} className={className}>
            {children}
          </StyledNavLink>
        </>
      )}
    </NavLink>
  );
};
