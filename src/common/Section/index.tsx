import { ReactElement, ReactNode } from "react";
import { StyledSection, SectionHeader, SectionBody } from "./styled";

interface SectionProps {
  title: string | ReactElement;
  body: ReactNode;
  extraHeaderContent?: ReactNode;
  hidden?: boolean;
}

const Section = ({ title, body, extraHeaderContent, hidden }: SectionProps) => (
  <StyledSection>
    <SectionHeader>
      {title}
      {extraHeaderContent}
    </SectionHeader>
    <SectionBody hidden={hidden}>{body}</SectionBody>
  </StyledSection>
);

export default Section;
