import { createContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

const readUserFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        return null;
    }

    try {
        const decoded = jwtDecode(token);
        return {
            email: decoded.sub,
            rol: decoded.rol,
            region: decoded.region
        };
    } catch (error) {
        console.error('Token no válido:', error);
        localStorage.removeItem('token');
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(readUserFromToken);

    const login = (token) => {
        localStorage.setItem('token', token);
        const decoded = jwtDecode(token);
        setUser({
            email: decoded.sub,
            rol: decoded.rol,
            region: decoded.region,
            empresa_id: decoded.empresa_id,
            ong_id: decoded.ong_id
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const value = {
        user,
        loading: false,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
