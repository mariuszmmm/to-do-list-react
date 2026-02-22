import { useTranslation } from "react-i18next";
import { StyledSpan } from "../../../../common/StyledList";
import {
  TopBorderSection,
  SectionTitle,
  StatsGrid,
  DiagnosisKey,
  DiagnosisValue,
  DiagnosisDetails,
  ActionButton,
  FlexColumnStartContainer,
  StatsRow,
} from "../styled";

interface DiagnosisSectionProps {
  diagnosis: any;
  loading: boolean;
  message?: { text: string; isError: boolean } | null;
  onRunDiagnosis: () => void;
}

export const DiagnosisSection = ({
  diagnosis,
  loading,
  message,
  onRunDiagnosis,
}: DiagnosisSectionProps) => {
  const { t } = useTranslation("translation", {
    keyPrefix: "accountPage.systemAdmin",
  });

  return (
    <TopBorderSection>
      <SectionTitle>{t("diagnosis.title", "System Diagnosis")}</SectionTitle>
      {diagnosis && (
        <StatsGrid>
          {Object.entries(diagnosis).map(([key, value]: [string, any]) => (
            <div key={key}>
              <StatsRow>
                <DiagnosisKey>{key}:</DiagnosisKey>
                <DiagnosisValue $isSuccess={value.status === "success"}>
                  {value.status === "success"
                    ? "✓ OK"
                    : `✗ ${t("diagnosis.error", "Error")}`}
                </DiagnosisValue>
              </StatsRow>
              {value.status !== "success" && value.details && (
                <DiagnosisDetails>{value.details}</DiagnosisDetails>
              )}
            </div>
          ))}
        </StatsGrid>
      )}
      <FlexColumnStartContainer>
        <ActionButton onClick={onRunDiagnosis} disabled={loading}>
          {loading ? t("diagnosis.running") : t("diagnosis.runButton")}
        </ActionButton>
        {message && (
          <StyledSpan $error={message.isError}>{message.text}</StyledSpan>
        )}
      </FlexColumnStartContainer>
    </TopBorderSection>
  );
};
