import { ReactElement, ReactNode } from "react";
import { StyledSection, SectionHeader, SectionBody } from "./styled";

interface SectionProps {
  title?: string | ReactElement;
  body: ReactNode;
  extraHeaderContent?: ReactElement;
  extraContent?: ReactElement;
  bodyHidden?: boolean;
  onlyOpenButton?: boolean;
  taskDetails?: boolean;
  taskList?: boolean;
  onHeaderClick?: () => void;
}

export const Section = ({
  title,
  body,
  extraHeaderContent,
  extraContent,
  bodyHidden,
  onlyOpenButton,
  taskDetails,
  taskList,
  onHeaderClick,
}: SectionProps) => (
  <StyledSection>
    {title && (
      <SectionHeader
        $bodyHidden={bodyHidden}
        $onlyOpenButton={onlyOpenButton}
        onClick={onHeaderClick}
        $taskDetails={taskDetails}
      >
        {title}
        {extraHeaderContent}
      </SectionHeader>
    )}
    <SectionBody hidden={bodyHidden} $taskList={taskList}>
      {body}
      {extraContent}
    </SectionBody>
  </StyledSection>
);
