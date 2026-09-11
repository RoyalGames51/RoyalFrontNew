// URL del backend. Sale de VITE_API_URL (ver .env.example / .env.local).
// Para desarrollar contra el backend local, poné en tu .env.local:
//   VITE_API_URL=http://localhost:3001
// Si la variable no está definida, cae a producción para no romper builds.
const API_URL = import.meta.env.VITE_API_URL || 'https://royalgamesbackend.onrender.com';

export default API_URL;
