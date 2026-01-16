import type { HandlerResponse } from "@netlify/functions";

export const jsonResponse = (
  statusCode: number,
  body: Record<string, unknown> = {},
  additionalHeaders?: Record<string, string>
): HandlerResponse => {
  return {
    statusCode,
    headers: { "Content-Type": "application/json", ...additionalHeaders },
    body: JSON.stringify(body),
  };
};

export const logError = (
  message: string,
  error: unknown,
  logPrefix = "[logError]"
): void => {
  let errorName = "Error";
  if (error instanceof Error) {
    errorName = error.name;
  } else if (
    typeof error === "object" &&
    error !== null &&
    Object.prototype.hasOwnProperty.call(error, "name") &&
    typeof (error as any).name === "string"
  ) {
    errorName = (error as any).name;
  }
  console.error(`${logPrefix} ${message} (${errorName}) error:`, error);
};
