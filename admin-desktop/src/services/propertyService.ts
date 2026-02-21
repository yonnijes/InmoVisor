import { PropertyRepository, PropertyData } from './propertyRepository';
import { IImageService } from './imageService';
import { GitService } from './gitService';
import { VersionService } from './versionService';
import path from 'path';

/**
 * Orchestrator following SRP and Dependency Inversion.
 * It coordinates data saving, image processing, and git syncing.
 */
export class PropertyService {
  constructor(
    private repository: PropertyRepository,
    private imageService: IImageService,
    private gitService: GitService,
    private versionService: VersionService,
    private dataRoot: string
  ) { }

  async createNewProperty(data: PropertyData, tempImagePaths: string[]) {
    const propertyId = data?.id;
    const outputDir = path.join(this.dataRoot, 'img', propertyId);

    // 1. Process Images
    const imageLinks: string[] = [];
    for (const imgPath of tempImagePaths) {
      const result = await this.imageService.processForMobile(imgPath, outputDir);
      if (result.success) {
        // Construct the GitHub Raw URL
        imageLinks.push(`https://raw.githubusercontent.com/yonnijes/InmoVisor/main/data/img/${propertyId}/${result.filename}`);
      }
    }

    // 2. Update JSON Data
    const propertyToSave = { ...data, image: imageLinks };
    await this.repository.add(propertyToSave);

    // 3. Increment version so mobile app can detect fresh data
    await this.versionService.bumpVersion(`New property ${propertyId}`);

    // 4. Sync with Git
    return await this.gitService.syncPropertyData(propertyId);
  }

  async deleteProperty(propertyId: string) {
    await this.repository.delete(propertyId);
    await this.versionService.bumpVersion(`Delete property ${propertyId}`);
    return await this.gitService.syncPropertyData(`Delete ${propertyId}`);
  }

  async updateProperty(id: string, data: PropertyData, tempImagePaths: string[]) {
    const outputDir = path.join(this.dataRoot, 'img', id);
    const imageLinks: string[] = [...(data.image || [])];

    for (const imgPath of tempImagePaths) {
      const result = await this.imageService.processForMobile(imgPath, outputDir);
      if (result.success) {
        imageLinks.push(`https://raw.githubusercontent.com/yonnijes/InmoVisor/main/data/img/${id}/${result.filename}`);
      }
    }

    const updatedProperty = { ...data, image: imageLinks };
    await this.repository.update(id, updatedProperty);
    await this.versionService.bumpVersion(`Update property ${id}`);
    return await this.gitService.syncPropertyData(`Update ${id}`);
  }
}