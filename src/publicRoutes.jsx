import { useAuth } from "./context/auth.context";
import { Outlet, Navigate } from 'react-router-dom';

function PublicRoute({ redirectToUser = "/Home", redirectToAdmin = "/admin" }) {
    const { loading, isAuthenticated, role } = useAuth();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
              <div className="text-center">
                <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-purple-700 border-opacity-70"></div>
                <p className="mt-4 text-xl text-purple-700">Loading...</p>
              </div>
            </div>
          );
    }

    if (isAuthenticated()) {
      if (role === "usuario") {
          return <Navigate to={redirectToUser} />;
      } else if (role === "Admin" || role === "instructor") {  // Añade la verificación del rol 'instructor'
          return <Navigate to={redirectToAdmin} />;
      }
    }

    // Si no está autenticado, renderizar el componente hijo
    return <Outlet />;
}

export default PublicRoute;