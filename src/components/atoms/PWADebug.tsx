"use client";

import { Card } from "@/components/atoms/Card";
import { useEffect, useState } from "react";

export const PWADebug = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});

  useEffect(() => {
    const checkPWAFeatures = () => {
      const info = {
        // Basic checks
        isHTTPS: window.location.protocol === "https:",
        isLocalhost: window.location.hostname === "localhost",
        isLocalNetwork: window.location.hostname.startsWith("192.168."),

        // PWA support
        hasServiceWorker: "serviceWorker" in navigator,
        hasPushManager: "PushManager" in window,
        hasBeforeInstallPrompt: false,

        // Display mode
        isStandalone: window.matchMedia("(display-mode: standalone)").matches,
        isFullscreen: window.matchMedia("(display-mode: fullscreen)").matches,
        isMinimalUI: window.matchMedia("(display-mode: minimal-ui)").matches,
        isBrowser: window.matchMedia("(display-mode: browser)").matches,

        // iOS specific
        isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
        isSafari:
          /Safari/.test(navigator.userAgent) &&
          !/Chrome/.test(navigator.userAgent),
        isStandaloneIOS:
          "standalone" in window.navigator &&
          (window.navigator as any).standalone,

        // User agent
        userAgent: navigator.userAgent,
        currentURL: window.location.href,

        // Manifest
        hasManifest: !!document.querySelector('link[rel="manifest"]'),
        manifestHref: document
          .querySelector('link[rel="manifest"]')
          ?.getAttribute("href"),
      };

      setDebugInfo(info);
    };

    checkPWAFeatures();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      setDebugInfo((prev) => ({
        ...prev,
        hasBeforeInstallPrompt: true,
        beforeInstallPromptEvent: "Event received",
      }));
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  return (
    <Card className="p-4 m-4 bg-yellow-50 border-yellow-200">
      <h3 className="text-lg font-semibold text-yellow-800 mb-4">
        🔍 PWA Debug Information
      </h3>

      <div className="space-y-2 text-sm">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <strong>HTTPS:</strong>
            <span
              className={debugInfo.isHTTPS ? "text-green-600" : "text-red-600"}
            >
              {debugInfo.isHTTPS ? " ✅ Yes" : " ❌ No"}
            </span>
          </div>
          <div>
            <strong>Localhost:</strong>
            <span
              className={
                debugInfo.isLocalhost ? "text-green-600" : "text-red-600"
              }
            >
              {debugInfo.isLocalhost ? " ✅ Yes" : " ❌ No"}
            </span>
          </div>
          <div>
            <strong>Service Worker:</strong>
            <span
              className={
                debugInfo.hasServiceWorker ? "text-green-600" : "text-red-600"
              }
            >
              {debugInfo.hasServiceWorker ? " ✅ Yes" : " ❌ No"}
            </span>
          </div>
          <div>
            <strong>Push Manager:</strong>
            <span
              className={
                debugInfo.hasPushManager ? "text-green-600" : "text-red-600"
              }
            >
              {debugInfo.hasPushManager ? " ✅ Yes" : " ❌ No"}
            </span>
          </div>
          <div>
            <strong>Before Install Prompt:</strong>
            <span
              className={
                debugInfo.hasBeforeInstallPrompt
                  ? "text-green-600"
                  : "text-red-600"
              }
            >
              {debugInfo.hasBeforeInstallPrompt ? " ✅ Yes" : " ❌ No"}
            </span>
          </div>
          <div>
            <strong>Standalone Mode:</strong>
            <span
              className={
                debugInfo.isStandalone ? "text-green-600" : "text-red-600"
              }
            >
              {debugInfo.isStandalone ? " ✅ Yes" : " ❌ No"}
            </span>
          </div>
        </div>

        <div className="mt-4">
          <strong>Current URL:</strong>
          <span className="text-blue-600 break-all">
            {debugInfo.currentURL}
          </span>
        </div>

        <div>
          <strong>iOS Safari:</strong>
          <span
            className={
              debugInfo.isIOS && debugInfo.isSafari
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {debugInfo.isIOS && debugInfo.isSafari ? " ✅ Yes" : " ❌ No"}
          </span>
        </div>

        <div>
          <strong>Manifest:</strong>
          <span
            className={
              debugInfo.hasManifest ? "text-green-600" : "text-red-600"
            }
          >
            {debugInfo.hasManifest ? " ✅ Yes" : " ❌ No"}
          </span>
          {debugInfo.manifestHref && (
            <span className="text-blue-600"> ({debugInfo.manifestHref})</span>
          )}
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded">
        <h4 className="font-semibold text-blue-800 mb-2">
          💡 Installation Instructions:
        </h4>
        <div className="text-sm text-blue-700">
          {debugInfo.isIOS && debugInfo.isSafari ? (
            <div>
              <p>
                <strong>For iOS Safari:</strong>
              </p>
              <p>
                1. Tap the <strong>Share</strong> button (square with arrow up)
              </p>
              <p>
                2. Scroll down and tap <strong>"Add to Home Screen"</strong>
              </p>
              <p>
                3. Tap <strong>"Add"</strong> to install
              </p>
            </div>
          ) : (
            <div>
              <p>
                <strong>For other browsers:</strong>
              </p>
              <p>1. Look for install prompt/banner</p>
              <p>2. Or check browser menu for "Install App" option</p>
              <p>3. PWA features work best on HTTPS or localhost</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
