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
        <nav className="nav">
            <div className="nav-inner">
                <Link to="/" className="brand">
                    <span className="brand-mark">🌱</span>
                    <span>Eco-Connect</span>
                </Link>

                {user ? (
                    <div className="nav-links">
                        <span className="user-chip">
                            <span className="user-dot" />
                            <span>{user.email} · {user.rol}</span>
                        </span>

                        {user.rol === 'empresa' && (
                            <>
                                <Link to="/empresa/dashboard" className="nav-pill">Mis Excedentes</Link>
                                <Link to="/empresa/publicar" className="nav-pill">Publicar</Link>
                            </>
                        )}

                        {user.rol === 'ong' && (
                            <Link to="/ong/feed" className="nav-pill">Feed</Link>
                        )}

                        {user.rol === 'admin' && (
                            <Link to="/admin/dashboard" className="nav-pill">Panel Admin</Link>
                        )}

                        <button onClick={handleLogout} className="btn btn-danger">
                            Cerrar Sesión
                        </button>
                    </div>
                ) : (
                    <div className="nav-links">
                        <Link to="/login" className="nav-pill">Ingresar</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
