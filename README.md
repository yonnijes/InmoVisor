# InmoVisor 🗺️

InmoVisor es una aplicación móvil híbrida diseñada para la visualización de propiedades inmobiliarias en un mapa interactivo. Es una herramienta perfecta para agentes inmobiliarios o usuarios que necesitan una vista geoespacial de una cartera de propiedades.

La aplicación está construida con tecnologías web modernas y empaquetada para Android e iOS utilizando Capacitor.

## ✨ Características Principales

- **Mapa Interactivo**: Muestra múltiples propiedades en un mapa utilizando Leaflet.
- **Vista de Detalles**: Permite ver información específica de cada propiedad.
- **Galería de Imágenes**: Utiliza Swiper para mostrar carruseles de imágenes de las propiedades.
- **Importación/Exportación de Datos**: Capacidad para manejar datos de propiedades desde y hacia archivos Excel (`.xlsx`).
- **Plataforma Cruzada**: Funciona en la web, Android e iOS gracias a Ionic y Capacitor.

## 🚀 Pila Tecnológica

- **Framework Principal**: [React](https://reactjs.org/)
- **UI y Componentes Nativos**: [Ionic React](https://ionicframework.com/docs/react)
- **Wrapper Nativo**: [Capacitor](https://capacitorjs.com/)
- **Bundler y Entorno de Desarrollo**: [Vite](https://vitejs.dev/)
- **Mapas**: [Leaflet](https://leafletjs.com/)
- **Enrutamiento**: [React Router](https://reactrouter.com/)
- **Peticiones HTTP**: [Axios](https://axios-http.com/)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)

## 🏁 Cómo Empezar

Sigue estos pasos para poner en marcha el proyecto en tu entorno local.

**1. Clona el repositorio:**
   ```bash
   git clone https://github.com/yonnijes/InmoVisor.git
   cd InmoVisor
   ```

**2. Instala las dependencias:**
   Se recomienda usar `npm`.
   ```bash
   npm install
   ```

**3. Ejecuta el servidor de desarrollo:**
   Esto iniciará la aplicación en modo web en tu navegador.
   ```bash
   npm run dev
   ```

**4. Construye el proyecto para producción:**
   ```bash
   npm run build
   ```

## 📱 Despliegue en Móviles (Android/iOS)

Para ejecutar la aplicación en un dispositivo móvil, sigue los pasos de la [documentación de Capacitor](https://capacitorjs.com/docs/getting-started).

1.  **Construye la aplicación web:**
    ```bash
    npm run build
    ```

2.  **Sincroniza los cambios con las plataformas nativas:**
    ```bash
    npx cap sync
    ```

3.  **Abre el proyecto en el IDE nativo:**
    -   Para Android:
        ```bash
        npx cap open android
        ```
    -   Para iOS:
        ```bash
        npx cap open ios
        ```
