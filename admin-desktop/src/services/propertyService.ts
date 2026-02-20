import { PropertyRepository, PropertyData } from './propertyRepository';
import { IImageService } from './imageService';
import { GitService } from './gitService';
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
    private dataRoot: string
  ) {}

  async createNewProperty(data: PropertyData, tempImagePaths: string[]) {
    const propertyId = data.id;
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

    // 3. Sync with Git
    return await this.gitService.syncPropertyData(propertyId);
  }
}
