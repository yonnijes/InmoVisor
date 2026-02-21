import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import { PropertyRepository } from '../services/propertyRepository'
import { SharpImageService } from '../services/imageService'
import { GitService } from '../services/gitService'
import { PropertyService } from '../services/propertyService'
import * as authService from '../services/authService'
import { VersionService } from '../services/versionService'

process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

let win: BrowserWindow | null

// Initialize Services
// En desarrollo, __dirname está en admin-desktop/dist-electron
// Queremos llegar a la raíz del repo (InmoVisor/)
const repoPath = app.isPackaged 
  ? path.join(process.resourcesPath, '..') // Ajustar para producción
  : path.resolve(__dirname, '../../')    // Ajustar para desarrollo (dist-electron -> root)

const dataJsonPath = path.join(repoPath, 'data/data_property.json')

const repository = new PropertyRepository(dataJsonPath)
const imageService = new SharpImageService()
const gitService = new GitService(repoPath)
const versionService = new VersionService(path.join(repoPath, 'data/version.json'))
const propertyService = new PropertyService(repository, imageService, gitService, versionService, path.join(repoPath, 'data'))

console.log('Repo Path:', repoPath);
console.log('JSON Path:', dataJsonPath);

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    width: 1280,
    height: 900,
  })

  // IPC Handlers
  ipcMain.handle('get-properties', async () => {
    return await repository.getAll()
  })

  ipcMain.handle('save-property', async (_event, property, imagePaths) => {
    return await propertyService.createNewProperty(property, imagePaths)
  })

  ipcMain.handle('update-property', async (_event, id, property, imagePaths) => {
    return await propertyService.updateProperty(id, property, imagePaths)
  })

  ipcMain.handle('delete-property', async (_event, id) => {
    return await propertyService.deleteProperty(id)
  })

  ipcMain.handle('git-pull', async () => {
    return await gitService.pullLatest()
  })

  // Auth Service - GitHub Token
  ipcMain.handle('save-github-token', async (_event, token: string) => {
    authService.saveGithubToken(token);
    return { success: true };
  });

  ipcMain.handle('get-github-token-status', async () => {
    const hasToken = authService.hasGithubToken();
    const isValidated = authService.isTokenValidated();
    const lastValidatedAt = authService.getLastValidatedAt();
    return { hasToken, isValidated, lastValidatedAt };
  });

  ipcMain.handle('validate-github-token', async () => {
    return await authService.validateGithubToken();
  });

  ipcMain.handle('clear-github-token', async () => {
    authService.clearGithubToken();
    return { success: true };
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.whenReady().then(createWindow)
