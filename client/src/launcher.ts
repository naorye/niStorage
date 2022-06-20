import { GetItemMessage, SetItemMessage } from "./types";

declare global {
  interface Window {
    niStorage: {
      setItem: (key: string, value: unknown) => void;
      getItem: (key: string) => Promise<unknown>;
      ready: Promise<unknown>
    };
  }
}

const iframeSrc = `http://localhost:3000/inner.html`;

function run() {
  const iframe = document.createElement("iframe");
  iframe.src = iframeSrc;
  const ready = new Promise(resolve => {
    iframe.addEventListener('load', event=>{
      resolve('ready');
    })
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

  window.niStorage = { setItem, getItem, ready };
}

run();
