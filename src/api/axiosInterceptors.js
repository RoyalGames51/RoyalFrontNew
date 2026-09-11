import axios from 'axios';
import { tokenStore } from './tokenStore';
import { authService } from '../services/authService';

/**
 * Interceptores globales de axios.
 *
 * Request: adjunta `Authorization: Bearer <access_token>` leyendo el token DE MEMORIA
 * (tokenStore) en cada request — no de localStorage. Es la única fuente de verdad del
 * header en toda la app.
 *
 * Response: ante un 401 de una sesión que creíamos activa, intenta UNA vez refrescar
 * el access token (POST /auth/refresh, que usa el refresh token real guardado en una
 * cookie httpOnly) y reintenta el request original con el token nuevo. Si el refresh
 * también falla, ahí sí es sesión terminada: se limpia todo y se avisa al resto de la
 * app con el evento `auth:session-expired`. El AuthProvider (src/context/oauthContext.jsx)
 * lo escucha y hace el logout visible + redirect al login.
 */

// Endpoints donde un 401 es una respuesta ESPERADA que el propio componente maneja
// (credenciales incorrectas, token de Google inválido, etc.), o que son parte del
// mecanismo de refresh en sí — nunca disparan el flujo de "sesión expirada".
const AUTH_ENDPOINTS_IGNORED = ['/auth/login', '/auth/google', '/signup', '/auth/refresh', '/auth/logout'];

// Evita que un aluvión de requests fallando a la vez dispare N avisos / N redirects.
let handlingSessionExpiry = false;

// Varios requests pueden 401 al mismo tiempo (ej: se cargan 3 cosas en paralelo cuando
// el access token ya venció) — todas comparten esta única llamada a /auth/refresh en
// vez de disparar una por cada una.
let refreshPromise = null;

const isIgnoredAuthEndpoint = (url = '') =>
  AUTH_ENDPOINTS_IGNORED.some((endpoint) => url.includes(endpoint));

function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = authService.refreshSession().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

function expireSession() {
  if (handlingSessionExpiry) return;
  handlingSessionExpiry = true;

  authService.clearSession();
  window.dispatchEvent(new CustomEvent('auth:session-expired'));

  // Se libera el flag tras un momento: el AuthProvider ya habrá hecho el redirect, y
  // si el usuario vuelve a loguearse el interceptor queda sano.
  setTimeout(() => {
    handlingSessionExpiry = false;
  }, 3000);
}

export function setupAxiosInterceptors() {
  // Necesario para que la cookie httpOnly del refresh token viaje en las llamadas a
  // /auth/refresh y /auth/logout (está scopeada a path=/auth, así que en el resto de
  // los requests esto no manda nada de más).
  axios.defaults.withCredentials = true;

  axios.interceptors.request.use((config) => {
    const token = tokenStore.get();
    if (token && !config.headers?.Authorization) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    } else if (!token && config.headers?.Authorization) {
      delete config.headers.Authorization;
    }
    return config;
  });

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error?.response?.status;
      const config = error?.config || {};
      const url = config.url || '';
      const hadSession = !!tokenStore.get();

      if (status === 401 && hadSession && !isIgnoredAuthEndpoint(url) && !config._retriedAfterRefresh) {
        try {
          const newToken = await refreshAccessToken();
          config._retriedAfterRefresh = true;
          config.headers = { ...config.headers, Authorization: `Bearer ${newToken}` };
          return axios(config);
        } catch (refreshError) {
          expireSession();
          return Promise.reject(error);
        }
      }

      // Siempre se propaga: los `.catch` locales siguen ejecutándose igual.
      return Promise.reject(error);
    },
  );
}
