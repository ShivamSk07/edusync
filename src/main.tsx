if (
  typeof window !== "undefined" &&
  "serviceWorker" in navigator
) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch((error) => {
      console.error(
        "EdSync service worker registration failed:",
        error,
      );
    });
  });
}