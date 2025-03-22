import { ReactElement, ReactNode } from "react";
import { StyledSection, SectionHeader, SectionBody } from "./styled";

interface SectionProps {
  title: string | ReactElement;
  body: ReactNode;
  extraHeaderContent?: ReactElement;
  extraContent?: ReactElement;
  bodyHidden?: boolean;
}

export const Section = ({
  title,
  body,
  extraHeaderContent,
  extraContent,
  bodyHidden,
}: SectionProps) => (
  <StyledSection>
    <SectionHeader $bodyHidden={bodyHidden}>
      {title}
      {extraHeaderContent}
    </SectionHeader>
    <SectionBody hidden={bodyHidden}>
      {body}
      {extraContent}
    </SectionBody>
  </StyledSection>
);
