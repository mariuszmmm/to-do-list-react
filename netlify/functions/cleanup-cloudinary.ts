import { Handler } from "@netlify/functions";

const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const API_KEY = process.env.CLOUDINARY_API_KEY;
  const API_SECRET = process.env.CLOUDINARY_API_SECRET;
  const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;

  if (!API_KEY || !API_SECRET || !CLOUD_NAME) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing Cloudinary configuration" }),
    };
  }

  try {
    const ASSET_FOLDER = "Todo-list/temp_uploads";

    const basicAuth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString("base64");

    const searchUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/search`;
    const searchResponse = await fetch(searchUrl, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        expression: `folder:${ASSET_FOLDER}`,
        max_results: 500,
      }),
    });

    const searchData = (await searchResponse.json()) as any;

    if (!searchData.resources || searchData.resources.length === 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "No resources found in folder",
          folder: ASSET_FOLDER,
          cleaned: 0,
        }),
      };
    }

    const publicIds = searchData.resources.map((r: any) => r.public_id);

    const deleteUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image/upload`;

    const deleteResponse = await fetch(deleteUrl, {
      method: "DELETE",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        public_ids: publicIds,
      }),
    });

    const deleteData = (await deleteResponse.json()) as any;

    if (deleteResponse.ok) {
      const deletedCount = Object.keys(deleteData.deleted || {}).length;
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Cleanup completed",
          folder: ASSET_FOLDER,
          cleaned: deletedCount,
          partial: deleteData.partial || false,
        }),
      };
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Failed to delete resources",
          error: deleteData,
        }),
      };
    }
  } catch (error) {
    console.error("Cleanup error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Failed to cleanup Cloudinary",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};

export { handler };
