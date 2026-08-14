import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

// Gates any route behind login (used for the games catalog/detail/play pages) — guests get
// bounced to the lobby with the registration modal auto-opened, reusing the same
// window event the "Registrarse" button already dispatches.
export default function RequireAuth({ children }) {
  const { currentUser } = useSelector((state) => state);

  useEffect(() => {
    if (!currentUser?.id) {
      window.dispatchEvent(new Event('open-register-modal'));
    }
  }, [currentUser?.id]);

  if (!currentUser?.id) {
    return <Navigate to="/" replace />;
  }

  return children;
}
