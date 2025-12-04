import Ably from "ably";
import { getOrCreateDeviceId } from "./deviceId";

const clientId = getOrCreateDeviceId();

const ably = new Ably.Realtime({
  key: process.env.REACT_APP_ABLY_API_KEY,
  clientId,
});

export default ably;
