import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useSelector((state) => state);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Pequeño delay para permitir que Redux cargue el usuario
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  

  // Mientras se verifica, muestra un loader
  if (isChecking) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Si no hay usuario logueado, redirige a home
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  // Mods tienen acceso al panel igual que los admins (solo gestión de roles queda admin-only,
  // y eso ya lo bloquea el backend puntualmente donde corresponde).
  if (currentUser.role !== 'admin' && currentUser.role !== 'mod') {
    return <Navigate to="/" replace />;
  }

  // Si es admin, renderiza el componente
  return children;
};

export default ProtectedRoute;
