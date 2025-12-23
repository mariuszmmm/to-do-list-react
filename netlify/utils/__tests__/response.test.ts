import { jsonResponse, logError } from "../response";

describe("response utils", () => {
  describe("jsonResponse", () => {
    it("returns correct HandlerResponse", () => {
      const res = jsonResponse(200, { foo: "bar" }, { "X-Test": "1" });
      expect(res.statusCode).toBe(200);
      expect(res.headers?.["Content-Type"]).toBe("application/json");
      expect(res.headers?.["X-Test"]).toBe("1");
      expect(res.body).toBe(JSON.stringify({ foo: "bar" }));
    });
    it("returns correct HandlerResponse without additionalHeaders", () => {
      const res = jsonResponse(201, { bar: "baz" });
      expect(res.statusCode).toBe(201);
      expect(res.headers?.["Content-Type"]).toBe("application/json");
      expect(res.body).toBe(JSON.stringify({ bar: "baz" }));
    });
  });

  describe("logError", () => {
    it("logs error with message and name", () => {
      const spy = jest.spyOn(console, "error").mockImplementation(() => {});
      logError("msg", new Error("fail"), "[prefix]");
      expect(spy).toHaveBeenCalledWith("[prefix] msg (Error)");
      spy.mockRestore();
    });
    it("logs error with unknown type", () => {
      const spy = jest.spyOn(console, "error").mockImplementation(() => {});
      logError("msg", "fail", "[prefix]");
      expect(spy).toHaveBeenCalledWith("[prefix] msg (Error)");
      spy.mockRestore();
    });
    it("logs error with default prefix", () => {
      const spy = jest.spyOn(console, "error").mockImplementation(() => {});
      logError("msg", new Error("fail"));
      expect(spy).toHaveBeenCalledWith("[logError] msg (Error)");
      spy.mockRestore();
    });
    it("logs error with custom object name", () => {
      const spy = jest.spyOn(console, "error").mockImplementation(() => {});
      logError("msg", { name: "CustomError" }, "[prefix]");
      expect(spy).toHaveBeenCalledWith("[prefix] msg (CustomError)");
      spy.mockRestore();
    });
    it("logs error with object name not string", () => {
      const spy = jest.spyOn(console, "error").mockImplementation(() => {});
      logError("msg", { name: 123 }, "[prefix]");
      expect(spy).toHaveBeenCalledWith("[prefix] msg (Error)");
      spy.mockRestore();
    });
    it("logs error with object without name", () => {
      const spy = jest.spyOn(console, "error").mockImplementation(() => {});
      logError("msg", { foo: "bar" }, "[prefix]");
      expect(spy).toHaveBeenCalledWith("[prefix] msg (Error)");
      spy.mockRestore();
    });
    it("logs error with null", () => {
      const spy = jest.spyOn(console, "error").mockImplementation(() => {});
      logError("msg", null, "[prefix]");
      expect(spy).toHaveBeenCalledWith("[prefix] msg (Error)");
      spy.mockRestore();
    });
    it("logs error with undefined", () => {
      const spy = jest.spyOn(console, "error").mockImplementation(() => {});
      logError("msg", undefined, "[prefix]");
      expect(spy).toHaveBeenCalledWith("[prefix] msg (Error)");
      spy.mockRestore();
    });
    it("logs error with object name as empty string", () => {
      const spy = jest.spyOn(console, "error").mockImplementation(() => {});
      logError("msg", { name: "" }, "[prefix]");
      expect(spy).toHaveBeenCalledWith("[prefix] msg ()");
      spy.mockRestore();
    });
  });
});
