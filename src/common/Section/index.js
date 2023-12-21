import { StyledSection, Header, SectionBody } from "./styled";

const Section = ({ title, body, extraHeaderContent }) => (
  <StyledSection>
    <Header>
      {title}
      {extraHeaderContent}
    </Header>
    <SectionBody>
      {body}
    </SectionBody>
  </StyledSection>
);

export default Section;