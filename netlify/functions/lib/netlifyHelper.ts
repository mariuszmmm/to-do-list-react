import axios from "axios";

export interface NetlifyUsage {
  bandwidth: {
    used: number;
    included: number;
    used_percent: number;
  };
  build_minutes: {
    used: number;
    included: number;
    used_percent: number;
  };
  functions: {
    used: number;
    included: number;
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

    // 2. Get bandwidth usage
    const bandwidthUsed = siteData.bandwidth_used || 0;
    const bandwidthLimit = 100 * 1024 * 1024 * 1024; // 100GB default free

    // Build minutes
    const buildMinutesUsed = siteData.build_time?.used || 0;
    const buildMinutesLimit = 300; // 300 min default free

    return {
      bandwidth: {
        used: bandwidthUsed,
        included: bandwidthLimit,
        used_percent: parseFloat(
          ((bandwidthUsed / bandwidthLimit) * 100).toFixed(1),
        ),
      },
      build_minutes: {
        used: buildMinutesUsed,
        included: buildMinutesLimit,
        used_percent: parseFloat(
          ((buildMinutesUsed / buildMinutesLimit) * 100).toFixed(1),
        ),
      },
      functions: {
        used: siteData.functions_usage?.used || 0,
        included: 125000, // 125k default free
        used_percent: parseFloat(
          (((siteData.functions_usage?.used || 0) / 125000) * 100).toFixed(1),
        ),
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
