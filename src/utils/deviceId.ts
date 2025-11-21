import { nanoid } from "nanoid";

const DEVICE_ID_KEY = "deviceId";

export function getOrCreateDeviceId(): string {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = nanoid(8);
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}
