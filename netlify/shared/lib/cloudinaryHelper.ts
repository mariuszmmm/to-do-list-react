import cloudinary from "../../config/cloudinary";

export const deleteCloudinaryImagesByListId = async (
  listId: string,
  logPrefix: string,
) => {
  try {
    const searchResults = await cloudinary.search
      .expression(`folder:Todo-list/* AND context.listId="${listId}"`)
      .execute();
    console.log(
      `${logPrefix} Found ${searchResults.total_count} images in Cloudinary for list ID: ${listId}`,
    );

    if (searchResults.resources && searchResults.resources.length > 0) {
      const publicIds = searchResults.resources.map(
        (resource: any) => resource.public_id,
      );
      console.log(`${logPrefix} Public IDs to delete:`, publicIds);

      // Delete with parallelization in batches of 10 with invalidate
      const destroyPromises = [];
      for (let i = 0; i < publicIds.length; i += 10) {
        const batch = publicIds.slice(i, i + 10);
        for (const publicId of batch) {
          destroyPromises.push(
            cloudinary.uploader.destroy(publicId, { invalidate: true }),
          );
        }
        await Promise.all(destroyPromises);
        destroyPromises.length = 0; // Clear array for next batch
      }

      console.log(
        `${logPrefix} Deleted ${publicIds.length} images from Cloudinary for list: ${listId}`,
      );
      return publicIds.length;
    }

    return 0;
  } catch (cloudinaryError: any) {
    console.warn(
      `${logPrefix} Failed to delete images from Cloudinary:`,
      cloudinaryError.message || cloudinaryError,
    );
    // Don't fail the entire operation if Cloudinary deletion fails
    throw cloudinaryError;
  }
};

export const getCloudinaryUsage = async () => {
  try {
    const usage = await cloudinary.api.usage();

    console.log("[getCloudinaryUsage] Usage:", usage);

    const storageUsed = usage.storage?.usage || 0;
    const defaultFreeLimit = 25 * 1024 * 1024 * 1024;
    const storageLimit = usage.storage?.limit || defaultFreeLimit;
    const storagePercent = ((storageUsed / storageLimit) * 100).toFixed(1);

    return {
      storage: {
        used: storageUsed,
        limit: storageLimit,
        used_percent: parseFloat(storagePercent),
        usage_gb: (storageUsed / (1024 * 1024 * 1024)).toFixed(3),
        limit_gb: (storageLimit / (1024 * 1024 * 1024)).toFixed(2),
      },
      resources: {
        used: usage.resources?.usage || usage.objects?.usage || 0,
        limit: usage.resources?.limit || usage.objects?.limit || 0,
      },
      transformations: {
        used: usage.transformations?.usage || 0,
        limit: usage.transformations?.limit || 0,
      },
      bandwidth: {
        used: usage.bandwidth?.usage || 0,
        limit: usage.bandwidth?.limit || 0,
        usage_gb: (
          (usage.bandwidth?.usage || 0) /
          (1024 * 1024 * 1024)
        ).toFixed(3),
        limit_gb: (
          (usage.bandwidth?.limit || 0) /
          (1024 * 1024 * 1024)
        ).toFixed(2),
      },
      credits: {
        used: usage.credits?.usage || 0,
        limit: usage.credits?.limit || 0,
        used_percent: usage.credits?.used_percent || 0,
      },
      requests: {
        used: usage.requests?.usage || 0,
        limit: usage.requests?.limit || 0,
      },
      impressions: {
        used: usage.requests?.usage || usage.impressions?.usage || 0,
        limit: usage.requests?.limit || usage.impressions?.limit || 0,
      },
      credit_breakdown: {
        transformations: usage.transformations?.credits_usage || 0,
        bandwidth: usage.bandwidth?.credits_usage || 0,
        storage: usage.storage?.credits_usage || 0,
        impressions: usage.impressions?.credits_usage || 0,
      },
    };
  } catch (error: any) {
    // 403 Forbidden is a known issue on new Cloudinary environments (dw1at4kxe) 
    // where RBAC (Assign Roles) blocks usage stats for Admin API by default.
    if (error?.error?.http_code === 403) {
      console.warn("[getCloudinaryUsage] Admin API usage blocked (403 forbidden). Triggering limited fallback stats.");
      
      try {
        // Fallback: Use Search API to get basic totals (files & bytes)
        // Search API is usually enabled on new accounts even when Admin API /usage is blocked.
        const searchData = await cloudinary.search
          .expression('resource_type:image OR resource_type:video')
          .max_results(1) // We just need total_count
          .execute();
          
        const totalFiles = searchData.total_count || 0;
        
        // Unfortunately, the Search API total_count doesn't give us total bytes easily without listing everything.
        // We return a set of minimal stats so the UI doesn't collapse.
        
        return {
          isFallback: true,
          storage: {
            used: 0,
            limit: 25 * 1024 * 1024 * 1024,
            used_percent: 0,
            usage_gb: "0.00",
            limit_gb: "25.00",
          },
          resources: {
            used: totalFiles,
            limit: "N/A",
          },
          transformations: { used: 0, limit: 25000 },
          bandwidth: { used: 0, limit: 25 * 1024 * 1024 * 1024, usage_gb: "0.00", limit_gb: "25.00" },
          credits: { used: 0, limit: 25, used_percent: 0 },
          credit_breakdown: { transformations: 0, bandwidth: 0, storage: 0, impressions: 0 },
        };
      } catch (searchError) {
        console.error("[getCloudinaryUsage] Fallback also failed:", searchError);
        return null;
      }
    }
    
    console.error("[getCloudinaryUsage] Unexpected Error:", error);
    return null;
  }
};
