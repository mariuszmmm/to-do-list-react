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
  CreditBreakdownContainer,
  CreditBreakdownTitle,
  CreditBreakdownGrid,
  CreditBreakdownRow,
  CreditBreakdownValue,
  AnimatedExpandBlock,
  BillingPeriodText,
} from "../styled";
import { useTheme } from "styled-components";

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
  const theme = useTheme();

  return (
    <TopBorderSection>
      <SectionTitle>{t("storage.title")}</SectionTitle>
      <AnimatedExpandBlock $visible={!!storageStats}>
        <div>
          <SpacerContainer>
            <StatsGrid>
              <StatsRow>
                <DiagnosisKey>{`${t("storage.labels.resources")}:`}</DiagnosisKey>
                <DiagnosisValue $isSuccess={true}>
                  {Math.round(storageStats?.resources?.used || 0)}
                </DiagnosisValue>
              </StatsRow>
              <StatsRow>
                <DiagnosisKey>{`${t("storage.labels.impressions")}:`}</DiagnosisKey>
                <DiagnosisValue $isSuccess={true}>
                  {Math.round(storageStats?.impressions?.used || 0)}
                </DiagnosisValue>
              </StatsRow>
              <StatsRow>
                <DiagnosisKey>{`${t("storage.labels.transformations")}:`}</DiagnosisKey>
                <DiagnosisValue $isSuccess={true}>
                  {Math.round(storageStats?.transformations?.used || 0)}
                </DiagnosisValue>
              </StatsRow>
              <StatsRow>
                <DiagnosisKey>{`${t("storage.labels.bandwidth")}:`}</DiagnosisKey>
                <DiagnosisValue $isSuccess={true}>
                  {`${Number(storageStats?.bandwidth?.usage_gb || 0).toFixed(
                    2,
                  )} GB`}
                </DiagnosisValue>
              </StatsRow>

              <StatsRow>
                <DiagnosisKey>{`${t("storage.labels.storage")}:`}</DiagnosisKey>
                <DiagnosisValue $isSuccess={true}>
                  {`${Number(storageStats?.storage?.usage_gb || 0).toFixed(
                    2,
                  )} GB`}
                </DiagnosisValue>
              </StatsRow>
            </StatsGrid>

            {/* Cloudinary Transformations Progress Bar */}
            <ProgressBarLabel>
              <ProgressBarText>
                {t(
                  "storage.transformationsLabel",
                  "Użycie transformacji (Limit 25 000)",
                )}
              </ProgressBarText>
              <ProgressBarText>
                {Math.round(storageStats?.transformations?.used || 0)} / 25 000
                (
                {(
                  ((storageStats?.transformations?.used || 0) / 25000) *
                  100
                ).toFixed(1)}
                %)
              </ProgressBarText>
            </ProgressBarLabel>
            <ProgressBarTrack>
              <ProgressBarFill
                $width={Math.min(
                  ((storageStats?.transformations?.used || 0) / 25000) * 100,
                  100,
                )}
                $color={
                  ((storageStats?.transformations?.used || 0) / 25000) * 100 >
                  80
                    ? theme.colors.info.error
                    : theme.colors.info.value
                }
              />
            </ProgressBarTrack>

            {/* Cloudinary Bandwidth Progress Bar */}
            <ProgressBarLabel>
              <ProgressBarText>
                {t(
                  "storage.bandwidthLabel",
                  "Użycie transferu Cloudinary (Limit 25 GB)",
                )}
              </ProgressBarText>
              <ProgressBarText>
                {Number(storageStats?.bandwidth?.usage_gb || 0).toFixed(2)} GB /{" "}
                {Number(storageStats?.bandwidth?.limit_gb) > 0
                  ? storageStats?.bandwidth?.limit_gb
                  : 25}{" "}
                GB (
                {(
                  (Number(storageStats?.bandwidth?.usage_gb || 0) /
                    (Number(storageStats?.bandwidth?.limit_gb) > 0
                      ? storageStats?.bandwidth?.limit_gb
                      : 25)) *
                  100
                ).toFixed(1)}
                %)
              </ProgressBarText>
            </ProgressBarLabel>
            <ProgressBarTrack>
              <ProgressBarFill
                $width={Math.min(
                  (Number(storageStats?.bandwidth?.usage_gb || 0) /
                    (Number(storageStats?.bandwidth?.limit_gb) > 0
                      ? storageStats?.bandwidth?.limit_gb
                      : 25)) *
                    100,
                  100,
                )}
                $color={
                  (Number(storageStats?.bandwidth?.usage_gb || 0) /
                    (Number(storageStats?.bandwidth?.limit_gb) > 0
                      ? storageStats?.bandwidth?.limit_gb
                      : 25)) *
                    100 >
                  80
                    ? theme.colors.info.error
                    : theme.colors.info.value
                }
              />
            </ProgressBarTrack>

            {/* Cloudinary Storage Progress Bar */}
            <ProgressBarLabel>
              <ProgressBarText>
                {t(
                  "storage.storageLabel",
                  "Użycie miejsca na dysku (Limit 25 GB)",
                )}
              </ProgressBarText>
              <ProgressBarText>
                {Number(storageStats?.storage?.usage_gb || 0).toFixed(2)} GB /{" "}
                {Math.round(Number(storageStats?.storage?.limit_gb) || 25)} GB (
                {storageStats?.storage?.used_percent || 0}%)
              </ProgressBarText>
            </ProgressBarLabel>
            <ProgressBarTrack>
              <ProgressBarFill
                $width={Number(storageStats?.storage?.used_percent || 0)}
                $color={
                  Number(storageStats?.storage?.used_percent || 0) > 80
                    ? theme.colors.info.error
                    : theme.colors.info.value
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
                    ? theme.colors.info.error
                    : theme.colors.info.value2
                }
              />
            </ProgressBarTrack>

            {/* Credit Breakdown */}
            <BillingPeriodText>
              {t(
                "storage.nextBillingPeriod",
                "Odnowienie kredytów: Co miesiąc",
              )}
            </BillingPeriodText>
            {storageStats?.credit_breakdown && (
              <CreditBreakdownContainer>
                <CreditBreakdownTitle>
                  {t(
                    "storage.creditBreakdownLabel",
                    "Rozbicie wykorzystania kredytów",
                  )}
                  :
                </CreditBreakdownTitle>
                <CreditBreakdownGrid>
                  <CreditBreakdownRow>
                    • {t("storage.labels.transformations")}:{" "}
                    <CreditBreakdownValue>
                      {Number(
                        storageStats.credit_breakdown.transformations || 0,
                      ).toFixed(2)}
                    </CreditBreakdownValue>
                  </CreditBreakdownRow>
                  <CreditBreakdownRow>
                    • {t("storage.labels.bandwidth")}:{" "}
                    <CreditBreakdownValue>
                      {Number(
                        storageStats.credit_breakdown.bandwidth || 0,
                      ).toFixed(2)}
                    </CreditBreakdownValue>
                  </CreditBreakdownRow>
                  <CreditBreakdownRow>
                    • {t("storage.labels.storage")}:{" "}
                    <CreditBreakdownValue>
                      {Number(
                        storageStats.credit_breakdown.storage || 0,
                      ).toFixed(2)}
                    </CreditBreakdownValue>
                  </CreditBreakdownRow>
                </CreditBreakdownGrid>
              </CreditBreakdownContainer>
            )}
          </SpacerContainer>
        </div>
      </AnimatedExpandBlock>

      <AnimatedExpandBlock $visible={!!results}>
        <div>
          <StatsGridSuccess>
            {Object.entries(results || {}).map(([key, value]) => (
              <StatsRow key={key}>
                <DiagnosisKey>{`${t(`storage.results.${key}`, key)}:`}</DiagnosisKey>
                <DiagnosisValue $isSuccess={true}>
                  {value as string | number}
                </DiagnosisValue>
              </StatsRow>
            ))}
          </StatsGridSuccess>
        </div>
      </AnimatedExpandBlock>

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
