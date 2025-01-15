import styled, { css } from "styled-components";

export default styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: right;
  align-items: start;
  align-content: flex-start;
  row-gap: 15px;

  ${({ sub }) => sub && css`
    margin-top: 0;
  `};

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMax}) {
    margin-top: 10px;

    ${({ sub }) => sub && css`
    margin-top: 0;
  `};
  };

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMid}) {
    justify-content: center;
  };
`;