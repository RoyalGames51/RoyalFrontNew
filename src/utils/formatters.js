/**
 * Formatea el valor de chips a un string con separadores de miles.
 * Maneja strings y números, con fallback a 0.
 */
export const formatChips = (chips) => {
  const value = typeof chips === 'string' ? Number(chips) : (chips ?? 0);
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(
    Number.isFinite(value) ? value : 0
  );
};

/**
 * Configuración estándar de SweetAlert2 para el tema dark/gold del proyecto.
 */
export const swalThemeConfig = {
  confirmButtonColor: "#C9A84C",
  background: '#16130d',
  color: '#e9e1d7',
};
