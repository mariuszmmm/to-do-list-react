import { getAllUsersForBackup } from "../getAllUsersForBackup";
import UserData from "../../models/UserData";

// Mock UserData z metodami find, findOne
jest.mock("../../models/UserData", () => ({
  __esModule: true,
  default: {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
  },
}));

// Pełny mock mongoose i nanoid (ESM)
jest.mock("mongoose", () => ({
  Schema: function () {
    return {};
  },
  model: () => ({}),
  models: {},
  Document: class {},
}));
jest.mock("nanoid", () => ({ nanoid: () => "mocked-id" }));

describe("getAllUsersForBackup", () => {
  it("throws if no user data", async () => {
    jest.spyOn(UserData, "find").mockResolvedValueOnce([]);
    await expect(getAllUsersForBackup("a")).rejects.toThrow(
      "No user data found"
    );
  });
  it("returns backupData and fileName", async () => {
    jest.spyOn(UserData, "find").mockResolvedValueOnce([
      {
        email: "a",
        account: "active",
        lists: [{ toObject: () => ({ id: 1, taskList: [] }) }],
      },
    ]);
    const result = await getAllUsersForBackup("a");
    expect(result).toHaveProperty("backupData");
    expect(result).toHaveProperty("fileName");
    expect(result.backupData.users?.[0]?.email).toBe("a");
  });
});
