import { Message } from "./types";

function setItem(key: string, value: string) {
  window.localStorage.setItem(key, value);
}

function getItem(key: string) {
  const value = window.localStorage.getItem(key);
  return value;
}

window.addEventListener("message", (message) => {
  try {
    const data = JSON.parse(message.data) as Message;

    const { key, type } = data;
    switch (type) {
      case "niStorage.setItem": {
        const { value } = data;
        setItem(key, value);
        break;
      }
      case "niStorage.getItem": {
        const value = getItem(key);
        window.parent.postMessage(`niStorage.getItem:${key}:${value}`, "*");
        break;
      }
    }
  } catch {
    // Nothing to do
  }
});
