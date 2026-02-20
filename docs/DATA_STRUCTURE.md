# Estructura de Datos - InmoVisor 📊

El proyecto utiliza una estructura de datos estática basada en archivos JSON para gestionar el catálogo de propiedades. Esto permite una carga rápida y una gestión sencilla del contenido.

## 📂 Carpeta `data/`

Esta carpeta es el núcleo de información de la aplicación.

### 1. `data_property.json`
Contiene un array de objetos, donde cada objeto representa una propiedad.

**Esquema de Propiedad:**
```json
{
  "id": "string (ej: A-2)",
  "type": "string (Departamento, Casa, Comercial)",
  "transaction": "string (Venta, Alquiler)",
  "address": "string",
  "money": "string (ej: $)",
  "price": "number",
  "squareMeters": "number",
  "bedrooms": "number",
  "bathrooms": "number",
  "parkingSpaces": "number",
  "description": "string (soporta saltos de línea)",
  "lat": "string (coordenada)",
  "lng": "string (coordenada)",
  "phoneContact": "number (formato internacional)",
  "image": [
    "array de URLs de imágenes (normalmente alojadas en GitHub Raw)"
  ],
  "amenities": ["array de strings"]
}
```

### 2. Organización de Imágenes (`data/img/`)
Las imágenes se organizan en subcarpetas nombradas según el `id` de la propiedad:
- `/data/img/A-1/`
- `/data/img/A-2/`
- ...

Esto facilita la gestión de archivos y asegura que cada propiedad tenga su set de fotos correctamente identificado.

### 3. Scripts (`data/script/`)
Contiene scripts de utilidad (`keytock_data.js`, `mokData.js`) probablemente utilizados para la generación, limpieza o transformación de los datos iniciales.

### 4. Excel (`data_keytock.xlsx`)
Archivo de origen de datos que posiblemente se utiliza para alimentar el JSON maestro.
