import styled from "styled-components";

export const Text = styled.p`
  line-height: 1.6;
  margin: 0 0 1rem;

  @media (min-width: ${(props) => props.theme.breakpoint.mobileMax}) {
    text-align: justify;
  }
`;
