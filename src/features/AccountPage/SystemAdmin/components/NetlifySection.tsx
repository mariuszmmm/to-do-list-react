import { Trans, useTranslation } from "react-i18next";
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
  AnimatedExpandBlock,
} from "../styled";
import { useTheme } from "styled-components";

interface NetlifySectionProps {
  netlifyStats: any;
}

export const NetlifySection = ({ netlifyStats }: NetlifySectionProps) => {
  const { t } = useTranslation("translation", {
    keyPrefix: "accountPage.systemAdmin",
  });
  const theme = useTheme();

  const isDataBroken = (stats: any) => {
    if (!stats) return false;

    // If we have stats but no breakdown or raw usage, it's likely broken
    const usage = stats.credit_breakdown?.raw_usage;
    if (!usage) return true;

    // Check if main metrics are suspiciously zero (likely API issues)
    const productionDeploys = usage.production_deploys?.usage_used || 0;
    const compute =
      usage.compute?.usage_used || usage.functions?.usage_used || 0;
    const webRequests = usage.web_requests?.usage_used || 0;
    const bandwidth = usage.bandwidth?.usage_used || 0;

    // If everything is zero, it's broken according to user report
    return (
      productionDeploys === 0 &&
      compute === 0 &&
      webRequests === 0 &&
      bandwidth === 0
    );
  };

  const isBroken = isDataBroken(netlifyStats);

  const renderBreakdownValue = (credits: number) => {
    const rawCreditUnit = t("netlify.creditUnit", "");
    const creditUnitStr = rawCreditUnit ? ` ${rawCreditUnit}` : "";
    return `${credits}${creditUnitStr}`;
  };

  return (
    <TopBorderSection $noBorder>
      <SectionTitle>{t("netlify.title")}</SectionTitle>
      <AnimatedExpandBlock $visible={!!netlifyStats}>
        <div>
          <SubSectionContainer>
            {/* Netlify Site Info */}
            <StatsGridLarge>
              <StatsRow $long>
                <DiagnosisKey>{`${t("netlify.labels.siteName")}:`}</DiagnosisKey>
                <DiagnosisValue $isSuccess={true}>
                  {netlifyStats?.custom_domain ||
                    netlifyStats?.default_domain ||
                    netlifyStats?.site_name}
                </DiagnosisValue>
              </StatsRow>
              <StatsRow $long>
                <DiagnosisKey>{`${t("netlify.labels.lastDeploy")}:`}</DiagnosisKey>
                <DiagnosisValue $isSuccess={true}>
                  {netlifyStats?.last_deploy_at
                    ? new Date(netlifyStats.last_deploy_at).toLocaleString()
                    : "---"}
                </DiagnosisValue>
              </StatsRow>
            </StatsGridLarge>

            {isBroken ? (
              <StyledCommentBlock $comment $error>
                <Trans i18nKey="accountPage.systemAdmin.netlify.siteMonitoringError" />
              </StyledCommentBlock>
            ) : (
              <>
                {/* Netlify Production Deploys Progress Bar */}
                <ProgressBarLabel>
                  <ProgressBarText>
                    {t(
                      "netlify.productionDeploysLabel",
                      "Wdrożenia (Limit 20)",
                    )}
                  </ProgressBarText>
                  <ProgressBarText>
                    {Math.round(
                      netlifyStats?.credit_breakdown?.raw_usage
                        ?.production_deploys?.usage_used || 0,
                    )}{" "}
                    / 20 (
                    {(
                      ((netlifyStats?.credit_breakdown?.raw_usage
                        ?.production_deploys?.usage_used || 0) /
                        20) *
                      100
                    ).toFixed(1)}
                    %)
                  </ProgressBarText>
                </ProgressBarLabel>
                <ProgressBarTrack>
                  <ProgressBarFill
                    $width={
                      ((netlifyStats?.credit_breakdown?.raw_usage
                        ?.production_deploys?.usage_used || 0) /
                        20) *
                      100
                    }
                    $color={theme.colors.info.value}
                  />
                </ProgressBarTrack>

                {/* Netlify Compute Progress Bar */}
                <ProgressBarLabel>
                  <ProgressBarText>
                    {t(
                      "netlify.computeLabel",
                      "Zasoby obliczeniowe (Limit 60 GB-godz.)",
                    )}
                  </ProgressBarText>
                  <ProgressBarText>
                    {Number(
                      netlifyStats?.credit_breakdown?.raw_usage?.compute
                        ?.usage_used ||
                        netlifyStats?.credit_breakdown?.raw_usage?.functions
                          ?.usage_used ||
                        0,
                    ).toFixed(2)}{" "}
                    / 60 (
                    {(
                      ((netlifyStats?.credit_breakdown?.raw_usage?.compute
                        ?.usage_used ||
                        netlifyStats?.credit_breakdown?.raw_usage?.functions
                          ?.usage_used ||
                        0) /
                        60) *
                      100
                    ).toFixed(1)}
                    %)
                  </ProgressBarText>
                </ProgressBarLabel>
                <ProgressBarTrack>
                  <ProgressBarFill
                    $width={
                      ((netlifyStats?.credit_breakdown?.raw_usage?.compute
                        ?.usage_used ||
                        netlifyStats?.credit_breakdown?.raw_usage?.functions
                          ?.usage_used ||
                        0) /
                        60) *
                      100
                    }
                    $color={theme.colors.info.value}
                  />
                </ProgressBarTrack>

                {/* Netlify Web Requests Progress Bar */}
                <ProgressBarLabel>
                  <ProgressBarText>
                    {t(
                      "netlify.webRequestsLabel",
                      "Żądania sieciowe (Limit 900 000)",
                    )}
                  </ProgressBarText>
                  <ProgressBarText>
                    {Math.round(
                      netlifyStats?.credit_breakdown?.raw_usage?.web_requests
                        ?.usage_used || 0,
                    ).toLocaleString()}{" "}
                    / 900 000 (
                    {(
                      ((netlifyStats?.credit_breakdown?.raw_usage?.web_requests
                        ?.usage_used || 0) /
                        900000) *
                      100
                    ).toFixed(1)}
                    %)
                  </ProgressBarText>
                </ProgressBarLabel>
                <ProgressBarTrack>
                  <ProgressBarFill
                    $width={
                      ((netlifyStats?.credit_breakdown?.raw_usage?.web_requests
                        ?.usage_used || 0) /
                        900000) *
                      100
                    }
                    $color={theme.colors.info.value}
                  />
                </ProgressBarTrack>

                {/* Netlify Credit Bandwidth Progress Bar */}
                <ProgressBarLabel>
                  <ProgressBarText>
                    {t(
                      "netlify.creditBandwidthLabel",
                      "Transfer danych (Limit 30 GB)",
                    )}
                  </ProgressBarText>
                  <ProgressBarText>
                    {Number(
                      netlifyStats?.credit_breakdown?.raw_usage?.bandwidth
                        ?.usage_used || 0,
                    ).toFixed(2)}{" "}
                    GB / 30 GB (
                    {(
                      ((netlifyStats?.credit_breakdown?.raw_usage?.bandwidth
                        ?.usage_used || 0) /
                        30) *
                      100
                    ).toFixed(1)}
                    %)
                  </ProgressBarText>
                </ProgressBarLabel>
                <ProgressBarTrack>
                  <ProgressBarFill
                    $width={
                      ((netlifyStats?.credit_breakdown?.raw_usage?.bandwidth
                        ?.usage_used || 0) /
                        30) *
                      100
                    }
                    $color={theme.colors.info.value}
                  />
                </ProgressBarTrack>

                {/* Credits Progress Bar */}
                <ProgressBarLabel>
                  <ProgressBarText>
                    {t("netlify.creditsLabel", "Netlify Credits (Limit 300)")}
                  </ProgressBarText>
                  <ProgressBarText>
                    {netlifyStats?.credits?.used || 0} / 300 (
                    {netlifyStats?.credits?.used_percent || 0}%)
                  </ProgressBarText>
                </ProgressBarLabel>
                <ProgressBarTrack>
                  <ProgressBarFill
                    $width={Number(netlifyStats?.credits?.used_percent || 0)}
                    $color={
                      Number(netlifyStats?.credits?.used_percent || 0) > 80
                        ? theme.colors.info.error
                        : theme.colors.info.value2
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
                      {t(
                        "netlify.creditBreakdownLabel",
                        "Credit Usage Breakdown",
                      )}
                      :
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
                          {renderBreakdownValue(
                            netlifyStats.credit_breakdown.productionDeploys,
                          )}
                        </CreditBreakdownValue>
                      </CreditBreakdownRow>

                      <CreditBreakdownRow>
                        • {t("netlify.breakdown.compute", "Compute")}:{" "}
                        <CreditBreakdownValue>
                          {renderBreakdownValue(
                            netlifyStats.credit_breakdown.compute,
                          )}
                        </CreditBreakdownValue>
                      </CreditBreakdownRow>

                      <CreditBreakdownRow>
                        • {t("netlify.breakdown.webRequests", "Web Requests")}:{" "}
                        <CreditBreakdownValue>
                          {renderBreakdownValue(
                            netlifyStats.credit_breakdown.webRequests,
                          )}
                        </CreditBreakdownValue>
                      </CreditBreakdownRow>
                      <CreditBreakdownRow>
                        • {t("netlify.breakdown.bandwidth", "Bandwidth")}:{" "}
                        <CreditBreakdownValue>
                          {renderBreakdownValue(
                            netlifyStats.credit_breakdown.bandwidth,
                          )}
                        </CreditBreakdownValue>
                      </CreditBreakdownRow>
                      <CreditBreakdownRow>
                        •{" "}
                        {t(
                          "netlify.breakdown.formSubmissions",
                          "Form Submissions",
                        )}
                        :{" "}
                        <CreditBreakdownValue>
                          {renderBreakdownValue(
                            netlifyStats.credit_breakdown.formSubmissions,
                          )}
                        </CreditBreakdownValue>
                      </CreditBreakdownRow>
                      <CreditBreakdownRow>
                        • {t("netlify.breakdown.aiInference", "AI Inference")}:{" "}
                        <CreditBreakdownValue>
                          {renderBreakdownValue(
                            netlifyStats.credit_breakdown.aiInference,
                          )}
                        </CreditBreakdownValue>
                      </CreditBreakdownRow>
                    </CreditBreakdownGrid>
                  </CreditBreakdownContainer>
                )}
              </>
            )}
          </SubSectionContainer>
        </div>
      </AnimatedExpandBlock>
      {!netlifyStats && (
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
