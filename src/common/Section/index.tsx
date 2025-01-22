import { ReactElement, ReactNode } from "react";
import { StyledSection, SectionHeader, SectionBody } from "./styled";

interface SectionProps {
  title: string | ReactElement;
  body: ReactNode;
  extraHeaderContent?: ReactElement;
  extraContent?: ReactElement;
  hidden?: boolean;
}

export const Section = ({
  title,
  body,
  extraHeaderContent,
  extraContent,
  hidden,
}: SectionProps) => (
  <StyledSection>
    <SectionHeader>
      {title}
      {extraHeaderContent}
    </SectionHeader>
    <SectionBody hidden={hidden}>
      {body}
      {extraContent}
    </SectionBody>
  </StyledSection>
);
