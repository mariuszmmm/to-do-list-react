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
          <StatsGridLarge style={{ marginBottom: "20px" }}>
            <div>
              <DiagnosisKey>{`${t("netlify.labels.siteName")}:`}</DiagnosisKey>
              <DiagnosisValue $isSuccess={true} style={{ marginLeft: "8px" }}>
                {netlifyStats.site_name}
              </DiagnosisValue>
            </div>
            <div>
              <DiagnosisKey>{`${t("netlify.labels.lastDeploy")}:`}</DiagnosisKey>
              <DiagnosisValue $isSuccess={true} style={{ marginLeft: "8px" }}>
                {netlifyStats.last_deploy_at
                  ? new Date(netlifyStats.last_deploy_at).toLocaleString()
                  : "---"}
              </DiagnosisValue>
            </div>
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

          {/* Build Minutes Progress Bar */}
          <ProgressBarLabel>
            <span>{t("netlify.buildMinutesLabel", "Build Minutes")}</span>
            <span>
              {netlifyStats?.build_minutes?.used || 0} /{" "}
              {netlifyStats?.build_minutes?.included || 300} (
              {netlifyStats?.build_minutes?.used_percent || 0}%)
            </span>
          </ProgressBarLabel>
          <ProgressBarTrack>
            <ProgressBarFill
              $width={Number(netlifyStats?.build_minutes?.used_percent || 0)}
              $color={
                Number(netlifyStats?.build_minutes?.used_percent || 0) > 80
                  ? "#ff4d4f"
                  : "#faad14"
              }
            />
          </ProgressBarTrack>

          {/* Functions Progress Bar */}
          <ProgressBarLabel>
            <span>{t("netlify.functionsLabel", "Function Invocations")}</span>
            <span>
              {Number(netlifyStats?.functions?.used || 0).toLocaleString()} /
              125,000 ({netlifyStats?.functions?.used_percent || 0}%)
            </span>
          </ProgressBarLabel>
          <ProgressBarTrack>
            <ProgressBarFill
              $width={Number(netlifyStats?.functions?.used_percent || 0)}
              $color={
                Number(netlifyStats?.functions?.used_percent || 0) > 80
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
