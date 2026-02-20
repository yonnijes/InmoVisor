# Arquitectura del Sistema - InmoVisor 🏠🧙‍♂️

InmoVisor es una aplicación móvil multiplataforma diseñada para la visualización y gestión de propiedades inmobiliarias. Está construida utilizando un stack moderno enfocado en la agilidad y el rendimiento.

## 🏗 Stack Tecnológico

- **Frontend Framework:** [Ionic React](https://ionicframework.com/docs/react) - Permite construir interfaces de usuario móviles de alta calidad utilizando React.
- **Runtime Nativo:** [Capacitor](https://capacitorjs.com/) - Provee el puente para convertir la aplicación web en apps nativas para iOS y Android.
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/) - Garantiza robustez y tipado estático en todo el proyecto.
- **Build Tool:** [Vite](https://vitejs.dev/) - Utilizado para un desarrollo rápido y un bundle eficiente.
- **Mapas:** [Leaflet](https://leafletjs.com/) - Librería de mapas interactivos utilizada para la visualización geográfica de las propiedades.
- **Carrusel de Imágenes:** [Swiper](https://swiperjs.com/react) - Implementado para la visualización fluida de fotos de las propiedades.

## 🛠 Componentes Clave

1. **Routing:** Gestionado por `react-router-dom` integrado con `IonRouterOutlet`.
2. **Estado y Lógica:** Uso de hooks personalizados (ej: `usePropertyViewLogic.ts`) para separar la lógica de negocio de los componentes visuales.
3. **Estilos:** CSS estándar y variables de Ionic (`src/theme/variables.css`) para personalización del tema.

## 📱 Plataformas Soportadas
- **Android:** Ubicado en la carpeta `/android`.
- **iOS:** Ubicado en la carpeta `/ios`.
- **PWA/Web:** Soporte a través de `Vite` e `index.html`.
