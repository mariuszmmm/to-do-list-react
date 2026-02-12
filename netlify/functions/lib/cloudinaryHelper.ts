import cloudinary from "../../config/cloudinary";

export const deleteCloudinaryImagesByListId = async (listId: string, logPrefix: string) => {
  try {
    const searchResults = await cloudinary.search
      .expression(`folder:Todo-list/* AND context.listId="${listId}"`)
      .execute();
    console.log(`${logPrefix} Found ${searchResults.total_count} images in Cloudinary for list ID: ${listId}`);

    if (searchResults.resources && searchResults.resources.length > 0) {
      const publicIds = searchResults.resources.map((resource: any) => resource.public_id);
      console.log(`${logPrefix} Public IDs to delete:`, publicIds);

      // Delete with parallelization in batches of 10 with invalidate
      const destroyPromises = [];
      for (let i = 0; i < publicIds.length; i += 10) {
        const batch = publicIds.slice(i, i + 10);
        for (const publicId of batch) {
          destroyPromises.push(cloudinary.uploader.destroy(publicId, { invalidate: true }));
        }
        await Promise.all(destroyPromises);
        destroyPromises.length = 0; // Clear array for next batch
      }

      console.log(`${logPrefix} Deleted ${publicIds.length} images from Cloudinary for list: ${listId}`);
      return publicIds.length;
    }

    return 0;
  } catch (cloudinaryError: any) {
    console.warn(`${logPrefix} Failed to delete images from Cloudinary:`, cloudinaryError.message || cloudinaryError);
    // Don't fail the entire operation if Cloudinary deletion fails
    throw cloudinaryError;
  }
};
