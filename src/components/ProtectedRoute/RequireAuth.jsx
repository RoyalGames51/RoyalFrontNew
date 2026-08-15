import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/oauthContext';

// Gates any route behind login (used for the games catalog/detail/play pages) — guests get
// bounced to the lobby with the registration modal auto-opened, reusing the same
// window event the "Registrarse" button already dispatches.
export default function RequireAuth({ children }) {
  const { currentUser } = useSelector((state) => state);
  // On a fresh page load (reload, or a game opened via window.open in a new tab) the session
  // is restored from the saved token asynchronously — currentUser in Redux is briefly empty
  // even for someone who's actually logged in. Waiting for that restore to finish is what stops
  // a real session from getting bounced to the lobby by a false "not logged in" read.
  const { loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !currentUser?.id) {
      window.dispatchEvent(new Event('open-register-modal'));
    }
  }, [authLoading, currentUser?.id]);

  if (authLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentUser?.id) {
    return <Navigate to="/" replace />;
  }

  return children;
}
