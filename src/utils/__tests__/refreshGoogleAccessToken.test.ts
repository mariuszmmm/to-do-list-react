import { refreshGoogleAccessToken } from "../refreshGoogleAccessToken";

// Mocks
jest.mock("../getUserToken", () => ({ getUserToken: jest.fn() }));
jest.mock("../../api/googleOAuthApi", () => ({
  refreshGoogleTokenApi: jest.fn(),
}));

const getUserToken = require("../getUserToken").getUserToken;
const refreshGoogleTokenApi =
  require("../../api/googleOAuthApi").refreshGoogleTokenApi;

describe("refreshGoogleAccessToken", () => {
  beforeEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  it("returns null and warns if no refresh token", async () => {
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    const result = await refreshGoogleAccessToken();
    expect(result).toBeNull();
    expect(warnSpy).toHaveBeenCalledWith(
      "[refreshGoogleAccessToken] No refresh token available"
    );
    warnSpy.mockRestore();
  });

  it("returns null and errors if no user token", async () => {
    sessionStorage.setItem("google_drive_refresh_token", "refresh");
    getUserToken.mockResolvedValue(null);
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const result = await refreshGoogleAccessToken();
    expect(result).toBeNull();
    expect(errorSpy).toHaveBeenCalledWith(
      "[refreshGoogleAccessToken] No user token"
    );
    errorSpy.mockRestore();
  });

  it("refreshes token and stores new access token", async () => {
    sessionStorage.setItem("google_drive_refresh_token", "refresh");
    getUserToken.mockResolvedValue("user-token");
    refreshGoogleTokenApi.mockResolvedValue({ accessToken: "new-access" });
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    const result = await refreshGoogleAccessToken();
    expect(result).toBe("new-access");
    expect(sessionStorage.getItem("google_drive_access_token")).toBe(
      "new-access"
    );
    expect(logSpy).toHaveBeenCalledWith(
      "[refreshGoogleAccessToken] Token refreshed successfully"
    );
    logSpy.mockRestore();
  });

  it("handles error and removes tokens", async () => {
    sessionStorage.setItem("google_drive_refresh_token", "refresh");
    getUserToken.mockResolvedValue("user-token");
    refreshGoogleTokenApi.mockRejectedValue(new Error("fail"));
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const result = await refreshGoogleAccessToken();
    expect(result).toBeNull();
    expect(sessionStorage.getItem("google_drive_access_token")).toBeNull();
    expect(sessionStorage.getItem("google_drive_refresh_token")).toBeNull();
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
