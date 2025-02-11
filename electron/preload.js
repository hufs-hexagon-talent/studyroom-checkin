const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  // 메인 프로세스로 메시지 보내기 (Renderer → Main)
  send: (channel, data) => {
    ipcRenderer.send(channel, data);
  },

  // 메인 프로세스에서 메시지 받기 (Main → Renderer)
  receive: (channel, callback) => {
    ipcRenderer.on(channel, (event, ...args) => callback(...args));
  },
});
