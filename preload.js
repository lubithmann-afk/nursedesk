const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('api', {
  library: () => ipcRenderer.invoke('lib:list'),
  importDecks: () => ipcRenderer.invoke('lib:import'),
  deck: id => ipcRenderer.invoke('lib:deck', id),
  removeDeck: id => ipcRenderer.invoke('lib:remove', id),
  search: q => ipcRenderer.invoke('lib:search', q),
  getSettings: () => ipcRenderer.invoke('set:get'),
  saveSettings: s => ipcRenderer.invoke('set:save', s),
  ask: (messages, extra) => ipcRenderer.invoke('ai:ask', messages, extra),
  onStatus: cb => ipcRenderer.on('ai:status', (_, s) => cb(s)),
  extraQuestions: () => ipcRenderer.invoke('q:extra'),
  importQuestions: () => ipcRenderer.invoke('q:import'),
  version: () => ipcRenderer.invoke('app:version'),
  openExternal: u => ipcRenderer.invoke('open:ext', u),
});
