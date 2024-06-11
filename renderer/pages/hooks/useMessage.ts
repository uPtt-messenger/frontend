import { useEffect, useState } from "react";
import useInterval from "./useInterval";

export type LoginMessage = {
  category: "login";
  username: string;
  password: string;
};

export type SendChatMessage = {
  category: "send_chat";
  username: string;
  message: string;
};

export type SentMessage = LoginMessage | SendChatMessage;

export type RecvChatMessage = {
  category: "recv_chat";
  username: string;
  date: string;
  message: string;
};

export type StatusMessage = {
  category: "status";
  action: string;
  state: "SUCCESS" | "FAILURE" | "UNKNOWN" | "PENDING";
  message: string;
};

export type ReceivedMessage = RecvChatMessage | StatusMessage;

const sendMessage = (message: SentMessage) => {
  window.ipc.send("sendMessage", message);
};

function useMessage() {
  const [messages, setMessages] = useState<ReceivedMessage[]>([]);

  useEffect(() => {
    const removeMessagesListener = window.ipc.on("messages", (data) => {
      const newMessages = Array.isArray(data?.messages)
        ? data?.messages
        : Array.isArray(data)
          ? data
          : [];
      if (newMessages.length > 0) {
        setMessages(newMessages);
      }
    });

    return () => {
      removeMessagesListener();
    };
  }, []);

  useInterval(() => {
    window.ipc.send("getMessages", {});
  }, 1000);

  return {
    sendMessage,
    messages,
  };
}

export default useMessage;
