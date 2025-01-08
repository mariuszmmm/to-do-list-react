import { StyledSection, Header, SectionBody } from "./styled";

const Section = ({ title, body, extraHeaderContent, hidden }) => (
  <StyledSection>
    <Header>
      {title}
      {extraHeaderContent}
    </Header>
    <SectionBody hidden={hidden}>
      {body}
    </SectionBody>
  </StyledSection>
);

export default Section;