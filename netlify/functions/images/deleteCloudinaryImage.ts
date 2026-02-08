import axios from "axios";
import { createHash } from "crypto";
import { logError } from "../lib/response";

export const deleteCloudinaryImage = async (publicId?: string) => {
  const logPrefix = "[deleteCloudinaryImage]";

  if (!publicId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing publicId parameter" }),
    };
  }

  const API_SECRET = process.env.CLOUDINARY_API_SECRET;
  const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
  const API_KEY = process.env.CLOUDINARY_API_KEY;

  if (!API_SECRET || !CLOUD_NAME || !API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing Cloudinary configuration" }),
    };
  }

  try {
    const timestamp = Math.floor(Date.now() / 1000);
    const params = `invalidate=true&public_id=${publicId}&timestamp=${timestamp}${API_SECRET}`;
    const signature = createHash("sha1").update(params).digest("hex");

    const body = new URLSearchParams({
      api_key: API_KEY,
      invalidate: "true",
      public_id: publicId,
      signature,
      timestamp: String(timestamp),
    });

    const destroyUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`;
    const res = await axios.post(destroyUrl, body);

    return {
      statusCode: 200,
      body: JSON.stringify(res.data),
    };
  } catch (error: any) {
    logError("Unexpected error in deleteCloudinaryImage handler", error, logPrefix);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
