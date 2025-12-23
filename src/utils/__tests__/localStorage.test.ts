import {
  clearLocalStorage,
  saveSettingsInLocalStorage,
  getSettingsFromLocalStorage,
  saveListMetadataInLocalStorage,
  getListMetadataFromLocalStorage,
  saveTasksInLocalStorage,
  getTasksFromLocalStorage,
  saveArchivedListsInLocalStorage,
  getArchivedListsFromLocalStorage,
  saveAutoRefreshSettingInLocalStorage,
  getAutoRefreshSettingFromLocalStorage,
} from "../localStorage";

describe("localStorage utils", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  it("clearLocalStorage clears storage", () => {
    localStorage.setItem("foo", "bar");
    clearLocalStorage();
    expect(localStorage.getItem("foo")).toBeNull();
  });

  it("saveSettingsInLocalStorage and getSettingsFromLocalStorage", () => {
    const settings = { theme: "dark", language: "pl" };
    saveSettingsInLocalStorage(settings as any);
    expect(getSettingsFromLocalStorage()).toEqual(settings);
  });

  it("getSettingsFromLocalStorage returns null if not set", () => {
    expect(getSettingsFromLocalStorage()).toBeNull();
  });

  it("saveListMetadataInLocalStorage and getListMetadataFromLocalStorage", () => {
    const meta = { id: "1", date: "2020", name: "n", updatedAt: "2021" };
    saveListMetadataInLocalStorage(meta as any);
    expect(getListMetadataFromLocalStorage()).toEqual(meta);
  });

  it("getListMetadataFromLocalStorage returns undefined if not set", () => {
    expect(getListMetadataFromLocalStorage()).toBeUndefined();
  });

  it("getListMetadataFromLocalStorage returns undefined if missing fields", () => {
    saveListMetadataInLocalStorage({ id: "1" } as any);
    expect(getListMetadataFromLocalStorage()).toBeUndefined();
  });

  it("saveTasksInLocalStorage and getTasksFromLocalStorage", () => {
    const tasks = [{ id: "1", text: "a" }];
    saveTasksInLocalStorage(tasks as any);
    expect(getTasksFromLocalStorage()).toEqual(tasks);
  });

  it("getTasksFromLocalStorage returns empty array if not set", () => {
    expect(getTasksFromLocalStorage()).toEqual([]);
  });

  it("saveArchivedListsInLocalStorage and getArchivedListsFromLocalStorage", () => {
    const lists = [{ id: "1", name: "a" }];
    saveArchivedListsInLocalStorage(lists as any);
    expect(getArchivedListsFromLocalStorage()).toEqual(lists);
  });

  it("getArchivedListsFromLocalStorage returns empty array if not set", () => {
    expect(getArchivedListsFromLocalStorage()).toEqual([]);
  });

  it("saveAutoRefreshSettingInLocalStorage and getAutoRefreshSettingFromLocalStorage", () => {
    saveAutoRefreshSettingInLocalStorage(true);
    expect(getAutoRefreshSettingFromLocalStorage()).toBe(true);
    saveAutoRefreshSettingInLocalStorage(false);
    expect(getAutoRefreshSettingFromLocalStorage()).toBe(false);
  });

  it("getAutoRefreshSettingFromLocalStorage returns true if not set", () => {
    expect(getAutoRefreshSettingFromLocalStorage()).toBe(true);
  });

  it("getAutoRefreshSettingFromLocalStorage returns false for string 'false'", () => {
    localStorage.setItem("autoRefreshEnabled", "false");
    expect(getAutoRefreshSettingFromLocalStorage()).toBe(false);
  });

  it("getAutoRefreshSettingFromLocalStorage returns true for string 'true'", () => {
    localStorage.setItem("autoRefreshEnabled", "true");
    expect(getAutoRefreshSettingFromLocalStorage()).toBe(true);
  });

  it("getAutoRefreshSettingFromLocalStorage returns false for invalid value", () => {
    localStorage.setItem("autoRefreshEnabled", "foo");
    expect(getAutoRefreshSettingFromLocalStorage()).toBe(false);
  });
});
