import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                <p>Cargando...</p>
            </div>
        );
    }

    // Si no hay usuario logueado, redirigir a Login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Si se especifican roles y el usuario no tiene los permisos, redirigir al login (o a una página genérica)
    if (allowedRoles && !allowedRoles.includes(user.rol)) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
