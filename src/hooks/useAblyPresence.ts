// import { useEffect, useState } from "react";
// import ably from "../utils/ably";

// export const useAblyPresence = (channelName: string, userId: string) => {
//   const [membersCount, setMembersCount] = useState(0);

//   useEffect(() => {
//     if (!channelName || !userId) return;
//     const channel = ably.channels.get(channelName);
//     let isMounted = true;

//     // Raportowanie obecności do backendu co 30 sekund
//     const reportPresence = () => {
//       fetch("/.netlify/functions/reportPresence", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId }),
//       })
//         .then(() => {
//           console.log("Presence reported for", userId);
//         })
//         .catch((err) => {
//           console.error("Presence report error", err);
//         });
//     };
//     reportPresence();
//     const interval = setInterval(reportPresence, 30000);

//     const updateCount = () => {
//       (channel.presence.get as any)((err: any, members: any[]) => {
//         if (!err && isMounted) {
//           setMembersCount(Array.isArray(members) ? members.length : 0);
//         }
//       });
//     };

//     channel.presence.enter({ userId });
//     updateCount();
//     channel.presence.subscribe("enter", updateCount);
//     channel.presence.subscribe("leave", updateCount);

//     return () => {
//       isMounted = false;
//       channel.presence.leave();
//       channel.presence.unsubscribe("enter", updateCount);
//       channel.presence.unsubscribe("leave", updateCount);
//       clearInterval(interval);
//     };
//   }, [channelName, userId]);

//   return membersCount;
// };

export {};
