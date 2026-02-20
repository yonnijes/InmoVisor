import sharp from 'sharp';
import path from 'path';
import fs from 'fs-extra';

export interface IImageService {
  processForMobile(inputPath: string, outputDir: string): Promise<{ filename: string; success: boolean }>;
}

/**
 * SRP: Responsible only for image manipulation.
 */
export class SharpImageService implements IImageService {
  async processForMobile(inputPath: string, outputDir: string) {
    try {
      await fs.ensureDir(outputDir);
      const filename = `${Date.now()}_${path.basename(inputPath, path.extname(inputPath))}.webp`;
      const outputPath = path.join(outputDir, filename);

      await sharp(inputPath)
        .resize(1080, 1080, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(outputPath);

      return { filename, success: true };
    } catch (error) {
      console.error('Sharp Image Service Error:', error);
      return { filename: '', success: false };
    }
  }
}
