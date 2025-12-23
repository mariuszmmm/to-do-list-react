import {
  checkClientContext,
  checkEventBody,
  checkAdminRole,
  checkHttpMethod,
  parseBackupRequest,
  validateBackupType,
  validateBackupUsers,
  checkWebhookSecret,
  checkWebhookSignature,
} from "../validators";

describe("validators utils", () => {
  describe("checkClientContext", () => {
    it("returns 401 if no user in context", () => {
      const context: any = { clientContext: null };
      const res = checkClientContext(context, "[test]");
      expect(res?.statusCode).toBe(401);
      expect(JSON.parse(res?.body || "{}")).toEqual({
        message: "Authentication required. Please log in to continue.",
        source: "user",
      });
    });
    it("returns null if user exists", () => {
      const context: any = { clientContext: { user: { id: "1" } } };
      expect(checkClientContext(context)).toBeNull();
    });
  });

  describe("checkEventBody", () => {
    it("returns 400 if body is missing", () => {
      const res = checkEventBody(null);
      expect(res?.statusCode).toBe(400);
      expect(JSON.parse(res?.body || "{}")).toEqual({
        message: "Request body is required.",
      });
    });
    it("returns null if body exists", () => {
      expect(checkEventBody("test")).toBeNull();
    });
  });

  describe("checkAdminRole", () => {
    it("returns 403 if user is not admin", () => {
      const context: any = {
        clientContext: { user: { app_metadata: { roles: [] } } },
      };
      const res = checkAdminRole(context);
      expect(res?.statusCode).toBe(403);
      expect(JSON.parse(res?.body || "{}")).toEqual({
        message: "Insufficient permissions. Administrator access required.",
      });
    });
    it("returns null if user is admin", () => {
      const context: any = {
        clientContext: { user: { app_metadata: { roles: ["admin"] } } },
      };
      expect(checkAdminRole(context)).toBeNull();
    });
  });

  describe("checkHttpMethod", () => {
    it("returns 405 if method is not allowed", () => {
      const res = checkHttpMethod("GET", "POST");
      expect(res?.statusCode).toBe(405);
      expect(JSON.parse(res?.body || "{}")).toEqual({
        message: "Invalid HTTP method. Only POST is allowed.",
      });
    });
    it("returns null if method is allowed", () => {
      expect(checkHttpMethod("POST", "POST")).toBeNull();
    });
  });

  describe("parseBackupRequest", () => {
    it("returns 400 if body is missing", () => {
      const res = parseBackupRequest(null);
      expect(res).toHaveProperty("statusCode", 400);
      expect(JSON.parse((res as any)?.body || "{}")).toEqual({
        message: "Request body is required.",
      });
    });
    it("returns 400 if JSON is invalid", () => {
      const res = parseBackupRequest("{bad json");
      expect(res).toHaveProperty("statusCode", 400);
      expect(JSON.parse((res as any)?.body || "{}")).toEqual({
        message: "Malformed JSON in request body.",
      });
    });
    it("returns 400 if fileId or accessToken missing", () => {
      const res = parseBackupRequest(JSON.stringify({ fileId: "a" }));
      expect(res).toHaveProperty("statusCode", 400);
      expect(JSON.parse((res as any)?.body || "{}")).toEqual({
        message:
          "Both 'fileId' and 'accessToken' are required in the request body.",
      });
    });
    it("returns object if fileId and accessToken present", () => {
      expect(
        parseBackupRequest(JSON.stringify({ fileId: "a", accessToken: "b" }))
      ).toEqual({ fileId: "a", accessToken: "b" });
    });
  });

  describe("validateBackupType", () => {
    it("returns 400 if type is wrong", () => {
      const res = validateBackupType("wrong", "expected");
      expect(res?.statusCode).toBe(400);
      expect(JSON.parse(res?.body || "{}")).toEqual({
        message: "Invalid backup type. Expected 'expected'.",
      });
    });
    it("returns null if type matches", () => {
      expect(validateBackupType("expected", "expected")).toBeNull();
    });
  });

  describe("validateBackupUsers", () => {
    it("returns 400 if users is not array", () => {
      const res = validateBackupUsers({});
      expect(res?.statusCode).toBe(400);
      expect(JSON.parse(res?.body || "{}")).toEqual({
        message: "The backup data must include a valid list of users.",
      });
    });
    it("returns null if users is array", () => {
      expect(validateBackupUsers([])).toBeNull();
    });
  });

  describe("checkWebhookSecret", () => {
    const OLD_ENV = process.env;
    beforeEach(() => {
      jest.resetModules();
      process.env = { ...OLD_ENV };
    });
    afterAll(() => {
      process.env = OLD_ENV;
    });
    it("returns 500 if secret missing", () => {
      delete process.env.WEBHOOK_SECRET;
      const res = checkWebhookSecret();
      expect(res).toHaveProperty("statusCode", 500);
      expect(JSON.parse((res as any)?.body || "{}")).toEqual({
        message:
          "Server configuration error. Please contact the administrator.",
      });
    });
    it("returns secret if present", () => {
      process.env.WEBHOOK_SECRET = "abc";
      expect(checkWebhookSecret()).toBe("abc");
    });
  });

  describe("checkWebhookSignature", () => {
    it("returns 400 if signature missing", () => {
      const res = checkWebhookSignature({});
      expect(res).toHaveProperty("statusCode", 400);
      expect(JSON.parse((res as any)?.body || "{}")).toEqual({
        message: "Missing or invalid webhook signature in headers.",
      });
    });
    it("returns signature if present", () => {
      expect(checkWebhookSignature({ "x-webhook-signature": "sig" })).toBe(
        "sig"
      );
    });
  });
});
