import fs from 'node:fs/promises';

interface VersionFile {
  version: number;
  updatedAt: string;
  description?: string;
}

export class VersionService {
  constructor(private versionFilePath: string) {}

  async bumpVersion(reason = 'Data updated from admin-desktop'): Promise<VersionFile> {
    const current = await this.readVersion();
    const next: VersionFile = {
      version: (current?.version ?? 0) + 1,
      updatedAt: new Date().toISOString(),
      description: reason,
    };

    await fs.writeFile(this.versionFilePath, JSON.stringify(next, null, 2) + '\n', 'utf-8');
    return next;
  }

  private async readVersion(): Promise<VersionFile | null> {
    try {
      const raw = await fs.readFile(this.versionFilePath, 'utf-8');
      return JSON.parse(raw) as VersionFile;
    } catch {
      return null;
    }
  }
}
