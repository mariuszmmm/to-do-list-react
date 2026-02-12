import cloudinary, {
  validateCloudinaryConfig,
  api_key,
  api_secret,
  cloud_name,
  upload_preset,
} from "../../config/cloudinary";

export const getCloudinarySignature = () => {
  const configValidation = validateCloudinaryConfig();
  if (!configValidation.isValid) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: configValidation.error }),
    };
  }

  if (!upload_preset) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing CLOUDINARY_UPLOAD_PRESET" }),
    };
  }

  const timestamp = Math.round(Date.now() / 1000);
  const asset_folder = "Todo-list/temp_uploads";
  const tags = "app-todolist-image,temp";

  const params = {
    asset_folder,
    invalidate: "true",
    overwrite: "true",
    tags,
    timestamp: String(timestamp),
    upload_preset,
  };

  const signature = cloudinary.utils.api_sign_request(params, api_secret!);

  return {
    statusCode: 200,
    body: JSON.stringify({
      api_key,
      asset_folder,
      cloud_name,
      signature,
      tags,
      timestamp,
      upload_preset,
    }),
  };
};
