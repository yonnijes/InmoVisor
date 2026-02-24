import { simpleGit, SimpleGit, CleanOptions } from 'simple-git';
import * as fs from 'fs';
import * as path from 'path';

export class GitService {
  private git: SimpleGit;
  private remoteUrl: string;
  private repoPath: string;

  constructor(repoPath: string, username?: string, token?: string, repoUrl?: string) {
    if (!username || !token || !repoUrl) {
      throw new Error('Username, token y repoUrl son obligatorios');
    }

    const cleanRepoUrl = repoUrl.replace(/^https?:\/\//, '');
    this.remoteUrl = `https://${username}:${token}@${cleanRepoUrl}`;
    this.repoPath = repoPath;
    // Inicializamos simple-git apuntando al path, exista o no el repo
    this.git = simpleGit();
  }

  /**
   * Verifica si el directorio ya es un repositorio git válido
   */
  private isGitRepo(): boolean {
    return fs.existsSync(path.join(this.repoPath, '.git'));
  }

  /**
   * Clona el repositorio si no existe localmente, o hace pull si ya existe
   */
  async initOrPull(): Promise<{ success: boolean; action?: string; error?: unknown }> {
    try {
      if (!this.isGitRepo()) {
        // El directorio no tiene .git, clonamos
        fs.mkdirSync(this.repoPath, { recursive: true });
        await simpleGit().clone(this.remoteUrl, this.repoPath);
        // Una vez clonado, apuntamos la instancia al repo
        this.git = simpleGit(this.repoPath).clean(CleanOptions.FORCE);
        return { success: true, action: 'cloned' };
      } else {
        // Ya existe, solo hacemos pull
        this.git = simpleGit(this.repoPath).clean(CleanOptions.FORCE);
        await this.ensureRemote();
        await this.git.pull('origin', 'main', { '--no-rebase': null });
        return { success: true, action: 'pulled' };
      }
    } catch (error) {
      console.error('Git Init/Pull Error:', error);
      return { success: false, error };
    }
  }

  private async ensureRemote() {
    const remotes = await this.git.getRemotes(true);
    const hasOrigin = remotes.some(r => r.name === 'origin');

    if (hasOrigin) {
      await this.git.remote(['set-url', 'origin', this.remoteUrl]);
    } else {
      await this.git.addRemote('origin', this.remoteUrl);
    }
  }

  async syncPropertyData(propertyId: string) {
    try {
      await this.ensureRemote();
      await this.git.add('./*');
      await this.git.commit(`Admin: Update property data and images for ${propertyId}`);
      await this.git.push('origin', 'main');
      return { success: true };
    } catch (error) {
      console.error('Git Sync Error:', error);
      return { success: false, error };
    }
  }

  async pullLatest() {
    try {
      if (!this.isGitRepo()) {
        // Si no existe el repo, delegamos al flujo de clone
        return await this.initOrPull();
      }

      await this.ensureRemote();
      await this.git.pull('origin', 'main', { '--no-rebase': null });
      return { success: true };
    } catch (error) {
      console.error('Git Pull Error:', error);
      return { success: false, error };
    }
  }
}