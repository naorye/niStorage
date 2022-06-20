import { GetItemMessage, SetItemMessage } from "./types";

declare global {
  interface Window {
    niStorage: {
      setItem: (key: string, value: unknown) => void;
      getItem: (key: string) => Promise<unknown>;
    };
  }
}

const iframeSrc = `http://localhost:3000/`;

function documentReady() {
  return new Promise<void>((resolve) => {
    if (document.readyState != "loading") {
      resolve();
    } else {
      document.addEventListener("DOMContentLoaded", () => resolve());
    }
  });
}

async function run() {
  const iframe = document.createElement("iframe");
  iframe.src = iframeSrc;
  iframe.style.position = "absolute";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";

  const iframeReadyPromise = new Promise<void>((resolve) => {
    function readyHandler(event: MessageEvent) {
      if (event.data === "niStorage:ready") {
        window.removeEventListener("message", readyHandler);
        resolve();
      }
    }

    window.addEventListener("message", readyHandler);
  });

  document.body.appendChild(iframe);

  function getItem(key: string) {
    return new Promise((resolve) => {
      function receiveMessage(event: MessageEvent) {
        if (event.data.startsWith(`niStorage.getItem:${key}:`)) {
          window.removeEventListener("message", receiveMessage);
          const jsonValue = event.data.replace(`niStorage.getItem:${key}:`, "");
          const value = JSON.parse(jsonValue);
          resolve(value);
        }
      }
      window.addEventListener("message", receiveMessage);
      const message: GetItemMessage = { type: "niStorage.getItem", key };
      iframe.contentWindow.postMessage(JSON.stringify(message), "*");
    });
  }

  function setItem(key: string, value: unknown) {
    const message: SetItemMessage = {
      type: "niStorage.setItem",
      key,
      value: JSON.stringify(value),
    };
    iframe.contentWindow.postMessage(JSON.stringify(message), "*");
  }

  window.niStorage = { setItem, getItem };

  await Promise.all([iframeReadyPromise, documentReady()]);

  const event = new CustomEvent("niStorage:ready", {
    detail: window.niStorage,
  });
  document.dispatchEvent(event);
}

run();
