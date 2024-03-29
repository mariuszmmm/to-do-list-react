import styled from "styled-components";

export const StyledSection = styled.section`
  margin: 10px 0;
  background: ${({ theme }) => theme.color.white};
  box-shadow: 0 0 5px ${({ theme }) => theme.color.alto};;
`;

export const Header = styled.h2`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  font-size: 20px;
  padding: 20px;
  margin: 0;
  border-bottom: 1px solid ${({ theme }) => theme.color.alto};
  word-break: break-word;


  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}) {
    flex-direction: column;
    padding-bottom: 10px;
  }
`;

export const SectionBody = styled.div`
  padding: 20px;

  p {
    margin: 0 10px;
  }
`;