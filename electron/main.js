const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");

const isDev = !app.isPackaged;
let mainWindow;
const startUrl = `file://${path.join(app.getAppPath(), "build/index.html")}`;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "Study Room Check-in",
    icon: path.join(__dirname, "../public/icon.icns"),
    webPreferences: {
      preload: path.join(
        __dirname,
        isDev ? "preload.js" : path.join(app.getAppPath(), "preload.js")
      ),
      contextIsolation: true, // 보안 강화
      nodeIntegration: false, // 보안 강화 (preload에서만 필요한 노출 허용)
    },
  });

  mainWindow.loadURL(startUrl);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

console.log(__dirname);

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// 안전한 IPC 통신 처리
ipcMain.handle("message-from-react", async (event, arg) => {
  console.log("React에서 받은 메시지:", arg);
  return "Electron에서 온 응답";
});
