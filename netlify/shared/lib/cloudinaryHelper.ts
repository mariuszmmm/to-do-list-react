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
  } catch (error) {
    console.error("[getCloudinaryUsage] Error:", error);
    return null;
  }
};
