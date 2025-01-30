import GoTrue from "gotrue-js";

export const auth = new GoTrue({
  APIUrl: "https://to-do-list-typescript-react.netlify.app/.netlify/identity",
  audience: "",
  setCookie: true, // setCookie(optional): set to be false by default. If you wish to implement the remember me functionality, set the value to be true
});
