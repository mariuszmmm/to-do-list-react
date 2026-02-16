import { Handler } from "@netlify/functions";
import { checkClientContext } from "./lib/validators";
import { getCloudinarySignature } from "./images/getCloudinarySignature";
import { deleteCloudinaryImage } from "./images/deleteCloudinaryImage";
import { moveCloudinaryImageToFolder } from "./images/moveCloudinaryImageToFolder";
import { jsonResponse } from "./lib/response";

const handler: Handler = async (event, context) => {
  const logPrefix = "[Cloudinary Image API]";

  const params = (event.queryStringParameters || {}) as {
    publicId: string;
    folder: string;
    oldPublicId: string;
    userEmail: string;
    listId: string;
    listName: string;
    taskId: string;
    deviceId: string;
  };

  const authResponse = checkClientContext(context, logPrefix);
  if (authResponse) return authResponse;

  switch (event.httpMethod) {
    case "GET":
      return getCloudinarySignature();
    case "PUT":
      return moveCloudinaryImageToFolder(params, context, "[moveCloudinaryImageToFolder]");
    case "DELETE":
      return deleteCloudinaryImage(params, context, "[deleteCloudinaryImage]");
    default:
      return jsonResponse(405, { error: "Method Not Allowed" });
  }
};

export { handler };
