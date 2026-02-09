import { Handler } from "@netlify/functions";
import { checkClientContext } from "./lib/validators";
import { getCloudinarySignature } from "./images/getCloudinarySignature";
import { deleteCloudinaryImage } from "./images/deleteCloudinaryImage";
import { moveCloudinaryImageToFolder } from "./images/moveCloudinaryImageToFolder";

const handler: Handler = async (event, context) => {
  const logPrefix = "[Netlify Function: Cloudinary Image API]";

  const authResponse = checkClientContext(context, logPrefix);
  if (authResponse) return authResponse;

  const { publicId, folder } = event.queryStringParameters || {};

  switch (event.httpMethod) {
    case "GET":
      return getCloudinarySignature();
    case "POST":
      return moveCloudinaryImageToFolder(publicId, folder);
    case "DELETE":
      return deleteCloudinaryImage(publicId);
    default:
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method Not Allowed" }),
      };
  }
};

export { handler };
