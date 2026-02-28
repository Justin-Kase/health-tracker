const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  getHealthData: () => ipcRenderer.invoke('get-health-data')
});
