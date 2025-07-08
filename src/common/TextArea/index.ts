import styled from "styled-components";
import { Input } from "../Input";

export const TextArea = styled(Input).attrs({ as: "textarea" })`
  resize: none;
  min-width: 100%;
  min-height: 200px;
  padding: 10px;
`;