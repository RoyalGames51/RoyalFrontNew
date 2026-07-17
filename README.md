# RoyalGames Frontend 🎮👑

¡Bienvenido al repositorio del frontend de **RoyalGames**! Esta es una plataforma web interactiva y moderna de juegos en línea (mini-juegos) construida sobre **React** y **Vite**, optimizada con un diseño visual premium oscuro, transiciones suaves y completas integraciones de pagos.

---

## 🚀 Características Principales

### 1. Catálogo de Mini-Juegos
La plataforma incluye mini-juegos interactivos con lógica y apuestas mediante fichas virtuales:
*   **Diamantes (Mines) 💎:** Un juego estilo buscaminas donde los jugadores revelan casilleros para encontrar diamantes y multiplicar su apuesta, evitando detonar una mina que finalice el juego.
*   **Royal Joker 🃏:** Un juego temático en torno al Joker real.
*   **Royal Pachinka 🔴:** Un juego estilo pachinko/plinko con caída física de bolas y multiplicadores de premio en la base.

### 2. Autenticación y Gestión de Sesiones
*   **JWT Authentication:** Registro e inicio de sesión local seguro, conectado a un backend en **NestJS** (reemplazando la integración previa de Firebase).
*   **Google One Tap / Identity Services:** Autenticación rápida con cuentas de Google integrada directamente en la barra de navegación.
*   **Rutas Protegidas:** Protección de vistas de administración y perfil privado para asegurar que solo usuarios con rol correspondiente realicen acciones críticas.

### 3. Sistema de Fichas (Chips) y Bazar
*   **Regalo de Bienvenida 🎁:** Los primeros 100 usuarios registrados reciben automáticamente **1,000,000 de fichas** de regalo a través de un modal dinámico e interactivo.
*   **Bazar / Tienda 🏪:** Espacio dedicado para canjear fichas y puntos acumulados por ventajas o artículos especiales.
*   **Compra de Fichas 💳:** Compra de paquetes de fichas integrada mediante dos pasarelas de pago principales:
    *   **PayPal:** Procesado directamente en el cliente mediante `@paypal/react-paypal-js` usando el Client ID provisto en las variables de entorno.
    *   **Mercado Pago:** Integrado de forma segura con inicio de orden desde la UI y redirección a las rutas de estado (`/mercadopago/success`, `/mercadopago/failure`, `/mercadopago/pending`). La clave privada se mantiene segura en el backend.

### 4. Perfiles y Comunidad
*   **Perfiles Públicos y Privados:** Visualización del progreso, saldo de fichas y estadísticas de juego de cualquier jugador.
*   **Sistema de Favoritos ⭐:** Posibilidad de marcar juegos como favoritos para accesos rápidos.
*   **Jugadores en Línea 🟢:** Muestra la cantidad de jugadores conectados simultáneamente en el sitio.

### 5. Panel de Administración 🛠️
Sección especial protegida para administradores y moderadores, accesible desde `/panel` y `/admin/dashboard`, que permite la gestión de usuarios y el control del estado del servidor.

---

## 🛠️ Tecnologías Utilizadas

El frontend ha sido diseñado con foco en la estética visual y la optimización de rendimiento:

| Tecnología | Propósito |
| :--- | :--- |
| **React (v18.2.0)** | Biblioteca base de interfaz de usuario. |
| **Vite (v5.2.0)** | Entorno de desarrollo rápido y empaquetador eficiente. |
| **Chakra UI (v2.10.4)** | Framework de componentes para diseño estructurado y accesibilidad. |
| **Tailwind CSS (v3.4.19)** | Estilos rápidos y responsivos con enfoque utilitario. |
| **Redux (v5.0.1) & Redux-Thunk** | Manejo del estado global (usuario actual, favoritos, saldo de fichas). |
| **Framer Motion** | Animaciones de interfaz y micro-interacciones suaves. |
| **SweetAlert2** | Modales de alertas y confirmaciones estilizados. |
| **Axios** | Cliente HTTP para interactuar con la API REST de NestJS. |

---

## 📂 Estructura del Proyecto (`src/`)

La estructura interna sigue una organización limpia basada en componentes y lógica de negocio:

*   **`src/api/`**: Contiene la definición de la URL base de la API backend ([rutaApi.js](file:///d:/Kann/Desktop/Documentos/Proyectos/RoyalFrontNew/src/api/rutaApi.js)).
*   **`src/components/`**: Los componentes de la interfaz de usuario divididos por secciones:
    *   `Home/`, `Nav/`, `footer/`: Estructura principal del sitio.
    *   `Juegos/`: Grid de juegos y sub-juegos (`Diamantes/`, `RoyalJoker/`, `royalpachinka/`).
    *   `Buychips/` y `PaymentStatus/`: Interfaces de compra de fichas e integración de pasarelas de pago.
    *   `Bazar/`: Tienda virtual de artículos.
    *   `Perfil/`: Vistas de perfiles de usuario (propios y públicos).
    *   `AdminPanel/` y `Panel/`: Tableros de administración para gestionar usuarios.
    *   `Login/`, `Register/`, `Logout/`: Autenticación y flujos de usuario.
*   **`src/context/`**: Contexto global de autenticación OAuth y JWT ([oauthContext.jsx](file:///d:/Kann/Desktop/Documentos/Proyectos/RoyalFrontNew/src/context/oauthContext.jsx)).
*   **`src/redux/`**: Configuración de Store, Reducer y Actions para el estado general de la aplicación.
*   **`src/services/`**: Métodos para interactuar con almacenamiento local de tokens y peticiones directas de sesión ([authService.js](file:///d:/Kann/Desktop/Documentos/Proyectos/RoyalFrontNew/src/services/authService.js)).

---

## ⚙️ Configuración y Variables de Entorno

El proyecto requiere configurar variables de entorno para las conexiones de API y pagos. Crea un archivo `.env.local` en la raíz del proyecto basándote en el archivo [.env.example](file:///d:/Kann/Desktop/Documentos/Proyectos/RoyalFrontNew/.env.example):

```env
# ID de Cliente de PayPal para la pasarela de pagos (Público)
VITE_PAYPAL_CLIENT_ID=tu_paypal_client_id_aqui

# URL de la API del Backend (NestJS)
VITE_API_URL=https://royalgamesbackend.onrender.com
```

*Nota: Las credenciales de Mercado Pago se administran exclusivamente en las variables de entorno del backend por motivos de seguridad.*

---

## 💻 Instalación y Desarrollo Local

Sigue estos pasos para levantar el entorno de desarrollo localmente:

1.  **Instalar dependencias:**
    ```bash
    npm install
    ```

2.  **Configurar variables de entorno:**
    Crea tu archivo `.env.local` en la raíz con las variables descritas anteriormente.

3.  **Iniciar el servidor de desarrollo (Vite):**
    ```bash
    npm run dev
    ```
    El sitio estará disponible por defecto en [http://localhost:5173](http://localhost:5173).

4.  **Compilar para producción:**
    ```bash
    npm run build
    ```

---

## 🔗 Enlaces Relacionados
*   **Servidor Backend (Render):** `https://royalgamesbackend.onrender.com`
