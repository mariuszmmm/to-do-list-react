import styled from "styled-components";
import { Input } from "../Input";

export const TextArea = styled(Input).attrs({ as: "textarea" })`
  resize: none;
  min-width: 100%;
  min-height: 200px;
  padding: 10px;
  padding-right: 2.5rem;
  scrollbar-width: thin;
  scrollbar-color: #ccc #f5f5f5;
`;
