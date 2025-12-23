import { getBackupFileName } from "../getBackupFileName";

describe("getBackupFileName", () => {
  it("returns correct file name format", () => {
    const date = new Date("2023-12-17T10:11:12Z");
    const name = getBackupFileName("all-users-backup", date);
    expect(name).toMatch(
      /^all-users-backup_\d{2}-\d{2}-\d{4}_\d{2}-\d{2}-\d{2}\.json$/
    );
  });
});
