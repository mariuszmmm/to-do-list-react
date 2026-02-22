import { useTranslation } from "react-i18next";
import {
  TopBorderSection,
  SectionTitle,
  StatusDot,
  StatsGrid,
  DiagnosisKey,
  DiagnosisValue,
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
        <div>
          <DiagnosisKey>{`${t("ably.labels.status")}:`}</DiagnosisKey>
          <DiagnosisValue
            $isSuccess={ablyStatus === "connected"}
            style={{
              marginLeft: "8px",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <>
              <StatusDot
                $color={ablyStatus === "connected" ? "#52c41a" : "#faad14"}
              />
              {t(`ablyStatus.${ablyStatus}`, ablyStatus)}
            </>
          </DiagnosisValue>
        </div>
        <div>
          <DiagnosisKey>{`${t("ably.labels.channel")}:`}</DiagnosisKey>
          <DiagnosisValue $isSuccess={true} style={{ marginLeft: "8px" }}>
            system:logs
          </DiagnosisValue>
        </div>
        <div>
          <DiagnosisKey>{`${t("ably.labels.deviceId")}:`}</DiagnosisKey>
          <DiagnosisValue $isSuccess={true} style={{ marginLeft: "8px" }}>
            {ablyInfo.deviceId || "---"}
          </DiagnosisValue>
        </div>
        <div>
          <DiagnosisKey>{`${t("ably.labels.connectionId")}:`}</DiagnosisKey>
          <DiagnosisValue $isSuccess={true} style={{ marginLeft: "8px" }}>
            {ablyInfo.connectionId || "---"}
          </DiagnosisValue>
        </div>
      </StatsGrid>
    </TopBorderSection>
  );
};
