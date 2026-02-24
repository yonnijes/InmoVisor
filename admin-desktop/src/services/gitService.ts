import { simpleGit, SimpleGit, CleanOptions } from 'simple-git';

export class GitService {
  private git: SimpleGit;
  private remoteUrl: string;

  constructor(repoPath: string, username?: string, token?: string, repoUrl?: string) {

    if (!username || !token || !repoUrl) {
      throw new Error('Username, token y repoUrl son obligatorios');
    }


    const cleanRepoUrl = repoUrl?.replace(/^https?:\/\//, '');

    this.remoteUrl = `https://${username}:${token}@${cleanRepoUrl}`;

    console.error("this.remoteUrl>>>>>>", this.remoteUrl)

    this.git = simpleGit(repoPath).clean(CleanOptions.FORCE);
  }

  /**
   * Configura el remoto 'origin' si no existe o ha cambiado
   */
  private async ensureRemote() {
    const remotes = await this.git.getRemotes(true);
    const hasOrigin = remotes.some(r => r.name === 'origin');

    if (hasOrigin) {
      await this.git.remote(['set-url', 'origin', this.remoteUrl]);
    } else {
      await this.git.addRemote('origin', this.remoteUrl);
    }
  }

  /**
   * Realiza el ciclo completo de sincronización de datos
   */
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
      await this.ensureRemote();
      // Usamos --no-rebase para un pull estándar más seguro en automatizaciones
      const pullResult = await this.git.pull('origin', 'main', { '--no-rebase': null });
      return { success: true };
    } catch (error) {
      console.error('Git Pull Error:', error);
      return { success: false, error };
    }
  }
}
