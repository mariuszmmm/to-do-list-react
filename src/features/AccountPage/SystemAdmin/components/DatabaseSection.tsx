import { useTranslation } from "react-i18next";
import {
  TopBorderSection,
  SectionTitle,
  ProgressBarLabel,
  ProgressBarTrack,
  ProgressBarFill,
  StatsGrid,
  DiagnosisKey,
  DiagnosisValue,
} from "../styled";

interface DatabaseSectionProps {
  stats: any;
}

export const DatabaseSection = ({ stats }: DatabaseSectionProps) => {
  const { t } = useTranslation("translation", {
    keyPrefix: "accountPage.systemAdmin",
  });

  return (
    <TopBorderSection>
      <SectionTitle>{t("database.title")}</SectionTitle>

      <StatsGrid style={{ marginBottom: "20px" }}>
        <div>
          <DiagnosisKey>{`${t("database.labels.users")}:`}</DiagnosisKey>
          <DiagnosisValue $isSuccess={true} style={{ marginLeft: "8px" }}>
            {stats?.totalUsers || 0}
          </DiagnosisValue>
        </div>
        <div>
          <DiagnosisKey>{`${t("database.labels.lists")}:`}</DiagnosisKey>
          <DiagnosisValue $isSuccess={true} style={{ marginLeft: "8px" }}>
            {stats?.totalLists || 0}
          </DiagnosisValue>
        </div>
        <div>
          <DiagnosisKey>{`${t("database.labels.tasks")}:`}</DiagnosisKey>
          <DiagnosisValue $isSuccess={true} style={{ marginLeft: "8px" }}>
            {stats?.totalTasks || 0}
          </DiagnosisValue>
        </div>
      </StatsGrid>

      {stats?.dbSize && (
        <>
          <div style={{ marginBottom: "20px" }}>
            <ProgressBarLabel>
              <span>{t("database.usage", "Limit MongoDB (512 MB)")}</span>
              <span>
                {Number(stats.dbSize.storageSize / (1024 * 1024) || 0).toFixed(
                  2,
                )}{" "}
                MB / 512 MB (
                {Math.min(
                  Number(
                    (stats.dbSize.storageSize / (1024 * 1024 * 512)) * 100 || 0,
                  ),
                  100,
                ).toFixed(1)}
                %)
              </span>
            </ProgressBarLabel>
            <ProgressBarTrack>
              <ProgressBarFill
                $width={Math.min(
                  Number(
                    (stats.dbSize.storageSize / (1024 * 1024 * 512)) * 100 || 0,
                  ),
                  100,
                )}
                $color={
                  (stats.dbSize.storageSize / (1024 * 1024 * 512)) * 100 > 80
                    ? "#ff4d4f"
                    : "#52c41a"
                }
              />
            </ProgressBarTrack>
          </div>

          <StatsGrid>
            <div>
              <DiagnosisKey>{`${t("database.labels.dataSize")}:`}</DiagnosisKey>
              <DiagnosisValue $isSuccess={true} style={{ marginLeft: "8px" }}>
                {`${Number(stats.dbSize.dataSize / (1024 * 1024) || 0).toFixed(
                  2,
                )} MB`}
              </DiagnosisValue>
            </div>
            <div>
              <DiagnosisKey>{`${t("database.labels.storageSize")}:`}</DiagnosisKey>
              <DiagnosisValue $isSuccess={true} style={{ marginLeft: "8px" }}>
                {`${Number(
                  stats.dbSize.storageSize / (1024 * 1024) || 0,
                ).toFixed(2)} MB`}
              </DiagnosisValue>
            </div>
            <div>
              <DiagnosisKey>{`${t("database.labels.indexSize")}:`}</DiagnosisKey>
              <DiagnosisValue $isSuccess={true} style={{ marginLeft: "8px" }}>
                {`${Number(stats.dbSize.indexSize / (1024 * 1024) || 0).toFixed(
                  2,
                )} MB`}
              </DiagnosisValue>
            </div>
            <div>
              <DiagnosisKey>{`${t("database.labels.collections")}:`}</DiagnosisKey>
              <DiagnosisValue $isSuccess={true} style={{ marginLeft: "8px" }}>
                {stats.dbSize.collections || 0}
              </DiagnosisValue>
            </div>
          </StatsGrid>
        </>
      )}
    </TopBorderSection>
  );
};
