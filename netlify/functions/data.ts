import { Handler } from "@netlify/functions";
import { checkClientContext, checkEventBody } from "./lib/validators";
import { connectToDB } from "../config/mongoose";
import { getData } from "./data/getData";
import { addData } from "./data/addData";
import { removeData } from "./data/removeData";
import { updateData } from "./data/updateData";
import { jsonResponse } from "./lib/response";

const handler: Handler = async (event, context) => {
  const logPrefix = "[data]";

  const authResponse = checkClientContext(context, logPrefix);
  if (authResponse) return authResponse;

  if (["PATCH", "PUT", "DELETE"].includes(event.httpMethod)) {
    const bodyResponse = checkEventBody(event.body, logPrefix);
    if (bodyResponse) return bodyResponse;
  }

  await connectToDB();

  switch (event.httpMethod) {
    case "GET":
      return getData(context, "[getData]");
    case "PATCH":
      return addData(event, context, "[addData]");
    case "PUT":
      return updateData(event, context, "[updateData]");
    case "DELETE":
      return removeData(event, context, "[removeData]");
    default:
      return jsonResponse(405, { error: "Method Not Allowed" });
  }
};

export { handler };
