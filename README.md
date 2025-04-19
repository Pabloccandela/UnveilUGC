# Unveil UGC Platform

Unveil es una aplicación móvil para conectar creadores de contenido (UGC) con negocios locales mediante campañas colaborativas.

## Tecnología utilizada
- **React Native** + **TypeScript**: Permite desarrollo multiplataforma (Android/iOS) con tipado fuerte y componentes reutilizables.
- **Context API**: Para manejo de estado global (usuario, onboarding, autenticación).
- **Navegación**: React Navigation para gestionar pantallas y flujos.
- **Datos mock**: Toda la lógica y datos se simulan localmente, sin backend real.

### Versiones de herramientas principales

- **expo**: ~52.0.43
- **react-native**: 0.76.9
- **react**: 18.3.1
- **typescript**: ^5.3.3

> Consulta `package.json` para la lista completa de dependencias y sus versiones.

## Sistema de Matching
El sistema de matching filtra y ordena ofertas para cada creador según:
- Nivel del creador (ej: Principiante)
- Intereses seleccionados en el onboarding
- Otros criterios como localización, plataformas y tipo de contenido (simulado)

La lógica principal está en `src/services/matchingService.ts`. Si quieres cambiar cómo se filtran o priorizan ofertas, puedes modificar ahí los pesos o condiciones.

## Flujo básico de la aplicación

### Notificaciones Locales
La app utiliza notificaciones locales (implementadas con `expo-notifications`) para informar al usuario cuando una propuesta de campaña es **aceptada** o **rechazada**. Estas notificaciones aparecen inmediatamente después de que el usuario envía una solicitud y recibe la respuesta.

- Si la propuesta es aceptada: se muestra una notificación indicando el éxito.
- Si la propuesta es rechazada: se muestra una notificación informando el rechazo.

Esto permite al usuario estar informado en tiempo real sobre el estado de sus aplicaciones a campañas.


### 1. Login y Registro
- El usuario puede registrarse como creador completando un formulario (nombre, email, contraseña, país, ciudad y otros, mediante un proceso de onboarding).
- El login verifica los datos y accede al dashboard.

### 2. Onboarding Multi-paso
- Tras registrarse, el usuario completa un onboarding en 4 pasos:
  1. Datos personales
  2. Redes sociales (simulado)
  3. Selección de intereses (categorías UGC)
  4. Vista previa de currículum automatizado

### 3. Dashboard y Aplicación a Ofertas
- El dashboard muestra solo ofertas relevantes para el usuario (matching).
- Cada oferta muestra el negocio, descripción, incentivo y categoría.
- El usuario puede ver detalles y "mostrar interés" proponiendo fechas para la campaña.
- La respuesta del negocio es simulada (aceptación/rechazo aleatoria).

## Consejos para pequeños cambios
- **Agregar o quitar categorías/intereses:** Editar `UGC_CATEGORIES` en `src/services/mockData.ts`.
- **Modificar lógica de matching:** Cambiar funciones en `src/services/matchingService.ts`.
- **Cambiar campos de usuario:** Modificar el modelo en `src/models/User.ts` y los formularios de onboarding.
- **Editar textos o UI:** Cambia los componentes en `src/screens/`.
- **Agregar nuevas ofertas mock:** Añadir objetos en `MOCK_OFFERS` en `src/services/mockData.ts`.

## Estructura básica del proyecto

```
├── src/
│   ├── models/            # Tipos y modelos principales (User, Offer)
│   ├── services/          # Lógica de negocio y datos mock
│   ├── screens/           # Pantallas principales (Dashboard, Onboarding, Detalles)
│   ├── components/        # Componentes reutilizables
│   └── context/           # Contextos para manejo de usuario y estado global
└── ...
```


---

**Este proyecto está pensado para ser fácilmente extensible y modificable. Cualquier cambio en la lógica de matching, datos o flujos de usuario puede hacerse editando los archivos mencionados arriba.**

1. **Login**:
   - Autenticación de usuarios existentes
   - Registro de nuevos usuarios

2. **Onboarding**:
   
   - Paso 1: Información básica
   - Paso 2: Redes sociales
   - Paso 3: Selección de intereses/categorías
   - Paso 4: Vista previa del perfil

3. **Dashboard**:
   - Visualización de ofertas filtradas según intereses y nivel
   - Cada oferta muestra: negocio, descripción, incentivo y categoría

4. **Detalles de Oferta**:
   - Información detallada de la oferta
   - Propuesta de fechas para realizar la campaña
   - Simulación de respuesta del negocio

4. **Perfil**:
   - Visualización de datos personales
   - Estadísticas del creador
   - Historial de campañas realizadas

5. **Mis Campañas**:
   - Visualización de campañas realizadas
   - Simulación de respuesta del negocio

## Requisitos para Ejecutar el Proyecto

### Dependencias

- Node.js (v14 o superior)
- npm o yarn
- Expo CLI
- React Native

### Instalación

1. Clonar el repositorio
2. Instalar dependencias:
   ```
   npm install
   ```
   o
   ```
   yarn install
   ```

3. Iniciar la aplicación:
   ```
   npm start
   ```
   o
   ```
   yarn start
   ```

4. Usar Expo Go en un dispositivo móvil o un emulador para visualizar la aplicación

## Ramas Dev - Origin/Master

- **Dev**: Rama de desarrollo activa
- **Origin/Master**: Rama principal (master)

- En este caso es un proyecto de prueba y las ramas son similares en contenido, pero es importante tener un control de versiones usando ramas de desarrollo y rama principal. 

## Mejoras Futuras

- Implementación de backend real con Firebase o similar
- Integración real con APIs de redes sociales
- Sistema de notificaciones push
- Funcionalidad de chat entre creadores y negocios
- Análisis de métricas para campañas
- Sistema de valoraciones y reseñas

## Estructura del Proyecto

```
UnveilUGC/
├── assets/                 # Recursos estáticos (imágenes, fuentes)
├── components/             # Componentes reutilizables
├── context/                # Contextos de React (AuthContext)
├── src/
│   ├── hooks/              # Custom hooks
│   ├── models/             # Definiciones de tipos e interfaces
│   ├── navigation/         # Configuración de navegación
│   ├── screens/            # Pantallas de la aplicación
│   │   ├── Auth/           # Pantallas de autenticación
│   │   ├── Main/           # Pantallas principales
│   │   └── Onboarding/     # Pantallas de onboarding
│   └── services/           # Servicios y lógica de negocio
├── App.tsx                 # Punto de entrada de la aplicación
├── package.json            # Dependencias del proyecto
└── README.md               # Documentación
```
