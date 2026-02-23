// Electron 预加载脚本 - 安全地暴露主进程 API 到渲染进程
const { contextBridge, ipcRenderer } = require('electron');

// 暴露安全的 API 到 window.electronAPI
contextBridge.exposeInMainWorld('electronAPI', {
  // 获取系统主题
  getSystemTheme: () => ipcRenderer.invoke('get-system-theme'),

  // 监听主题变化
  onThemeChanged: (callback) => {
    ipcRenderer.on('theme-changed', (event, theme) => callback(theme));
  },

  // 移除监听器
  removeThemeListener: () => {
    ipcRenderer.removeAllListeners('theme-changed');
  },

  // 平台信息
  platform: process.platform,

  // 版本信息
  versions: {
    node: process.versions.node,
    electron: process.versions.electron,
    chrome: process.versions.chrome,
  },
});