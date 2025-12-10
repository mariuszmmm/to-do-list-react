import { ReactElement, ReactNode } from "react";
import { StyledSection, SectionHeader, SectionBody } from "./styled";

interface SectionProps {
  title?: string | ReactElement;
  body: ReactNode;
  extraHeaderContent?: ReactElement;
  extraContent?: ReactElement;
  bodyHidden?: boolean;
  onlyOpenButton?: boolean;
  onHeaderClick?: () => void;
}

export const Section = ({
  title,
  body,
  extraHeaderContent,
  extraContent,
  bodyHidden,
  onlyOpenButton,
  onHeaderClick,
}: SectionProps) => (
  <StyledSection>
    {title && (
      <SectionHeader
        $bodyHidden={bodyHidden}
        $onlyOpenButton={onlyOpenButton}
        onClick={onHeaderClick}
      >
        {title}
        {extraHeaderContent}
      </SectionHeader>
    )}
    <SectionBody hidden={bodyHidden}>
      {body}
      {extraContent}
    </SectionBody>
  </StyledSection>
);
