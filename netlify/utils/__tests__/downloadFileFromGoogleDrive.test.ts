import { downloadFileFromGoogleDrive } from "../downloadFileFromGoogleDrive";

global.fetch = jest.fn();

describe("downloadFileFromGoogleDrive", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns data if response is ok", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ foo: "bar" }),
    });
    const data = await downloadFileFromGoogleDrive("id", "token");
    expect(data).toEqual({ foo: "bar" });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("id?alt=media"),
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({ Authorization: expect.any(String) }),
      })
    );
  });

  it("throws error if response not ok", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: { message: "fail" } }),
    });
    await expect(downloadFileFromGoogleDrive("id", "token")).rejects.toThrow(
      "fail"
    );
  });

  it("throws generic error if response not ok and no error message", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: "Not Found",
      json: async () => ({}),
    });
    await expect(downloadFileFromGoogleDrive("id", "token")).rejects.toThrow(
      "Failed to download file: Not Found"
    );
  });

  it("throws generic error if response not ok and json throws", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: "Forbidden",
      json: async () => {
        throw new Error("parse error");
      },
    });
    await expect(downloadFileFromGoogleDrive("id", "token")).rejects.toThrow(
      "Failed to download file: Forbidden"
    );
  });
});
