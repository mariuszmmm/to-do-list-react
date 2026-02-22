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
  BillingPeriodText,
  ProgressBarText,
  CreditBreakdownContainer,
  CreditBreakdownTitle,
  CreditBreakdownGrid,
  CreditBreakdownRow,
  CreditBreakdownValue,
} from "../styled";

interface NetlifySectionProps {
  netlifyStats: any;
}

export const NetlifySection = ({ netlifyStats }: NetlifySectionProps) => {
  const { t } = useTranslation("translation", {
    keyPrefix: "accountPage.systemAdmin",
  });

  return (
    <TopBorderSection $noBorder>
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
            <ProgressBarText>
              {t("netlify.bandwidthLabel", "Bandwidth")}
            </ProgressBarText>
            <ProgressBarText>
              {Number(
                netlifyStats?.bandwidth?.used / (1024 * 1024 * 1024) || 0,
              ).toFixed(2)}
              GB / 100GB ({netlifyStats?.bandwidth?.used_percent || 0}%)
            </ProgressBarText>
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
            <ProgressBarText>
              {t("netlify.creditsLabel", "Credits")}
            </ProgressBarText>
            <ProgressBarText>
              {netlifyStats?.credits?.used || 0} /{" "}
              {netlifyStats?.credits?.included || 300} (
              {netlifyStats?.credits?.used_percent || 0}%)
            </ProgressBarText>
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
          {netlifyStats?.next_billing_period_start && (
            <BillingPeriodText>
              {t("netlify.nextBillingPeriod", "Credits renew on")}:{" "}
              {new Date(
                netlifyStats.next_billing_period_start,
              ).toLocaleDateString()}
            </BillingPeriodText>
          )}

          {/* Credit Breakdown */}
          {netlifyStats?.credit_breakdown && (
            <CreditBreakdownContainer>
              <CreditBreakdownTitle>
                {t("netlify.creditBreakdownLabel", "Credit Usage Breakdown")}:
              </CreditBreakdownTitle>
              <CreditBreakdownGrid>
                <CreditBreakdownRow>
                  •{" "}
                  {t(
                    "netlify.breakdown.productionDeploys",
                    "Production Deploys",
                  )}
                  :{" "}
                  <CreditBreakdownValue>
                    {netlifyStats.credit_breakdown.productionDeploys}
                  </CreditBreakdownValue>
                </CreditBreakdownRow>
                <CreditBreakdownRow>
                  • {t("netlify.breakdown.aiInference", "AI Inference")}:{" "}
                  <CreditBreakdownValue>
                    {netlifyStats.credit_breakdown.aiInference}
                  </CreditBreakdownValue>
                </CreditBreakdownRow>
                <CreditBreakdownRow>
                  • {t("netlify.breakdown.compute", "Compute")}:{" "}
                  <CreditBreakdownValue>
                    {netlifyStats.credit_breakdown.compute}
                  </CreditBreakdownValue>
                </CreditBreakdownRow>
                <CreditBreakdownRow>
                  • {t("netlify.breakdown.bandwidth", "Bandwidth")}:{" "}
                  <CreditBreakdownValue>
                    {netlifyStats.credit_breakdown.bandwidth}
                  </CreditBreakdownValue>
                </CreditBreakdownRow>
                <CreditBreakdownRow>
                  • {t("netlify.breakdown.webRequests", "Web Requests")}:{" "}
                  <CreditBreakdownValue>
                    {netlifyStats.credit_breakdown.webRequests}
                  </CreditBreakdownValue>
                </CreditBreakdownRow>
                <CreditBreakdownRow>
                  • {t("netlify.breakdown.formSubmissions", "Form Submissions")}
                  :{" "}
                  <CreditBreakdownValue>
                    {netlifyStats.credit_breakdown.formSubmissions}
                  </CreditBreakdownValue>
                </CreditBreakdownRow>
              </CreditBreakdownGrid>
            </CreditBreakdownContainer>
          )}
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
