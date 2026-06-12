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

  console.log('ProtectedRoute - currentUser:', currentUser);
  console.log('ProtectedRoute - currentUser.role:', currentUser?.role);
  console.log('ProtectedRoute - isChecking:', isChecking);

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
    console.warn('ProtectedRoute: No hay currentUser, redirigiendo a home');
    return <Navigate to="/" replace />;
  }

  // Si el usuario no es admin, redirige a home
  if (currentUser.role !== 'admin') {
    console.warn(`ProtectedRoute: Usuario no es admin (role: ${currentUser.role}), redirigiendo a home`);
    return <Navigate to="/" replace />;
  }

  // Si es admin, renderiza el componente
  console.log('ProtectedRoute: Usuario es admin, permitiendo acceso');
  return children;
};

export default ProtectedRoute;
