import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import { PropertyRepository } from '../services/propertyRepository'
import { SharpImageService } from '../services/imageService'
import { GitService } from '../services/gitService'
import { PropertyService } from '../services/propertyService'

process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

let win: BrowserWindow | null

// Initialize Services
const repoPath = path.resolve(__dirname, '../../../') // Root of InmoVisor repo
const dataJsonPath = path.join(repoPath, 'data/data_property.json')

const repository = new PropertyRepository(dataJsonPath)
const imageService = new SharpImageService()
const gitService = new GitService(repoPath)
const propertyService = new PropertyService(repository, imageService, gitService, path.join(repoPath, 'data'))

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

  ipcMain.handle('delete-property', async (_event, id) => {
    return await propertyService.deleteProperty(id)
  })

  ipcMain.handle('git-pull', async () => {
    return await gitService.pullLatest()
  })

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
