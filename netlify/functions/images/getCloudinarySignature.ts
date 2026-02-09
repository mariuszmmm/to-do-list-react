import { createHash } from "crypto";

export const getCloudinarySignature = (taskId?: string) => {
  const API_SECRET = process.env.CLOUDINARY_API_SECRET;
  const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
  const API_KEY = process.env.CLOUDINARY_API_KEY;
  const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET;

  if (!API_SECRET || !CLOUD_NAME || !API_KEY || !UPLOAD_PRESET) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing Cloudinary configuration" }),
    };
  }

  const timestamp = Math.round(Date.now() / 1000);
  const asset_folder = "Todo-list/temp_uploads";

  const baseParams: Record<string, string> = {
    asset_folder,
    invalidate: "true",
    overwrite: "true",
    timestamp: String(timestamp),
    upload_preset: UPLOAD_PRESET,
  };

  // Dodaj taskId do context (metadata)
  if (taskId) {
    baseParams.context = `taskId=${taskId}`;
  }

  const params: Record<string, string | number> = {
    ...baseParams,
    // ...(publicId && { public_id: publicId }),
  };

  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  const signature = createHash("sha1")
    .update(sortedParams + API_SECRET)
    .digest("hex");

  return {
    statusCode: 200,
    body: JSON.stringify({
      apiKey: API_KEY,
      asset_folder,
      cloudName: CLOUD_NAME,
      timestamp,
      signature,
      uploadPreset: UPLOAD_PRESET,
      context: taskId ? `taskId=${taskId}` : undefined,
    }),
  };
};
