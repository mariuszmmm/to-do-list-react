import { findOrCreateFolder } from "../findOrCreateFolder";

global.fetch = jest.fn();

describe("findOrCreateFolder", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns folder id if found", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ files: [{ id: "123" }] }),
    });
    const id = await findOrCreateFolder("folder", "token");
    expect(id).toBe("123");
  });

  it("creates folder if not found", async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ files: [] }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: "456" }) });
    const id = await findOrCreateFolder("folder", "token");
    expect(id).toBe("456");
  });

  it("returns null if search fails", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({ ok: false });
    const id = await findOrCreateFolder("folder", "token");
    expect(id).toBeNull();
  });

  it("returns null if create fails", async () => {
    (fetch as jest.Mock)
      .mockResolvedValueOnce({ ok: true, json: async () => ({ files: [] }) })
      .mockResolvedValueOnce({ ok: false });
    const id = await findOrCreateFolder("folder", "token");
    expect(id).toBeNull();
  });

  it("returns null on error", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("fail"));
    const id = await findOrCreateFolder("folder", "token");
    expect(id).toBeNull();
  });
});
