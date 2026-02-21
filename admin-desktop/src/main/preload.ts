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
  
  // Auth Services - GitHub Token
  saveGithubToken: (token: string) => ipcRenderer.invoke('save-github-token', token),
  getGithubTokenStatus: () => ipcRenderer.invoke('get-github-token-status'),
  validateGithubToken: () => ipcRenderer.invoke('validate-github-token'),
  clearGithubToken: () => ipcRenderer.invoke('clear-github-token'),
});
