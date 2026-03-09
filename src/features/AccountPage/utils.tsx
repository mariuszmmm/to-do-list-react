import { Fragment } from "react";

export const formatEmailWithBreaks = (email: string) => {
  return email.split(/([.@])/).map((part, index) => (
    <Fragment key={index}>
      {part}
      {(part === "." || part === "@") && <wbr />}
    </Fragment>
  ));
};
