export function register() {
  if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log("SW registered: ", registration);
        })
        .catch((error) => {
          console.error("SW registration failed: ", error);
        });
    });
  } else if (
    "serviceWorker" in navigator &&
    process.env.NODE_ENV === "development"
  ) {
    // Pozwalamy na rejestrację w dev dla testów, jeśli chcesz
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/service-worker.js");
    });
  }
}

export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
