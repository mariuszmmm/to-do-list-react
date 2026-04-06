import { useTranslation } from "react-i18next";
import {
  TopBorderSection,
  SectionTitle,
  ProgressBarLabel,
  ProgressBarTrack,
  ProgressBarFill,
  ProgressBarText,
  StatsGrid,
  StatsGridSuccess,
  DiagnosisKey,
  DiagnosisValue,
  StatsRow,
  ProgressWrapper,
  AnimatedExpandBlock,
  FlexColumnStartContainer,
  ActionButton,
} from "../styled";
import { StyledSpan } from "../../../../common/StyledList";
import { useTheme } from "styled-components";

interface DatabaseSectionProps {
  stats: any;
  loading: boolean;
  loadingLogs?: boolean;
  message?: { text: string; isError: boolean } | null;
  logsMessage?: { text: string; isError: boolean } | null;
  results?: any;
  logsResults?: any;
  onRunCleanup: () => void;
  onRunLogsCleanup: () => void;
}

export const DatabaseSection = ({
  stats,
  loading,
  loadingLogs,
  message,
  logsMessage,
  results,
  logsResults,
  onRunCleanup,
  onRunLogsCleanup,
}: DatabaseSectionProps) => {
  const { t } = useTranslation("translation", {
    keyPrefix: "accountPage.systemAdmin",
  });
  const theme = useTheme();

  return (
    <TopBorderSection>
      <SectionTitle>{t("database.title")}</SectionTitle>

      <AnimatedExpandBlock $visible={!!stats?.dbSize}>
        <div>
          <StatsGrid>
            <StatsRow>
              <DiagnosisKey>{`${t("database.labels.users")}:`}</DiagnosisKey>
              <DiagnosisValue $isSuccess={true}>
                {stats?.totalUsers || 0}
              </DiagnosisValue>
            </StatsRow>
            <StatsRow>
              <DiagnosisKey>{`${t("database.labels.lists")}:`}</DiagnosisKey>
              <DiagnosisValue $isSuccess={true}>
                {stats?.totalLists || 0}
              </DiagnosisValue>
            </StatsRow>
            <StatsRow>
              <DiagnosisKey>{`${t("database.labels.tasks")}:`}</DiagnosisKey>
              <DiagnosisValue $isSuccess={true}>
                {stats?.totalTasks || 0}
              </DiagnosisValue>
            </StatsRow>
            {stats?.dbSize && (
              <>
                <StatsRow>
                  <DiagnosisKey>{`${t("database.labels.dataSize")}:`}</DiagnosisKey>
                  <DiagnosisValue $isSuccess={true}>
                    {`${Number(
                      (stats?.dbSize?.dataSize || 0) / (1024 * 1024),
                    ).toFixed(2)} MB`}
                  </DiagnosisValue>
                </StatsRow>
                <StatsRow>
                  <DiagnosisKey>{`${t("database.labels.storageSize")}:`}</DiagnosisKey>
                  <DiagnosisValue $isSuccess={true}>
                    {`${Number(
                      (stats?.dbSize?.storageSize || 0) / (1024 * 1024),
                    ).toFixed(2)} MB`}
                  </DiagnosisValue>
                </StatsRow>
                <StatsRow>
                  <DiagnosisKey>{`${t("database.labels.indexSize")}:`}</DiagnosisKey>
                  <DiagnosisValue $isSuccess={true}>
                    {`${Number(
                      (stats?.dbSize?.indexSize || 0) / (1024 * 1024),
                    ).toFixed(2)} MB`}
                  </DiagnosisValue>
                </StatsRow>
              </>
            )}
          </StatsGrid>

          <ProgressWrapper>
            <ProgressBarLabel>
              <ProgressBarText>
                {t("database.usage", "Limit MongoDB (512 MB)")}
              </ProgressBarText>
              <ProgressBarText>
                {Number(
                  ((stats?.dbSize?.storageSize || 0) +
                    (stats?.dbSize?.indexSize || 0)) /
                    (1024 * 1024),
                ).toFixed(2)}{" "}
                MB / 512 MB (
                {Math.min(
                  Number(
                    (((stats?.dbSize?.storageSize || 0) +
                      (stats?.dbSize?.indexSize || 0)) /
                      (1024 * 1024 * 512)) *
                      100,
                  ),
                  100,
                ).toFixed(1)}
                %)
              </ProgressBarText>
            </ProgressBarLabel>
            <ProgressBarTrack>
              <ProgressBarFill
                $width={Math.min(
                  Number(
                    (((stats?.dbSize?.storageSize || 0) +
                      (stats?.dbSize?.indexSize || 0)) /
                      (1024 * 1024 * 512)) *
                      100,
                  ),
                  100,
                )}
                $color={
                  (((stats?.dbSize?.storageSize || 0) +
                    (stats?.dbSize?.indexSize || 0)) /
                    (1024 * 1024 * 512)) *
                    100 >
                  80
                    ? theme.colors.info.error
                    : theme.colors.info.value
                }
              />
            </ProgressBarTrack>
          </ProgressWrapper>
        </div>
      </AnimatedExpandBlock>

      <AnimatedExpandBlock $visible={!!results}>
        <div>
          <StatsGridSuccess>
            {Object.entries(results || {}).map(([key, value]) => (
              <StatsRow key={key}>
                <DiagnosisKey>{`${t(`database.results.${key}`, key)}:`}</DiagnosisKey>
                <DiagnosisValue $isSuccess={true}>
                  {value as string | number}
                </DiagnosisValue>
              </StatsRow>
            ))}
          </StatsGridSuccess>
        </div>
      </AnimatedExpandBlock>

      <AnimatedExpandBlock $visible={!!logsResults}>
        <div>
          <StatsGridSuccess>
            {Object.entries(logsResults || {}).map(([key, value]) => (
              <StatsRow key={`log-${key}`}>
                <DiagnosisKey>{`${t(`database.results.${key}`, key)}:`}</DiagnosisKey>
                <DiagnosisValue $isSuccess={true}>
                  {value as string | number}
                </DiagnosisValue>
              </StatsRow>
            ))}
          </StatsGridSuccess>
        </div>
      </AnimatedExpandBlock>

      <FlexColumnStartContainer>
        <ActionButton onClick={onRunCleanup} disabled={loading} $hasMarginTop>
          {loading
            ? t("database.cleaning", "Trwa czyszczenie...")
            : t("database.cleanButton", "Uruchom czyszczenie zadań")}
        </ActionButton>
        {message && (
          <StyledSpan $error={message.isError}>{message.text}</StyledSpan>
        )}

        <ActionButton
          onClick={onRunLogsCleanup}
          disabled={loadingLogs}
          $hasMarginTop
        >
          {loadingLogs
            ? t("database.cleaning", "Trwa czyszczenie...")
            : t("database.cleanLogsButton", "Uruchom czyszczenie logów")}
        </ActionButton>
        {logsMessage && (
          <StyledSpan $error={logsMessage.isError}>
            {logsMessage.text}
          </StyledSpan>
        )}
      </FlexColumnStartContainer>
    </TopBorderSection>
  );
};
