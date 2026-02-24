import { useTranslation } from "react-i18next";
import {
  TopBorderSection,
  SectionTitle,
  StatusDot,
  StatsGrid,
  DiagnosisKey,
  DiagnosisValue,
  StatsRow,
  SpacerContainer,
  ProgressBarLabel,
  ProgressBarText,
  ProgressBarTrack,
  ProgressBarFill,
  AnimatedExpandBlock,
} from "../styled";
import { useTheme } from "styled-components";

interface AblySectionProps {
  ablyStatus: string;
  ablyStats: any;
}

export const AblySection = ({ ablyStatus, ablyStats }: AblySectionProps) => {
  const { t } = useTranslation("translation", {
    keyPrefix: "accountPage.systemAdmin",
  });
  const theme = useTheme();

  const getPercent = (used: number, limit: number) => {
    if (!limit) return 0;
    return Math.min((used / limit) * 100, 100);
  };

  const getProgressBarColor = (percent: number) => {
    return percent > 80 ? theme.colors.info.error : theme.colors.info.value;
  };

  return (
    <TopBorderSection>
      <SectionTitle>{t("ably.title")}</SectionTitle>

      <AnimatedExpandBlock $visible={!!ablyStats}>
        <div>
          <SpacerContainer>
            <ProgressBarLabel>
              <ProgressBarText>{t("ably.messagesUsage")}</ProgressBarText>
              <ProgressBarText>
                {Number(ablyStats?.messages?.used || 0).toLocaleString()} /{" "}
                {Number(ablyStats?.messages?.limit || 0).toLocaleString()} (
                {getPercent(
                  ablyStats?.messages?.used || 0,
                  ablyStats?.messages?.limit || 1,
                ).toFixed(2)}
                %)
              </ProgressBarText>
            </ProgressBarLabel>
            <ProgressBarTrack>
              <ProgressBarFill
                $width={getPercent(
                  ablyStats?.messages?.used || 0,
                  ablyStats?.messages?.limit || 1,
                )}
                $color={getProgressBarColor(
                  getPercent(
                    ablyStats?.messages?.used || 0,
                    ablyStats?.messages?.limit || 1,
                  ),
                )}
              />
            </ProgressBarTrack>

            <ProgressBarLabel>
              <ProgressBarText>{t("ably.connectionsUsage")}</ProgressBarText>
              <ProgressBarText>
                {Number(ablyStats?.connections?.used || 0).toLocaleString()} /{" "}
                {Number(ablyStats?.connections?.limit || 0).toLocaleString()} (
                {getPercent(
                  ablyStats?.connections?.used || 0,
                  ablyStats?.connections?.limit || 1,
                ).toFixed(2)}
                %)
              </ProgressBarText>
            </ProgressBarLabel>
            <ProgressBarTrack>
              <ProgressBarFill
                $width={getPercent(
                  ablyStats?.connections?.used || 0,
                  ablyStats?.connections?.limit || 1,
                )}
                $color={getProgressBarColor(
                  getPercent(
                    ablyStats?.connections?.used || 0,
                    ablyStats?.connections?.limit || 1,
                  ),
                )}
              />
            </ProgressBarTrack>
          </SpacerContainer>
        </div>
      </AnimatedExpandBlock>

      <StatsGrid>
        <StatsRow>
          <DiagnosisKey>{`${t("ably.labels.status")}:`}</DiagnosisKey>
          <DiagnosisValue $isSuccess={ablyStatus === "connected"}>
            <>
              <StatusDot
                $color={
                  ablyStatus === "connected"
                    ? theme.colors.info.value
                    : theme.colors.info.error
                }
              />
              {t(`ablyStatus.${ablyStatus}`, ablyStatus)}
            </>
          </DiagnosisValue>
        </StatsRow>
      </StatsGrid>
    </TopBorderSection>
  );
};
