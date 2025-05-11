import styled from "styled-components";
import { Input } from "../../../common/Input";

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  margin: 0 0 50px;
  text-align: left;
  width: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoint.mobileMid}) {
    margin: 0 0 30px;
  }
`;

export const Textarea = styled(Input).attrs({ as: "textarea" })`
  resize: none;
  min-width: 100%;
  min-height: 200px;
  padding: 10px;
`;
