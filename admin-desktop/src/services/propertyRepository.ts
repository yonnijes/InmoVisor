import fs from 'fs-extra';
import { Transaction } from '../../../shared/types';

/**
 * Interface representing the data structure in data_property.json
 * (Shared with the mobile app)
 */
export interface PropertyData extends Transaction {
  // Add specific fields if they differ from the shared Transaction type
  address: string;
  price: number;
  squareMeters: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  description: string;
  lat: string;
  lng: string;
  amenities: string[];
  image: string[];
}

/**
 * SRP: This class is only responsible for reading and writing 
 * the property data to the JSON file.
 */
export class PropertyRepository {
  constructor(private filePath: string) {}

  async getAll(): Promise<PropertyData[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading properties:', error);
      return [];
    }
  }

  async save(properties: PropertyData[]): Promise<void> {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(properties, null, 2));
    } catch (error) {
      console.error('Error saving properties:', error);
      throw new Error('Failed to save property data');
    }
  }

  async add(property: PropertyData): Promise<void> {
    const all = await this.getAll();
    all.push(property);
    await this.save(all);
  }
}
