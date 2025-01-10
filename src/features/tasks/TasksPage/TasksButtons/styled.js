import styled from "styled-components";
import { ReactComponent as rotate } from "../../../../images/rotate.svg";

export const Undo = styled(rotate)`
  width: 1rem;
  margin-top: 2px;
`;

export const Redo = styled(rotate)`
  width: 1rem;
  transform: scaleX(-1);
  margin-top: 2px;
`;