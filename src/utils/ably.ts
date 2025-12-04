// import Ably from "ably";
// import { getOrCreateDeviceId } from "./deviceId";

// const clientId = getOrCreateDeviceId();

// const ably = new Ably.Realtime({
//   key: process.env.REACT_APP_ABLY_API_KEY,
//   clientId,
// });

// export default ably;

import Ably from "ably";
// import { getOrCreateDeviceId } from "./deviceId";

// const clientId = getOrCreateDeviceId();

const ably = new Ably.Realtime({
  authUrl: "/.netlify/functions/auth-token",
  authMethod: "GET", // domyślnie GET
  authHeaders: {
    // dodatkowe nagłówki jeśli potrzebne
  },
  authParams: {
    // dodatkowe parametry query jeśli potrzebne
  },
});

export default ably;

// export {};
