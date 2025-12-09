// Netlify function to export user data for backup
import type { Handler } from "@netlify/functions";
import UserData from "./models/UserData";
import { connectToDB } from "./config/mongoose";

const handler: Handler = async (event, context) => {
  console.log("[backupData] Function invoked");

  // Check for authentication
  if (!context.clientContext || !context.clientContext.user) {
    console.log("[backupData] Unauthorized access attempt");
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Unauthorized" }),
    };
  }

  // Connect to database
  await connectToDB();

  try {
    // Extract user email
    const { email }: { email: string } = context.clientContext.user;
    console.log(`[backupData] Creating backup for admin user: ${email}`);

    // Find all users' data (admin backup)
    const allUserData = await UserData.find({ account: "active" });
    if (!allUserData || allUserData.length === 0) {
      console.log(`[backupData] No user data found`);
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "No user data found" }),
      };
    }

    // Calculate totals across all users
    let totalLists = 0;
    let totalTasks = 0;

    allUserData.forEach((userData) => {
      totalLists += userData.lists?.length || 0;
      userData.lists?.forEach((list: any) => {
        totalTasks += list.taskList?.length || 0;
      });
    });

    // Create backup object with all users' data
    const backupData = {
      version: "1.0",
      timestamp: new Date().toISOString(),
      backupType: "admin-full-backup",
      createdBy: email,
      users: allUserData.map((userData) => ({
        email: userData.email,
        lists: userData.lists || [],
        listsCount: userData.lists?.length || 0,
        tasksCount:
          userData.lists?.reduce(
            (sum: number, list: any) => sum + (list.taskList?.length || 0),
            0
          ) || 0,
      })),
      totalUsers: allUserData.length,
      totalLists,
      totalTasks,
    };

    console.log(
      `[backupData] Full backup created successfully for admin: ${email}. Users: ${allUserData.length}, Lists: ${totalLists}, Tasks: ${totalTasks}`
    );
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="backup-full-${
          new Date().toISOString().split("T")[0]
        }.json"`,
      },
      body: JSON.stringify(backupData),
    };
  } catch (error) {
    console.error("[backupData] Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};

export { handler };
