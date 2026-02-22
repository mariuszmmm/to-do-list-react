import axios from "axios";

export interface NetlifyUsage {
  bandwidth: {
    used: number;
    included: number;
    used_percent: number;
  };
  credits: {
    used: number;
    included: number;
    used_percent: number;
  };
  credit_breakdown: {
    productionDeploys: number;
    compute: number;
    aiInference: number;
    bandwidth: number;
    webRequests: number;
    formSubmissions: number;
  };
  site_name: string;
  last_deploy_at: string | null;
  next_billing_period_start: string | null;
}

export const getNetlifyUsage = async (): Promise<NetlifyUsage | null> => {
  const token = process.env.NETLIFY_AUTH_TOKEN;
  const siteId = process.env.NETLIFY_SITE_ID;

  if (!token || !siteId) {
    console.warn(
      "[getNetlifyUsage] Missing NETLIFY_AUTH_TOKEN or NETLIFY_SITE_ID",
    );
    return null;
  }

  try {
    // 1. Get site details (name, last deploy)
    const siteResponse = await axios.get(
      `https://api.netlify.com/api/v1/sites/${siteId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    const siteData: any = siteResponse.data;
    const accountSlug = siteData.account_slug;

    // 2. Get bandwidth usage
    let bandwidthUsed = 0;
    try {
      const bandwidthResponse = await axios.get(
        `https://api.netlify.com/api/v1/accounts/${accountSlug}/bandwidth`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      bandwidthUsed = bandwidthResponse.data.used || 0;
    } catch (err) {
      console.warn("[getNetlifyUsage] Error fetching bandwidth", err);
    }
    const bandwidthLimit = 100 * 1024 * 1024 * 1024; // 100GB default free

    // 3. Get Account details for billing periods
    let accountData: any = null;
    try {
      const accountResponse = await axios.get(
        `https://api.netlify.com/api/v1/accounts/${accountSlug}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      // The API returns an array, we need the first matching account
      accountData = Array.isArray(accountResponse.data)
        ? accountResponse.data[0]
        : accountResponse.data;
    } catch (err) {
      console.warn("[getNetlifyUsage] Error fetching account details", err);
    }

    // 4. Get credits billing stats
    let creditsUsed = 0;
    let creditsLimit = 300;
    let creditBreakdown = {
      productionDeploys: 0,
      compute: 0,
      aiInference: 0,
      bandwidth: 0,
      webRequests: 0,
      formSubmissions: 0,
    };

    try {
      // Fetch both generic credits and detailed credit usage concurrently
      const [creditsResponse, usageResponse] = await Promise.allSettled([
        axios.get(
          `https://api.netlify.com/api/v1/${accountSlug}/billing/credits`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        ),
        axios.get(
          `https://api.netlify.com/api/v1/${accountSlug}/billing/credit_usage`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        ),
      ]);

      if (creditsResponse.status === "fulfilled") {
        const planCredits = creditsResponse.value.data?.plan_credits || {};
        creditsUsed = planCredits.used
          ? Number(parseFloat(planCredits.used).toFixed(1))
          : 0;
        creditsLimit = planCredits.total ? parseFloat(planCredits.total) : 300;
      }

      if (usageResponse.status === "fulfilled") {
        const usageData = usageResponse.value.data || {};
        creditBreakdown = {
          productionDeploys: usageData.production_deploys?.credits_used
            ? Number(
                parseFloat(usageData.production_deploys.credits_used).toFixed(
                  1,
                ),
              )
            : 0,
          compute:
            usageData.compute?.credits_used || usageData.functions?.credits_used
              ? Number(
                  parseFloat(
                    usageData.compute?.credits_used ||
                      usageData.functions?.credits_used,
                  ).toFixed(2),
                )
              : 0,
          aiInference: usageData.ai_inference?.credits_used
            ? Number(parseFloat(usageData.ai_inference.credits_used).toFixed(2))
            : 0,
          bandwidth: usageData.bandwidth?.credits_used
            ? Number(parseFloat(usageData.bandwidth.credits_used).toFixed(2))
            : 0,
          webRequests: usageData.web_requests?.credits_used
            ? Number(parseFloat(usageData.web_requests.credits_used).toFixed(2))
            : 0,
          formSubmissions: usageData.form_submissions?.credits_used
            ? Number(
                parseFloat(usageData.form_submissions.credits_used).toFixed(1),
              )
            : 0,
        };
      }
    } catch (err) {
      console.warn("[getNetlifyUsage] Error fetching unified credits", err);
    }

    const creditsPercent =
      creditsLimit > 0
        ? parseFloat(((creditsUsed / creditsLimit) * 100).toFixed(1))
        : 0;

    return {
      bandwidth: {
        used: bandwidthUsed,
        included: bandwidthLimit,
        used_percent: parseFloat(
          ((bandwidthUsed / bandwidthLimit) * 100).toFixed(1),
        ),
      },
      credits: {
        used: creditsUsed,
        included: creditsLimit,
        used_percent: creditsPercent,
      },
      credit_breakdown: creditBreakdown,
      site_name: siteData.name,
      last_deploy_at:
        siteData.published_deploy?.published_at || siteData.updated_at || null,
      next_billing_period_start: accountData?.next_billing_period_start || null,
    };
  } catch (error) {
    console.error("[getNetlifyUsage] Error fetching Netlify data:", error);
    return null;
  }
};
