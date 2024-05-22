import path from "path";
import { app, ipcMain } from "electron";
import serve from "electron-serve";
import axios from "axios";
import fs from "fs";
import { createWindow } from "./helpers";

const isProd = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (isProd) {
    await mainWindow.loadURL("app://./login");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/login`);
    mainWindow.webContents.openDevTools();
  }
})();

app.on("window-all-closed", () => {
  app.quit();
});

ipcMain.on("getMessages", async (event) => {
  try {
    const { data } = await axios.get("http://localhost:16180/pull/", {
      data: {
        channel: "to_ui",
      },
    });
    console.log(data);
    event.reply("messages", data);
  } catch (e) {
    console.error(e);
  }
});

ipcMain.on("sendMessage", async (event, msg) => {
  try {
    console.log(msg);
    const { data } = await axios.post("http://localhost:16180/push/", {
      channel: "to_backend",
      message: JSON.stringify({
        ...msg,
        reply_channel: "to_ui",
      }),
    });
  } catch (e) {
    console.error(e);
    throw new Error(`${e.message}`);
  }
});

const CHATS_DATA_PATH = path.join(app.getPath("userData"), "chats.json");

export function readChats() {
  try {
    const data = fs.readFileSync(CHATS_DATA_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.log("Error retrieving user data", error);
    // you may want to propagate the error, up to you
    return null;
  }
}

ipcMain.on("loadChats", async (event) => {
  try {
    const chats = readChats();
    event.reply("chats", chats);
  } catch (e) {
    event.reply("chats", undefined);
  }
});

ipcMain.on("saveChats", async (event, chats) => {
  try {
    fs.writeFileSync(CHATS_DATA_PATH, JSON.stringify(chats));
  } catch (e) {
    console.error(e);
  }
});
