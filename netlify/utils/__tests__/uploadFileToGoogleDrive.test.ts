import { uploadBackupToGoogleDrive } from "../uploadBackupToGoogleDrive";
global.fetch = jest.fn();

describe("uploadBackupToGoogleDrive", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns success if upload ok", async () => {
    jest
      .spyOn(require("../findOrCreateFolder"), "findOrCreateFolder")
      .mockResolvedValue("folderId");
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: "fileId", name: "fileName" }),
    });
    const res = await uploadBackupToGoogleDrive("file.json", "{}", "token");
    expect(res.success).toBe(true);
    expect(res.fileId).toBe("fileId");
  });

  it("returns error if upload fails", async () => {
    jest
      .spyOn(require("../findOrCreateFolder"), "findOrCreateFolder")
      .mockResolvedValue("folderId");
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: { message: "fail" } }),
    });
    const res = await uploadBackupToGoogleDrive("file.json", "{}", "token");
    expect(res.success).toBe(false);
    expect(res.message).toBe("fail");
  });
});
