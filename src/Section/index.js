import { StyledSection, Header, Body } from "./styled";

const Section = ({ title, body, extraHeaderContent }) => (
   <StyledSection>
      <Header>
         {title}
         {extraHeaderContent}
      </Header>
      <Body>
         {body}
      </Body>
   </StyledSection>
);

export default Section;