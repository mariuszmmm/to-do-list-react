import { findActiveUser } from "../database";
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

describe("findActiveUser", () => {
  it("returns user if found", async () => {
    const user = { email: "a", account: "active" };
    jest
      .spyOn(UserData, "findOne")
      .mockReturnValueOnce({ exec: () => Promise.resolve(user) } as any);
    const result = await findActiveUser("a");
    expect(result).toBe(user);
  });
  it("returns 404 if not found", async () => {
    jest
      .spyOn(UserData, "findOne")
      .mockReturnValueOnce({ exec: () => Promise.resolve(null) } as any);
    const result = await findActiveUser("a");
    expect((result as any).statusCode).toBe(404);
  });
  it("returns 500 on error", async () => {
    jest.spyOn(UserData, "findOne").mockReturnValueOnce({
      exec: () => {
        throw new Error("fail");
      },
    } as any);
    const result = await findActiveUser("a");
    expect((result as any).statusCode).toBe(500);
  });
});
