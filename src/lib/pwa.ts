// PWA utilities and service worker registration

export const registerServiceWorker = () => {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered: ", registration);
        })
        .catch((registrationError) => {
          console.log("SW registration failed: ", registrationError);
        });
    });
  }
};

export const isPWA = (): boolean => {
  if (typeof window === "undefined") return false;

  // Check if running in standalone mode
  if (window.matchMedia("(display-mode: standalone)").matches) {
    return true;
  }

  // Check if running in iOS Safari standalone mode
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isInStandaloneMode =
    "standalone" in window.navigator && (window.navigator as unknown as { standalone: boolean }).standalone;

  return isIOS && isInStandaloneMode;
};

export const isInstallable = (): boolean => {
  if (typeof window === "undefined") return false;

  // Check if browser supports PWA installation
  return "serviceWorker" in navigator && "PushManager" in window;
};
