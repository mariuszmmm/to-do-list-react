import type { Handler } from "@netlify/functions";
import axios from "axios";
import { connectToDB } from "../config/mongoose";
import UserData from "../models/UserData";
import { jsonResponse } from "../shared/lib/response";
import { checkHttpMethod, isUserAdmin } from "../shared/lib/validators";

export const handler: Handler = async (event, context) => {
  const logPrefix = '[user-list]';

  const methodResponse = checkHttpMethod(event.httpMethod, "GET", logPrefix);
  if (methodResponse) return methodResponse;

  const identity = context.clientContext?.identity;
  const contextUser = context.clientContext?.user;
  const userEmail = contextUser?.email?.toLowerCase().trim();
  const isAdmin = isUserAdmin(context) || userEmail === "mariuszmmm@op.pl";

  if (!isAdmin) {
    console.warn(`${logPrefix} User ${userEmail} is not an admin`);
    return jsonResponse(403, {
      message: "Only administrators can list users.",
    });
  }

  // Używamy URL z kontekstu lub próbujemy produkcyjnego jako fallback
  const baseUrl =
    identity?.url || "https://to-do-list.myprojects.pl/.netlify/identity";

  try {
    await connectToDB();

    console.log(
      `${logPrefix} Calling Identity Admin API at: ${baseUrl}/admin/users`,
    );

    const identityResponse = await axios.get(`${baseUrl}/admin/users`, {
      headers: { Authorization: `Bearer ${identity?.token}` },
    });

    // GoTrue Admin API zwraca listę w polu .users
    const identityUsers = (identityResponse.data?.users || []) as any[];
    console.log(`${logPrefix} Identity users count: ${identityUsers.length}`);

    const dbUsers = (await UserData.find(
      {},
      { email: 1, account: 1, _id: 0 },
    ).lean()) as any[];
    console.log(`${logPrefix} DB users count: ${dbUsers.length}`);

    interface UserResult {
      email: string;
      account: "active" | "pending" | "deleted";
    }

    // Mapujemy użytkowników z Identity
    const combinedUsers: UserResult[] = identityUsers.map((u: any) => {
      const email = (u.email || "").toLowerCase();
      const dbUser = dbUsers.find(
        (du) => (du.email || "").toLowerCase() === email,
      );

      let status: "active" | "pending" | "deleted" = "active";
      if (dbUser?.account === "deleted") {
        status = "deleted";
      } else if (!u.confirmed_at) {
        status = "pending";
      }

      return {
        email: u.email || "unknown",
        account: status,
      };
    });

    // Dodajemy tych z DB, których nie ma w Identity
    dbUsers.forEach((du) => {
      const email = (du.email || "").toLowerCase();
      if (
        email &&
        !combinedUsers.some((cu) => cu.email.toLowerCase() === email)
      ) {
        combinedUsers.push({
          email: du.email,
          account: (du.account as any) || "active",
        });
      }
    });

    const uniqueUsers = combinedUsers.sort((a, b) =>
      a.email.localeCompare(b.email),
    );

    return jsonResponse(200, { users: uniqueUsers });
  } catch (error: any) {
    console.error(
      `${logPrefix} Error:`,
      error?.response?.data || error.message,
    );
    return jsonResponse(500, {
      message: "Failed to fetch users.",
      error: error?.response?.data || error.message,
    });
  }
};
