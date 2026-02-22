import { useTranslation } from "react-i18next";
import { StyledSpan } from "../../../../common/StyledList";
import {
  TopBorderSection,
  SectionTitle,
  SpacerContainer,
  ProgressBarLabel,
  ProgressBarTrack,
  ProgressBarFill,
  ProgressBarText,
  FlexColumnStartContainer,
  ActionButton,
  StatsGrid,
  StatsGridSuccess,
  DiagnosisKey,
  DiagnosisValue,
  StatsRow,
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
            <ProgressBarText>{t("storage.title")}</ProgressBarText>
            <ProgressBarText>
              {Number(storageStats?.storage?.usage_gb || 0).toFixed(2)}GB /{" "}
              {storageStats?.storage?.limit_gb || 0}GB (
              {storageStats?.storage?.used_percent || 0}%)
            </ProgressBarText>
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
            <ProgressBarText>
              {t("storage.creditsUsage", "Cloudinary Credits (Limit 25)")}
            </ProgressBarText>
            <ProgressBarText>
              {Number(storageStats?.credits?.used || 0).toFixed(2)} /{" "}
              {storageStats?.credits?.limit || 25} (
              {Number(storageStats?.credits?.used_percent || 0).toFixed(1)}%)
            </ProgressBarText>
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

          <StatsGrid>
            <StatsRow>
              <DiagnosisKey>{`${t("storage.labels.resources")}:`}</DiagnosisKey>
              <DiagnosisValue $isSuccess={true}>
                {`${storageStats?.resources?.used || 0} ${
                  storageStats?.resources?.limit > 0
                    ? `/ ${storageStats.resources.limit}`
                    : ""
                }`}
              </DiagnosisValue>
            </StatsRow>
            <StatsRow>
              <DiagnosisKey>{`${t("storage.labels.transformations")}:`}</DiagnosisKey>
              <DiagnosisValue $isSuccess={true}>
                {`${storageStats?.transformations?.used || 0} ${
                  storageStats?.transformations?.limit > 0
                    ? `/ ${storageStats.transformations.limit}`
                    : ""
                }`}
              </DiagnosisValue>
            </StatsRow>
            <StatsRow>
              <DiagnosisKey>{`${t("storage.labels.bandwidth")}:`}</DiagnosisKey>
              <DiagnosisValue $isSuccess={true}>
                {`${Number(storageStats?.bandwidth?.usage_gb || 0).toFixed(
                  2,
                )}GB ${
                  storageStats?.bandwidth?.limit_gb > 0
                    ? `/ ${storageStats.bandwidth.limit_gb}GB`
                    : ""
                }`}
              </DiagnosisValue>
            </StatsRow>
          </StatsGrid>
        </SpacerContainer>
      )}

      {results && (
        <StatsGridSuccess>
          {Object.entries(results).map(([key, value]) => (
            <StatsRow key={key}>
              <DiagnosisKey>{`${t(`storage.results.${key}`, key)}:`}</DiagnosisKey>
              <DiagnosisValue $isSuccess={true}>
                {value as string | number}
              </DiagnosisValue>
            </StatsRow>
          ))}
        </StatsGridSuccess>
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
          <StyledSpan $error={message.isError}>{message.text}</StyledSpan>
        )}
      </FlexColumnStartContainer>
    </TopBorderSection>
  );
};
