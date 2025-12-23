/* eslint-disable import/first */
// Mocki MUSZĄ być przed importami!
jest.mock("../../config/ably", () => ({
  publishAblyUpdate: {
    bind: jest.fn(),
    call: jest.fn(),
  },
}));
jest.mock("../../models/UserData", () => ({
  __esModule: true,
  default: {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
  },
}));
jest.mock("mongoose", () => ({
  Schema: function () {
    return {};
  },
  model: () => ({}),
  models: {},
  Document: class {},
}));
jest.mock("nanoid", () => ({ nanoid: () => "mocked-id" }));

import { restoreAllUsersFromBackupData } from "../restoreAllUsersFromBackupData";
import UserData from "../../models/UserData";
import { publishAblyUpdate } from "../../config/ably";

describe("restoreAllUsersFromBackupData", () => {
  beforeEach(() => {
    jest.spyOn(UserData, "findOneAndUpdate").mockResolvedValue({} as any);
    (publishAblyUpdate.bind as jest.Mock).mockReturnValue(jest.fn());
    (publishAblyUpdate.call as jest.Mock).mockImplementation(() =>
      Promise.resolve()
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("throws if users is not array", async () => {
    await expect(
      restoreAllUsersFromBackupData({ users: null } as any)
    ).rejects.toThrow();
  });

  it("restores users and returns result", async () => {
    const backupData = {
      users: [
        { email: "a", lists: [], account: "active" },
        { email: "b", lists: [], account: "active" },
      ],
    };
    const result = await restoreAllUsersFromBackupData(backupData as any);
    expect(result.restored + result.failed).toBe(2);
    expect(typeof result.restored).toBe("number");
    expect(typeof result.failed).toBe("number");
  });
});
