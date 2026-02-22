import { useTranslation } from "react-i18next";
import {
  TopBorderSection,
  SectionTitle,
  StatusDot,
  StatsGrid,
  DiagnosisKey,
  DiagnosisValue,
  StatsRow,
} from "../styled";

interface AblySectionProps {
  ablyStatus: string;
  ablyInfo: {
    connectionId?: string;
    deviceId?: string;
  };
}

export const AblySection = ({ ablyStatus, ablyInfo }: AblySectionProps) => {
  const { t } = useTranslation("translation", {
    keyPrefix: "accountPage.systemAdmin",
  });

  return (
    <TopBorderSection>
      <SectionTitle>{t("ably.title")}</SectionTitle>
      <StatsGrid>
        <StatsRow>
          <DiagnosisKey>{`${t("ably.labels.status")}:`}</DiagnosisKey>
          <DiagnosisValue $isSuccess={ablyStatus === "connected"}>
            <>
              <StatusDot
                $color={ablyStatus === "connected" ? "#52c41a" : "#faad14"}
              />
              {t(`ablyStatus.${ablyStatus}`, ablyStatus)}
            </>
          </DiagnosisValue>
        </StatsRow>
        <StatsRow>
          <DiagnosisKey>{`${t("ably.labels.channel")}:`}</DiagnosisKey>
          <DiagnosisValue $isSuccess={true}>system:logs</DiagnosisValue>
        </StatsRow>
        <StatsRow>
          <DiagnosisKey>{`${t("ably.labels.deviceId")}:`}</DiagnosisKey>
          <DiagnosisValue $isSuccess={true}>
            {ablyInfo.deviceId || "---"}
          </DiagnosisValue>
        </StatsRow>
        <StatsRow>
          <DiagnosisKey>{`${t("ably.labels.connectionId")}:`}</DiagnosisKey>
          <DiagnosisValue $isSuccess={true}>
            {ablyInfo.connectionId || "---"}
          </DiagnosisValue>
        </StatsRow>
      </StatsGrid>
    </TopBorderSection>
  );
};
