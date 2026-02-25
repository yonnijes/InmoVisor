import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'
import fs from 'node:fs'
import { PropertyRepository } from '../services/propertyRepository'
import { JimpImageService } from '../services/imageService'
import { GitService } from '../services/gitService'
import { PropertyService } from '../services/propertyService'
import * as authService from '../services/authService'
import { VersionService } from '../services/versionService'

console.log('--- INICIANDO PROCESO PRINCIPAL ---');

const isPackaged = app.isPackaged;

// ✅ Ajuste de rutas para el empaquetado
// En producción, 'dist' suele estar un nivel arriba de 'dist-electron'
process.env.DIST = path.join(__dirname, '../dist');
process.env.VITE_PUBLIC = isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public');

let win: BrowserWindow | null;

// ✅ Gestión de Rutas de Datos (Persistencia)
// Usamos userData para tener permisos de escritura en cualquier SO
const repoPath = isPackaged
  ? path.join(app.getPath('userData'), 'repo')
  : path.resolve(__dirname, '../../');

const dataJsonPath = path.join(repoPath, 'data/data_property.json');

// --- DECLARACIÓN DE SERVICIOS (Lazy Initialization) ---
let repository: PropertyRepository;
let imageService: JimpImageService;
let gitService: GitService | null = null;
let propertyService: PropertyService | null = null;
let versionService: VersionService;

/**
 * Inicializa los servicios. Si no hay token, los servicios de Git
 * se mantendrán en null para evitar que la app explote.
 */
function initializeServices() {
  console.log('Inicializando servicios...');
  console.log('Repo Path:', repoPath);

  // Asegurar que la carpeta de datos exista en producción
  if (isPackaged && !fs.existsSync(path.join(repoPath, 'data'))) {
    fs.mkdirSync(path.join(repoPath, 'data'), { recursive: true });
  }

  repository = new PropertyRepository(dataJsonPath);
  imageService = new JimpImageService();
  versionService = new VersionService(path.join(repoPath, 'data/version.json'));

  const gitAuthConfig = authService.getGitAuthConfig();
  const repoUrl = 'https://github.com/yonnijes/inmovisor.git';

  // Solo creamos GitService si tenemos las credenciales
  if (gitAuthConfig?.auth?.username && gitAuthConfig?.auth?.password) {
    try {
      gitService = new GitService(
        repoPath,
        gitAuthConfig.auth.username,
        gitAuthConfig.auth.password,
        repoUrl
      );

      propertyService = new PropertyService(
        repository,
        imageService,
        gitService,
        versionService,
        path.join(repoPath, 'data')
      );
      console.log('✅ Servicios de Git listos.');
    } catch (error) {
      console.error('❌ Error al instanciar GitService:', error);
    }
  } else {
    console.warn('⚠️ GitService no inicializado: Faltan credenciales de GitHub.');
  }
}

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
  });

  // --- IPC Handlers ---
  ipcMain.handle('get-properties', async () => await repository.getAll());

  ipcMain.handle('save-property', async (_event, property, imagePaths) => {
    if (!propertyService) throw new Error('Servicio de propiedades no disponible (Falta Token)');
    return await propertyService.createNewProperty(property, imagePaths);
  });

  ipcMain.handle('update-property', async (_event, id, property, imagePaths) => {
    if (!propertyService) throw new Error('Servicio de propiedades no disponible');
    return await propertyService.updateProperty(id, property, imagePaths);
  });

  ipcMain.handle('delete-property', async (_event, id) => {
    if (!propertyService) throw new Error('Servicio de propiedades no disponible');
    return await propertyService.deleteProperty(id);
  });

  ipcMain.handle('git-pull', async () => {
    if (!gitService) return { success: false, error: 'GitHub Token no configurado' };
    return await gitService.initOrPull();
  });

  // Auth Handlers
  ipcMain.handle('save-github-token', async (_event, token: string) => {
    authService.saveGithubToken(token);
    initializeServices(); // 👈 Re-inicializar servicios tras guardar token
    return { success: true };
  });

  ipcMain.handle('get-github-token-status', async () => {
    return {
      hasToken: authService.hasGithubToken(),
      isValidated: authService.isTokenValidated(),
      lastValidatedAt: authService.getLastValidatedAt()
    };
  });

  ipcMain.handle('validate-github-token', async () => await authService.validateGithubToken());

  ipcMain.handle('clear-github-token', async () => {
    authService.clearGithubToken();
    gitService = null;
    propertyService = null;
    return { success: true };
  });

  // --- Carga de la App ---
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    const indexPath = path.join(process.env.DIST, 'index.html');
    if (fs.existsSync(indexPath)) {
      win.loadFile(indexPath);
    } else {
      console.error('❌ ERROR: No se encontró index.html en:', indexPath);
    }
  }

  win.webContents.on('did-fail-load', (_, code, desc) => {
    console.log(`❌ Fallo de carga: ${desc} (${code})`);
  });
}

// ✅ Arranque de la aplicación
app.whenReady().then(() => {
  initializeServices();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});