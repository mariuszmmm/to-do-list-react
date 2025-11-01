import GoTrue from "gotrue-js";

const identityUrl = process.env.REACT_APP_NETLIFY_IDENTITY_URL;

if (!identityUrl) {
  throw new Error("Missing Netlify Identity API URL.");
}

export const auth = new GoTrue({
  APIUrl: identityUrl,
});
