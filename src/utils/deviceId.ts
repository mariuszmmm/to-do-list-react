import { nanoid } from "nanoid";

const DEVICE_ID_KEY = "deviceId";

export const getOrCreateDeviceId = (): string => {
  let id = sessionStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = nanoid();
    sessionStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
};
