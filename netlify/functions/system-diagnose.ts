import type { Handler } from "@netlify/functions";
import { connectToDB } from "../config/mongoose";
import { jsonResponse, logError } from "../shared/lib/response";
import { getCloudinaryUsage } from "../shared/lib/cloudinaryHelper";
import { getGoogleAccessToken } from "../shared/lib/googleDriveHelper";
import {
  checkClientContext,
  checkAdminRole,
  checkHttpMethod,
} from "../shared/lib/validators";
import mongoose from "mongoose";

const handler: Handler = async (event, context) => {
  const logPrefix = "[system-diagnose]";

  const methodResponse = checkHttpMethod(event.httpMethod, "GET", logPrefix);
  if (methodResponse) return methodResponse;

  const authResponse = checkClientContext(context, logPrefix);
  if (authResponse) return authResponse;

  const adminResponse = checkAdminRole(context, logPrefix);
  if (adminResponse) return adminResponse;

  const results: any = {
    database: { status: "pending" },
    cloudinary: { status: "pending" },
    ably: { status: "pending" },
    googleDrive: { status: "pending" },
  };

  try {
    // 1. Test Database
    try {
      await connectToDB();
      const state = mongoose.connection.readyState;
      results.database = {
        status: state === 1 ? "success" : "error",
        details: state === 1 ? "Connected to MongoDB" : "Database not ready",
        state,
      };
    } catch (err: any) {
      results.database = { status: "error", details: err.message };
    }

    // 2. Test Cloudinary
    try {
      const apiKey = process.env.CLOUDINARY_API_KEY;
      const apiSecret = process.env.CLOUDINARY_API_SECRET;
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      
      const pingUrl = `https://api.cloudinary.com/v1_1/${cloudName}/ping`;
      const basicAuth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

      const response = await fetch(pingUrl, {
        headers: {
          'Authorization': `Basic ${basicAuth}`
        }
      });
      
      const status = response.status;
      
      if (status === 200) {
        // Also check if full usage is allowed
        const usage = await getCloudinaryUsage();
        results.cloudinary = {
          status: "success",
          details: usage?.isFallback 
            ? "Connected (Search API fallback - Admin API blocked with 403)" 
            : "Connection successful (Full Admin API access)",
        };
      } else {
        results.cloudinary = {
          status: "error",
          details: `Ping failed with status: ${status}`,
        };
      }
    } catch (err: any) {
      results.cloudinary = { status: "error", details: err.message };
    }

    // 3. Test Ably
    try {
      const ablyKey = process.env.ABLY_API_KEY;
      if (!ablyKey) {
        results.ably = { status: "error", details: "Missing ABLY_API_KEY" };
      } else {
        const Ably = require("ably");
        const ably = new Ably.Rest({ key: ablyKey });
        await ably.time();
        results.ably = {
          status: "success",
          details: "Ably SDK connection successful",
        };
      }
    } catch (err: any) {
      results.ably = { status: "error", details: err.message };
    }

    // 4. Test Google Drive (System Account)
    try {
      const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
      const refreshToken = process.env.GOOGLE_BACKUP_REFRESH_TOKEN || "";

      if (!clientId || !clientSecret) {
        results.googleDrive = {
          status: "error",
          details: "Missing Google configuration (ID/Secret)",
        };
      } else {
        const token = await getGoogleAccessToken(
          clientId,
          clientSecret,
          refreshToken,
        );
        results.googleDrive = {
          status: token ? "success" : "error",
          details: token
            ? "Refresh token exchange successful"
            : "Session expired. Click 'Authorize Google' in UI to renew.",
        };
      }
    } catch (err: any) {
      results.googleDrive = { status: "error", details: err.message };
    }

    return jsonResponse(200, {
      message: "Diagnosis completed successfully",
      results,
    });
  } catch (error) {
    logError("Error during system diagnosis", error, logPrefix);
    return jsonResponse(500, { message: "Internal server error" });
  }
};

export { handler };
