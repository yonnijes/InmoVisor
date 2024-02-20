type PropertyType = "Casa" | "Departamento" | "Oficina" | "Terreno" | "Lote" | "Comercial" | "Estacionamiento";
type TransactionType = "Venta" | "Alquiler";
type condition = "nuevo" | "usado" | "en construcción";
type money = "$" | "Bs";

export interface Coordinate {
    id: string;
    lat: number;
    lng: number;
  }


export interface Property {
    id: string;
    type: PropertyType;
    transaction: TransactionType;
    address: string; // Dirección de la propiedad
    money: money;
    price: number; // Precio de la propiedad
    squareMeters: number; // Metros cuadrados de la propiedad
    bedrooms: number; // Número de dormitorios
    bathrooms: number; // Número de baños
    parkingSpaces?: number; // Número de estacionamientos (opcional)
    description?: string; // Descripción detallada de la propiedad (opcional)
    image: string[];
    constructionYear?: number; // Año de construcción (opcional)
    condition?: condition; // Estado de la propiedad (opcional)
    amenities?: string[]; // Amenidades de la propiedad (opcional) Piscina, gimnasio, etc.
    contact?: string; // Información de contacto del agente o dueño (opcional)
    coordinate: Coordinate;
}
