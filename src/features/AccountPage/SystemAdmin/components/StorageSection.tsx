import { useTranslation } from "react-i18next";
import { StyledSpan } from "../../../../common/StyledList";
import {
  TopBorderSection,
  SectionTitle,
  SpacerContainer,
  ProgressBarLabel,
  ProgressBarTrack,
  ProgressBarFill,
  FlexColumnStartContainer,
  ActionButton,
  StatsGrid,
  DiagnosisKey,
  DiagnosisValue,
} from "../styled";

interface StorageSectionProps {
  storageStats: any;
  cleanupStatus: any;
  loading: boolean;
  message?: { text: string; isError: boolean } | null;
  results?: any;
  onRunCleanup: () => void;
}

export const StorageSection = ({
  storageStats,
  cleanupStatus,
  loading,
  message,
  results,
  onRunCleanup,
}: StorageSectionProps) => {
  const { t } = useTranslation("translation", {
    keyPrefix: "accountPage.systemAdmin",
  });

  return (
    <TopBorderSection>
      <SectionTitle>{t("storage.title")}</SectionTitle>
      {storageStats && (
        <SpacerContainer>
          {/* Cloudinary Storage Progress Bar */}
          <ProgressBarLabel>
            <span>{t("storage.title")}</span>
            <span>
              {Number(storageStats?.storage?.usage_gb || 0).toFixed(2)}GB /{" "}
              {storageStats?.storage?.limit_gb || 0}GB (
              {storageStats?.storage?.used_percent || 0}%)
            </span>
          </ProgressBarLabel>
          <ProgressBarTrack>
            <ProgressBarFill
              $width={Number(storageStats?.storage?.used_percent || 0)}
              $color={
                Number(storageStats?.storage?.used_percent || 0) > 80
                  ? "#ff4d4f"
                  : "#52c41a"
              }
            />
          </ProgressBarTrack>

          {/* Cloudinary Credits Progress Bar */}
          <ProgressBarLabel>
            <span>
              {t("storage.creditsUsage", "Cloudinary Credits (Limit 25)")}
            </span>
            <span>
              {Number(storageStats?.credits?.used || 0).toFixed(2)} /{" "}
              {storageStats?.credits?.limit || 25} (
              {Number(storageStats?.credits?.used_percent || 0).toFixed(1)}%)
            </span>
          </ProgressBarLabel>
          <ProgressBarTrack>
            <ProgressBarFill
              $width={Math.min(
                Number(storageStats?.credits?.used_percent || 0),
                100,
              )}
              $color={
                Number(storageStats?.credits?.used_percent || 0) > 80
                  ? "#ff4d4f"
                  : "#faad14"
              }
            />
          </ProgressBarTrack>

          <StatsGrid style={{ marginBottom: "20px" }}>
            <div>
              <DiagnosisKey>{`${t("storage.labels.resources")}:`}</DiagnosisKey>
              <DiagnosisValue $isSuccess={true} style={{ marginLeft: "8px" }}>
                {`${storageStats?.resources?.used || 0} ${
                  storageStats?.resources?.limit > 0
                    ? `/ ${storageStats.resources.limit}`
                    : ""
                }`}
              </DiagnosisValue>
            </div>
            <div>
              <DiagnosisKey>{`${t("storage.labels.transformations")}:`}</DiagnosisKey>
              <DiagnosisValue $isSuccess={true} style={{ marginLeft: "8px" }}>
                {`${storageStats?.transformations?.used || 0} ${
                  storageStats?.transformations?.limit > 0
                    ? `/ ${storageStats.transformations.limit}`
                    : ""
                }`}
              </DiagnosisValue>
            </div>
            <div>
              <DiagnosisKey>{`${t("storage.labels.bandwidth")}:`}</DiagnosisKey>
              <DiagnosisValue $isSuccess={true} style={{ marginLeft: "8px" }}>
                {`${Number(storageStats?.bandwidth?.usage_gb || 0).toFixed(
                  2,
                )}GB ${
                  storageStats?.bandwidth?.limit_gb > 0
                    ? `/ ${storageStats.bandwidth.limit_gb}GB`
                    : ""
                }`}
              </DiagnosisValue>
            </div>
          </StatsGrid>
        </SpacerContainer>
      )}

      {results && (
        <StatsGrid
          style={{
            marginTop: "15px",
            marginBottom: "15px",
            background: "rgba(82, 196, 26, 0.1)",
            border: "1px solid rgba(82, 196, 26, 0.2)",
          }}
        >
          {Object.entries(results).map(([key, value]) => (
            <div key={key}>
              <DiagnosisKey>{`${t(`storage.results.${key}`, key)}:`}</DiagnosisKey>
              <DiagnosisValue $isSuccess={true} style={{ marginLeft: "8px" }}>
                {value as string | number}
              </DiagnosisValue>
            </div>
          ))}
        </StatsGrid>
      )}

      <FlexColumnStartContainer>
        <StyledSpan $comment>
          {t("storage.lastCleanup", {
            date: cleanupStatus?.timestamp
              ? new Date(cleanupStatus.timestamp).toLocaleString()
              : t("storage.never"),
          })}
        </StyledSpan>
        <ActionButton onClick={onRunCleanup} disabled={loading} $hasMarginTop>
          {loading ? t("storage.cleaning") : t("storage.cleanButton")}
        </ActionButton>
        {message && (
          <StyledSpan $error={message.isError} style={{ marginTop: "8px" }}>
            {message.text}
          </StyledSpan>
        )}
      </FlexColumnStartContainer>
    </TopBorderSection>
  );
};
