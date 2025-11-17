import Ably from "ably";

const ably = new Ably.Realtime({
  key: process.env.REACT_APP_ABLY_API_KEY,
});

export default ably;
