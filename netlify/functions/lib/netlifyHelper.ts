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
  concurrent_builds: {
    used: number;
    included: number;
    max: number;
    used_percent: number;
  };
  site_name: string;
  last_deploy_at: string | null;
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

    // 3. Get Account details for credits and concurrent builds
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

    const capabilities = accountData?.capabilities || {};

    // Credits logic
    const creditsUsed = accountData?.credits?.used || 0;
    const creditsLimit =
      accountData?.plan_credits || accountData?.credits?.included || 300;
    const creditsPercent =
      creditsLimit > 0
        ? parseFloat(((creditsUsed / creditsLimit) * 100).toFixed(1))
        : 0;

    // Concurrent builds logic
    const concurrentUsed = capabilities.concurrent_builds?.used || 0;
    const concurrentLimit = capabilities.concurrent_builds?.included || 1;
    const concurrentMax = capabilities.concurrent_builds?.max || 1;
    const concurrentPercent =
      concurrentMax > 0
        ? parseFloat(((concurrentUsed / concurrentMax) * 100).toFixed(1))
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
      concurrent_builds: {
        used: concurrentUsed,
        included: concurrentLimit,
        max: concurrentMax,
        used_percent: concurrentPercent,
      },
      site_name: siteData.name,
      last_deploy_at:
        siteData.published_deploy?.published_at || siteData.updated_at || null,
    };
  } catch (error) {
    console.error("[getNetlifyUsage] Error fetching Netlify data:", error);
    return null;
  }
};
