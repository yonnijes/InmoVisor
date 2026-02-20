import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  // Property Services
  getProperties: () => ipcRenderer.invoke('get-properties'),
  saveProperty: (property: any, imagePaths: string[]) => ipcRenderer.invoke('save-property', property, imagePaths),
  updateProperty: (id: string, property: any, imagePaths: string[]) => ipcRenderer.invoke('update-property', id, property, imagePaths),
  deleteProperty: (id: string) => ipcRenderer.invoke('delete-property', id),
  
  // Git Services
  gitPull: () => ipcRenderer.invoke('git-pull'),
  gitStatus: () => ipcRenderer.invoke('git-status'),
});
