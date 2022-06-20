interface SetItemMessage {
  type: "niStorage.setItem";
  key: string;
  value: string;
}

interface GetItemMessage {
  type: "niStorage.getItem";
  key: string;
}

type Message = SetItemMessage | GetItemMessage;

export { Message, SetItemMessage, GetItemMessage };
