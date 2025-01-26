const { app, BrowserWindow } = require("electron/main");
const path = require("node:path");

// 개발 환경에서만 electron-reload 활성화
if (process.env.ELECTRON_START_URL) {
  require("electron-reload")(path.join(__dirname, ".."), {
    electron: path.join(
      __dirname,
      "..",
      "node_modules",
      ".bin",
      "electron" // electron 실행 파일 경로
    ),
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // 필요 시 preload.js 설정
    },
  });

  win.webContents.on("did-finish-load", () => {
    if (process.env.ELECTRON_START_URL) {
      win.webContents.reloadIgnoringCache(); // Electron 창 강제 새로 고침
    }
  });

  // React 앱의 빌드 결과물을 로드
  const startUrl = process.env.ELECTRON_START_URL || "http://localhost:3000";
  win.loadURL(startUrl);
  win.webContents.openDevTools();
  // const startUrl =
  //   process.env.ELECTRON_START_URL ||
  //   `file://${path.join(__dirname, "../build/index.html")}`;

  // win.loadURL(startUrl);
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
