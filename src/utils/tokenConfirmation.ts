export const tokenConfirmation = (url: string) => {
  if (url.includes("#confirmation_token")) {
    const token = url.split("#confirmation_token=")[1];
    sessionStorage.setItem("confirmation_token", token);
    window.location.href =
      "https://to-do-list-typescript-react.netlify.app/#/confirmation";
  }
};
