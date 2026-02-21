/**
 * Check Data Version Hook
 * 
 * Utility function to check if remote data has been updated
 * by comparing version.json from remote with local stored version.
 */

const VERSION_STORAGE_KEY = 'data_property_version';
const VERSION_JSON_URL = 'https://raw.githubusercontent.com/yonnijes/InmoVisor/main/data/version.json';

export interface VersionInfo {
  version: number;
  updatedAt: string;
  description?: string;
}

export interface CheckVersionResult {
  hasUpdate: boolean;
  localVersion: number | null;
  remoteVersion: number | null;
  error?: string;
}

/**
 * Check if remote data version is different from local stored version
 * @returns Promise<CheckVersionResult>
 */
export const checkDataVersion = async (): Promise<CheckVersionResult> => {
  try {
    // Get local version from localStorage
    const localVersionStr = localStorage.getItem(VERSION_STORAGE_KEY);
    const localVersion = localVersionStr ? parseInt(localVersionStr, 10) : null;

    // Fetch remote version.json with no-store to always check latest version
    const response = await fetch(VERSION_JSON_URL, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch version.json: ${response.status}`);
    }

    const remoteVersionInfo: VersionInfo = await response.json();
    const remoteVersion = remoteVersionInfo.version;

    // Compare versions
    const hasUpdate = localVersion === null || remoteVersion > localVersion;

    return {
      hasUpdate,
      localVersion,
      remoteVersion,
    };
  } catch (error) {
    console.error('[checkDataVersion] Error checking version:', error);
    return {
      hasUpdate: false,
      localVersion: null,
      remoteVersion: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Save the current version to localStorage after successful data update
 * @param version - The version number to save
 */
export const saveDataVersion = (version: number): void => {
  localStorage.setItem(VERSION_STORAGE_KEY, version.toString());
};

/**
 * Get the currently stored local version
 * @returns number | null
 */
export const getLocalVersion = (): number | null => {
  const versionStr = localStorage.getItem(VERSION_STORAGE_KEY);
  return versionStr ? parseInt(versionStr, 10) : null;
};
