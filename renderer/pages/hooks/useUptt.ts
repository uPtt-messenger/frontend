import { useEffect, useState, useReducer } from "react";
import useMessage from "./useMessage";

type chatsType = {
  chatMap: Record<
    string,
    { date: string; chatMessage: string; name: string }[]
  >;
};

const initialState: chatsType = { chatMap: {} };

type ACTIONTYPE =
  | { type: "loaded_chats"; payload: { chats: chatsType } }
  | {
      type: "added_chat_message";
      payload: {
        username: string;
        date: string;
        chatMessage: string;
        name: string;
      };
    };

function chatsReducer(state: chatsType, action: ACTIONTYPE) {
  if (action.type === "loaded_chats") {
    const { chats } = action.payload;
    console.log(chats);
    return {
      ...state,
      ...chats,
    };
  }
  if (action.type === "added_chat_message") {
    const { username, date, chatMessage, name } = action.payload;
    const usernameKey = username.toLowerCase();
    const lowerCasedName = name.toLocaleLowerCase();

    return {
      ...state,
      chatMap: {
        ...state?.chatMap,
        [usernameKey]: [
          ...(state?.chatMap?.[usernameKey] ?? []),
          { date, chatMessage, name: lowerCasedName },
        ],
      },
    };
  }
  return state;
}

function useUptt({ username }: { username: string }) {
  const { sendMessage, messages } = useMessage();

  const [loginStatus, setLoginStatus] = useState<
    "loading" | "isLoggedin" | "isNotLoggedin"
  >("loading");

  const [loadingChats, setLoadingChats] = useState(true);
  const [chats, dispatch] = useReducer(chatsReducer, initialState);

  const [isSendingChatMessage, setIsSendingChatMessage] = useState(false);

  // Load chats
  useEffect(() => {
    window.ipc.send("loadChats", chats);

    const removeMessagesListener = window.ipc.on("chats", (chats) => {
      setLoadingChats(false);
      dispatch({
        type: "loaded_chats",
        payload: { chats },
      });
    });

    return () => {
      removeMessagesListener();
    };
  }, []);

  // Save chats
  useEffect(() => {
    window.ipc.send("saveChats", chats);
  }, [chats]);

  // Check login status
  useEffect(() => {
    sendMessage({
      category: "login",
      username: "fakeUsername", // @TODO: https://www.electronjs.org/docs/latest/api/safe-storage
      password: "fakePassword",
    });
  }, []);

  useEffect(() => {
    messages.forEach((message) => {
      console.log({ message });
      if (message.category === "status") {
        const { action, state } = message;
        if (action === "loogin") {
          if (state === "SUCCESS") {
            setLoginStatus("isLoggedin");
          } else if (state === "FAILURE") {
            setLoginStatus("isNotLoggedin");
          }
        } else if (action === "send_chat") {
          setIsSendingChatMessage(false);
        }
      } else if (message.category === "recv_chat") {
        const { username, date, message: chatMessage } = message;
        const usernameWithoutNickname = username.split(" ")[0];
        dispatch({
          type: "added_chat_message",
          payload: {
            username: usernameWithoutNickname,
            date,
            chatMessage,
            name: usernameWithoutNickname,
          },
        });
      }
    });
  }, [messages]);

  // @TODO: 失敗要如何處理!!!!!
  const sendChatMessage = ({
    name,
    chatMessage,
  }: {
    name: string;
    chatMessage: string;
  }) => {
    setIsSendingChatMessage(true);
    sendMessage({
      category: "send_chat",
      username: name,
      message: chatMessage,
    });
    dispatch({
      type: "added_chat_message",
      payload: {
        username: name,
        date: new Date().toString(),
        chatMessage,
        name: username,
      },
    });
  };

  return {
    initializing: loadingChats || loginStatus === "loading",
    loginStatus,
    chats,
    isSendingChatMessage,
    sendChatMessage,
  };
}

export default useUptt;
