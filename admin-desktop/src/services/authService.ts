/**
 * AuthService - Gestión de autenticación con GitHub
 * 
 * Maneja el almacenamiento seguro del GitHub Personal Access Token
 * y la configuración de autenticación para operaciones Git.
 */

import Store from 'electron-store';
import axios from 'axios';

// Schema para electron-store (flat keys para evitar errores de AJV strict mode)
const schema = {
  'github.token': {
    type: 'string',
    maxLength: 256,
  },
  'github.validated': {
    type: 'boolean',
    default: false,
  },
  'github.lastValidatedAt': {
    type: 'string',
  },
} as const;

// Inicializar store con encriptación
const store = new Store({ 
  name: 'inmovisor-auth',
  schema,
  encryptionKey: 'inmovisor-admin-secret-key' // En producción, usar una clave más segura
});

export interface TokenValidationResult {
  isValid: boolean;
  username?: string;
  error?: string;
}

/**
 * Guarda el token de GitHub de forma segura
 * @param token - GitHub Personal Access Token
 */
export const saveGithubToken = (token: string): void => {
  store.set('github.token', token);
  store.set('github.validated', false);
  store.set('github.lastValidatedAt', new Date().toISOString());
};

/**
 * Obtiene el token de GitHub almacenado
 * @returns string | undefined
 */
export const getGithubToken = (): string | undefined => {
  return store.get('github.token') as string | undefined;
};

/**
 * Elimina el token de GitHub almacenado
 */
export const clearGithubToken = (): void => {
  store.delete('github.token');
  store.delete('github.validated');
  store.delete('github.lastValidatedAt');
};

/**
 * Verifica si hay un token configurado
 * @returns boolean
 */
export const hasGithubToken = (): boolean => {
  const token = getGithubToken();
  return token !== undefined && token.length > 0;
};

/**
 * Valida el token contra la API de GitHub
 * @returns Promise<TokenValidationResult>
 */
export const validateGithubToken = async (): Promise<TokenValidationResult> => {
  const token = getGithubToken();
  
  if (!token) {
    return {
      isValid: false,
      error: 'No hay token configurado'
    };
  }

  try {
    // Llamar a la API de GitHub para verificar el token
    const response = await axios.get('https://api.github.com/user', {
      headers: {
        'Authorization': `token ${token}`,
        'User-Agent': 'InmoVisor-Admin-Desktop'
      },
      timeout: 5000
    });

    // Token válido, guardar estado
    store.set('github.validated', true);
    store.set('github.lastValidatedAt', new Date().toISOString());

    return {
      isValid: true,
      username: response.data.login
    };
  } catch (error) {
    console.error('[AuthService] Error validando token:', error);
    
    store.set('github.validated', false);
    
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return {
          isValid: false,
          error: 'Token inválido o expirado'
        };
      }
      if (error.response?.status === 403) {
        return {
          isValid: false,
          error: 'Token sin permisos suficientes'
        };
      }
      return {
        isValid: false,
        error: `Error de conexión: ${error.message}`
      };
    }
    
    return {
      isValid: false,
      error: 'Error desconocido al validar el token'
    };
  }
};

/**
 * Obtiene el estado de validación del token
 * @returns boolean
 */
export const isTokenValidated = (): boolean => {
  return store.get('github.validated') as boolean || false;
};

/**
 * Obtiene la fecha de última validación
 * @returns string | undefined
 */
export const getLastValidatedAt = (): string | undefined => {
  return store.get('github.lastValidatedAt') as string | undefined;
};

/**
 * Configura las credenciales para simple-git
 * Este método devuelve las credenciales para ser usadas en la URL de Git
 * @returns { auth: { username: string, password: string } } | null
 */
export const getGitAuthConfig = () => {
  const token = getGithubToken();
  
  if (!token) {
    return null;
  }

  // Para GitHub, el username puede ser cualquier valor no vacío
  // El token se usa como password
  return {
    auth: {
      username: 'inmovisor-admin',
      password: token
    }
  };
};
