# Arquitectura del Sistema - InmoVisor 🏠🧙‍♂️

InmoVisor es un ecosistema híbrido diseñado para la gestión y visualización geoespacial de carteras inmobiliarias. Se compone de dos aplicaciones principales que comparten una base de datos distribuida basada en Git.

## 🏗 Ecosistema InmoVisor

### 1. App Móvil (Visor)
Diseñada para el usuario final o agentes en terreno.
- **Framework:** Ionic React + Capacitor.
- **Optimización:** Service Workers (Workbox) con estrategia *Cache-First* para imágenes y *Network-First* para datos.
- **Mapas:** Leaflet.

### 2. App de Escritorio (Administrador)
Panel de control para la gestión de inventario.
- **Framework:** React + Electron + Vite.
- **Función:** Actúa como interfaz para el modelo "Git as DB". Permite cargar propiedades, procesar imágenes (WebP) y sincronizar cambios directamente al repositorio.

## 📊 Estrategia "Git as DB"
InmoVisor no utiliza una base de datos tradicional (SQL/NoSQL). En su lugar:
- **Almacenamiento:** Los datos residen en `data/data_property.json`.
- **Multimedia:** Las imágenes se guardan en `data/img/{id}/`.
- **Sincronización:** La App de Escritorio ejecuta comandos de sistema (`git add`, `git commit`, `git push`) para actualizar el "servidor" (GitHub), y la App Móvil consume estos archivos vía GitHub Raw con capas de caché inteligentes.

## 🛠 Stack Tecnológico Global
- **Lenguaje:** TypeScript (en todo el proyecto).
- **IA/Procesamiento:** Sharp (en el admin) para optimización de imágenes a WebP.
- **Mapas:** Leaflet.
- **Caché:** PWA Service Workers.
