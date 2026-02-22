import { useTranslation } from "react-i18next";
import {
  TopBorderSection,
  SectionTitle,
  SubSectionContainer,
  ProgressBarLabel,
  ProgressBarTrack,
  ProgressBarFill,
  StyledCommentBlock,
  DiagnosisKey,
  DiagnosisValue,
  StatsGridLarge,
  StatsRow,
} from "../styled";

interface NetlifySectionProps {
  netlifyStats: any;
}

export const NetlifySection = ({ netlifyStats }: NetlifySectionProps) => {
  const { t } = useTranslation("translation", {
    keyPrefix: "accountPage.systemAdmin",
  });

  return (
    <TopBorderSection style={{ borderTop: "none", paddingTop: 0 }}>
      <SectionTitle>{t("netlify.title")}</SectionTitle>
      {netlifyStats ? (
        <SubSectionContainer>
          {/* Netlify Site Info */}
          <StatsGridLarge>
            <StatsRow>
              <DiagnosisKey>{`${t("netlify.labels.siteName")}:`}</DiagnosisKey>
              <DiagnosisValue $isSuccess={true}>
                {netlifyStats.site_name}
              </DiagnosisValue>
            </StatsRow>
            <StatsRow>
              <DiagnosisKey>{`${t("netlify.labels.lastDeploy")}:`}</DiagnosisKey>
              <DiagnosisValue $isSuccess={true}>
                {netlifyStats.last_deploy_at
                  ? new Date(netlifyStats.last_deploy_at).toLocaleString()
                  : "---"}
              </DiagnosisValue>
            </StatsRow>
          </StatsGridLarge>

          {/* Bandwidth Progress Bar */}
          <ProgressBarLabel>
            <span>{t("netlify.bandwidthLabel", "Bandwidth")}</span>
            <span>
              {Number(
                netlifyStats?.bandwidth?.used / (1024 * 1024 * 1024) || 0,
              ).toFixed(2)}
              GB / 100GB ({netlifyStats?.bandwidth?.used_percent || 0}%)
            </span>
          </ProgressBarLabel>
          <ProgressBarTrack>
            <ProgressBarFill
              $width={Number(netlifyStats?.bandwidth?.used_percent || 0)}
              $color={
                Number(netlifyStats?.bandwidth?.used_percent || 0) > 80
                  ? "#ff4d4f"
                  : "#52c41a"
              }
            />
          </ProgressBarTrack>

          {/* Credits Progress Bar */}
          <ProgressBarLabel>
            <span>{t("netlify.creditsLabel", "Credits")}</span>
            <span>
              {netlifyStats?.credits?.used || 0} /{" "}
              {netlifyStats?.credits?.included || 300} (
              {netlifyStats?.credits?.used_percent || 0}%)
            </span>
          </ProgressBarLabel>
          <ProgressBarTrack>
            <ProgressBarFill
              $width={Number(netlifyStats?.credits?.used_percent || 0)}
              $color={
                Number(netlifyStats?.credits?.used_percent || 0) > 80
                  ? "#ff4d4f"
                  : "#faad14"
              }
            />
          </ProgressBarTrack>

          {/* Concurrent Builds Progress Bar */}
          <ProgressBarLabel>
            <span>
              {t("netlify.concurrentBuildsLabel", "Concurrent Builds")}
            </span>
            <span>
              {netlifyStats?.concurrent_builds?.used || 0} /{" "}
              {netlifyStats?.concurrent_builds?.max || 1} (
              {netlifyStats?.concurrent_builds?.used_percent || 0}%)
            </span>
          </ProgressBarLabel>
          <ProgressBarTrack>
            <ProgressBarFill
              $width={Number(
                netlifyStats?.concurrent_builds?.used_percent || 0,
              )}
              $color={
                Number(netlifyStats?.concurrent_builds?.used_percent || 0) > 80
                  ? "#ff4d4f"
                  : "#13c2c2"
              }
            />
          </ProgressBarTrack>
        </SubSectionContainer>
      ) : (
        <StyledCommentBlock $comment>
          {t(
            "netlify.noData",
            "Netlify monitoring is not configured or data unavailable.",
          )}
        </StyledCommentBlock>
      )}
    </TopBorderSection>
  );
};
