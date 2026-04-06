import { ReactElement, ReactNode } from "react";
import { StyledSection, SectionHeader, SectionBody, BodyWrapper } from "./styled";

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
        hidden={bodyHidden}
        $onlyOpenButton={onlyOpenButton}
        onClick={onHeaderClick}
        $taskDetails={taskDetails}
      >
        {title}
        {extraHeaderContent}
      </SectionHeader>
    )}
    <SectionBody hidden={bodyHidden} $taskList={taskList}>
      <div>
        <BodyWrapper $taskList={taskList}>
          {body}
          {extraContent}
        </BodyWrapper>
      </div>
    </SectionBody>
  </StyledSection>
);
