const { Jimp } = require('jimp');
import path from 'path';
import fs from 'fs-extra';

export interface IImageService {
  processForMobile(inputPath: string, outputDir: string): Promise<{ filename: string; success: boolean }>;
}

/**
 * SRP: Responsible only for image manipulation.
 */
export class JimpImageService implements IImageService {
  async processForMobile(inputPath: string, outputDir: string) {
    try {
      await fs.ensureDir(outputDir);
      const filename = `${Date.now()}_${path.basename(inputPath, path.extname(inputPath))}.webp`;
      const outputPath = path.join(outputDir, filename);

      // Leemos la imagen
      const image = await Jimp.read(inputPath);

      // Redimensionamos (equivalente a fit: 'inside' y withoutEnlargement)
      // Nota: Jimp.AUTO mantiene la proporción
      if (image.getWidth() > 1080 || image.getHeight() > 1080) {
        image.scaleToFit(1080, 1080);
      }

      // Guardamos como WebP (Jimp soporta WebP mediante plugins o calidad)
      // Si Jimp da problemas con .webp en esa versión antigua, usa .jpg
      await image
        .quality(80)
        .writeAsync(outputPath);

      return { filename, success: true };
    } catch (error) {
      console.error('Jimp Image Service Error:', error);
      return { filename: '', success: false };
    }
  }
}
