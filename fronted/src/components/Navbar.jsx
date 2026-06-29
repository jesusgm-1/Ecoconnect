import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={styles.nav}>
            <div style={styles.brand}>
                <Link to="/" style={styles.link}>Eco-Connect</Link>
            </div>

            {user && (
                <div style={styles.links}>
                    <span style={styles.userInfo}>Hola, {user.email} ({user.rol})</span>

                    {user.rol === 'empresa' && (
                        <>
                            <Link to="/empresa/dashboard" style={styles.link}>Mis Excedentes</Link>
                            <Link to="/empresa/publicar" style={styles.link}>Publicar Excedente</Link>
                        </>
                    )}

                    {user.rol === 'ong' && (
                        <Link to="/ong/feed" style={styles.link}>Feed Disponibles</Link>
                    )}

                    {user.rol === 'admin' && (
                        <Link to="/admin/dashboard" style={styles.link}>Panel Admin</Link>
                    )}

                    <button onClick={handleLogout} style={styles.logoutBtn}>Cerrar Sesión</button>
                </div>
            )}
        </nav>
    );
};

const styles = {
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 2rem',
        backgroundColor: '#2e7d32',
        color: '#fff'
    },
    brand: {
        fontSize: '1.5rem',
        fontWeight: 'bold'
    },
    links: {
        display: 'flex',
        gap: '1.5rem',
        alignItems: 'center'
    },
    link: {
        color: '#fff',
        textDecoration: 'none',
        fontWeight: '500'
    },
    userInfo: {
        fontSize: '0.9rem',
        opacity: 0.9,
        marginRight: '1rem'
    },
    logoutBtn: {
        backgroundColor: '#d32f2f',
        color: 'white',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold'
    }
};

export default Navbar;
