import { Handler } from "@netlify/functions";
import { checkClientContext, checkEventBody } from "../shared/lib/validators";
import { connectToDB } from "../config/mongoose";
import { getData } from "../shared/data/getData";
import { addData } from "../shared/data/addData";
import { removeData } from "../shared/data/removeData";
import { updateData } from "../shared/data/updateData";
import { jsonResponse } from "../shared/lib/response";

const handler: Handler = async (event, context) => {
  const logPrefix = '[data-lists]';

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
