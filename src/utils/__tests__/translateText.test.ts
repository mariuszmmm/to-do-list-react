import { translateText } from "../translateText";

global.fetch = jest.fn();

describe("translateText", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy.mockRestore();
  });

  it("returns translated text if response is ok and has translatedText", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ translatedText: "foo" }),
    });
    const result = await translateText("bar", "pl");
    expect(result).toBe("foo");
  });

  it("returns null if response is ok but no translatedText", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });
    const result = await translateText("bar", "pl");
    expect(result).toBeNull();
  });

  it("throws error if response is not ok", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: "fail",
    });
    await expect(translateText("bar", "pl")).rejects.toThrow("fail");
  });

  it("logs error and throws if fetch throws", async () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("network"));
    await expect(translateText("bar", "pl")).rejects.toThrow("network");
    expect(spy).toHaveBeenCalledWith(
      "Error fetching translation",
      expect.any(Error)
    );
    spy.mockRestore();
  });
});
