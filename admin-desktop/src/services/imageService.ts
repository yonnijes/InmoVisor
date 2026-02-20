import sharp from 'sharp';
import path from 'path';
import fs from 'fs-extra';

export interface ImageProcessResult {
  filename: string;
  success: boolean;
}

export class ImageService {
  /**
   * Procesa una imagen: redimensiona a 1080px y convierte a WebP.
   * @param inputPath Ruta local de la imagen original
   * @param outputDir Directorio de destino (data/img/{id}/)
   */
  static async processForMobile(inputPath: string, outputDir: string): Promise<ImageProcessResult> {
    try {
      await fs.ensureDir(outputDir);
      
      const filename = `${Date.now()}_${path.basename(inputPath, path.extname(inputPath))}.webp`;
      const outputPath = path.join(outputDir, filename);

      await sharp(inputPath)
        .resize(1080, 1080, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ quality: 80 })
        .toFile(outputPath);

      return { filename, success: true };
    } catch (error) {
      console.error('Error processing image:', error);
      return { filename: '', success: false };
    }
  }
}
