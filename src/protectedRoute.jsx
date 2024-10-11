import React, { useState, useEffect } from 'react';
import { useAuth } from "./context/auth.context";
import { Outlet, Navigate } from 'react-router-dom';
import VideoPage from './views/VideoPage';

function ProtectedRoute({ requiredRole }) {
    const { loading, isAuthenticated, user, role } = useAuth();
    const [showVideo, setShowVideo] = useState(false);

    useEffect(() => {
        // Verificar si el usuario está autenticado y si el video ya se mostró en esta sesión
        if (isAuthenticated() && !sessionStorage.getItem('videoShown')) {
            setShowVideo(true);
            sessionStorage.setItem('videoShown', 'true'); // Marcar que el video ya se mostró en esta sesión

            const timer = setTimeout(() => {
                setShowVideo(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [isAuthenticated]);

    // Mostrar un indicador de carga mientras se verifica la autenticación
    if (loading) {
        return <div>Loading...</div>;
    }

    // Mostrar el video de carga si el usuario acaba de autenticarse
    if (showVideo) {
        return <VideoPage userRole={role} />;
    }

    // Verificar si el usuario está autenticado
    if (!isAuthenticated()) {
        console.log("User is not authenticated, redirecting to /notFound");
        return <Navigate to="/notFound" />;
    }

    // Verificar si el rol del usuario está disponible y coincide con el rol requerido
    const userRole = role;
    if (requiredRole && (!userRole || userRole !== requiredRole)) {
        console.log(`User role (${userRole}) does not match required role (${requiredRole}), redirecting to /notFound`);
        return <Navigate to="/notFound" />;
    }

    console.log("la informacion del usuario es", user);

    // Renderizar el componente Outlet si el usuario está autorizado
    return <Outlet />;
}

export default ProtectedRoute;