import { simpleGit, SimpleGit } from 'simple-git';

export class GitService {
  private git: SimpleGit;

  constructor(repoPath: string) {
    this.git = simpleGit(repoPath);
  }

  /**
   * Realiza el ciclo completo de sincronización de datos
   */
  async syncPropertyData(propertyId: string) {
    try {
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
      await this.git.pull();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }
}
