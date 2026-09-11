/**
 * Guarda el access token SOLO en memoria (variable de módulo), nunca en localStorage.
 * Es lo que hace que un XSS ya no pueda robar una sesión de 24h leyendo localStorage:
 * en el peor caso se lleva un access token de vida corta (ACCESS_TOKEN_TTL en el backend).
 *
 * Se pierde al recargar la página a propósito — el arranque de la app (AuthProvider)
 * lo repone llamando a POST /auth/refresh, que usa el refresh token real (httpOnly,
 * inalcanzable desde JS) guardado en una cookie.
 */
let accessToken = null;

export const tokenStore = {
  get: () => accessToken,
  set: (token) => {
    accessToken = token || null;
  },
  clear: () => {
    accessToken = null;
  },
};
