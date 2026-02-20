import path from 'path';
import { PropertyRepository } from './src/services/propertyRepository.ts';
import { SharpImageService } from './src/services/imageService.ts';
import { GitService } from './src/services/gitService.ts';
import { PropertyService } from './src/services/propertyService.ts';

async function testSync() {
  const repoPath = path.resolve(__dirname, '../');
  const dataRoot = path.join(repoPath, 'data');
  const jsonPath = path.join(dataRoot, 'data_property.json');
  const dummyImg = path.join(__dirname, 'temp', 'dummy.jpg');

  console.log('--- Iniciando Prueba de Git as DB ---');
  console.log('Repo:', repoPath);

  const repository = new PropertyRepository(jsonPath);
  const imageService = new SharpImageService();
  const gitService = new GitService(repoPath);
  const propertyService = new PropertyService(repository, imageService, gitService, dataRoot);

  const testProperty: any = {
    id: `TEST-${Date.now()}`,
    type: 'Departamento',
    transaction: 'Venta',
    address: 'Calle de Prueba 123, Eurekka City',
    money: '$',
    price: 99999,
    squareMeters: 50,
    bedrooms: 1,
    bathrooms: 1,
    parkingSpaces: 0,
    description: 'Propiedad generada por Eurekka para probar la sincronización automática.',
    lat: '10.35',
    lng: '-67.04',
    amenities: ['Prueba Automatizada']
  };

  try {
    console.log('Ejecutando orquestador (Procesar -> Guardar -> Push)...');
    const result = await propertyService.createNewProperty(testProperty, [dummyImg]);
    
    if (result.success) {
      console.log('✅ ¡PRUEBA EXITOSA!');
      console.log('La propiedad y la imagen han sido procesadas y subidas a GitHub.');
    } else {
      console.error('❌ Error en la sincronización:', result);
    }
  } catch (error) {
    console.error('❌ Error Fatal:', error);
  }
}

testSync();
