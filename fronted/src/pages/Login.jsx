import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { authAPI } from '../services/api';

const Login = () => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [region, setRegion] = useState('lima');
    const [rol, setRol] = useState('empresa');
    const [nombre, setNombre] = useState('');
    const [ruc, setRuc] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (isLoginMode) {
                const payload = { email, password };
                const data = await authAPI.login(region, payload);
                if (data.access_token) {
                    login(data.access_token);
                    navigate('/');
                } else {
                    setError('Credenciales incorrectas');
                }
            } else {
                const payload = {
                    email,
                    password,
                    rol,
                    region,
                    ...(rol !== 'admin' && { nombre }),
                    ...(rol === 'empresa' && { ruc }),
                    ...(rol === 'ong' && { categorias_interes: 'General' })
                };

                const data = await authAPI.register(region, payload);
                if (data.access_token) {
                    login(data.access_token);
                    navigate('/');
                } else {
                    alert('Registro exitoso. Por favor, inicia sesión.');
                    setIsLoginMode(true);
                }
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || 'Error en la solicitud. Revisa la consola.');
        }
    };

    return (
        <div className="page">
            <div className="split-grid" style={{ alignItems: 'stretch' }}>
                <section className="card card-hover section-card" style={{ padding: '2rem' }}>
                    <p className="helper-text" style={{ marginBottom: '0.5rem' }}>ODS 12 · Economía circular distribuida</p>
                    <h2 className="page-title" style={{ marginBottom: '0.5rem' }}>
                        {isLoginMode ? 'Bienvenido de nuevo' : 'Crear cuenta'}
                    </h2>
                    <p className="page-subtitle" style={{ marginBottom: '1.5rem' }}>
                        Gestiona excedentes, transferencias y reclamaciones desde un solo lugar.
                    </p>

                    {error && <div className="notice notice-error" style={{ marginBottom: '1rem' }}>{error}</div>}

                    <form onSubmit={handleSubmit} className="form-grid">
                        <div className="field">
                            <label>Región Nodo</label>
                            <select value={region} onChange={(e) => setRegion(e.target.value)} required className="select">
                                <option value="lima">Lima</option>
                                <option value="arequipa">Arequipa</option>
                                <option value="trujillo">Trujillo</option>
                            </select>
                        </div>

                        <div className="field">
                            <label>Email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input" />
                        </div>

                        <div className="field">
                            <label>Contraseña</label>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input" />
                        </div>

                        {!isLoginMode && (
                            <>
                                <div className="field">
                                    <label>Rol</label>
                                    <select value={rol} onChange={(e) => setRol(e.target.value)} required className="select">
                                        <option value="empresa">Empresa</option>
                                        <option value="ong">ONG</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                {rol !== 'admin' && (
                                    <div className="field">
                                        <label>Nombre de la Entidad</label>
                                        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="input" />
                                    </div>
                                )}

                                {rol === 'empresa' && (
                                    <div className="field">
                                        <label>RUC</label>
                                        <input type="text" value={ruc} onChange={(e) => setRuc(e.target.value)} required className="input" />
                                    </div>
                                )}
                            </>
                        )}

                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                            {isLoginMode ? 'Entrar' : 'Registrarse'}
                        </button>
                    </form>

                    <div style={{ marginTop: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                        <p className="helper-text">
                            {isLoginMode ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                        </p>
                        <button type="button" className="btn btn-ghost" onClick={() => setIsLoginMode(!isLoginMode)}>
                            {isLoginMode ? 'Regístrate aquí' : 'Inicia sesión'}
                        </button>
                    </div>
                </section>

                <aside className="card card-hover section-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: 'linear-gradient(180deg, #f3fbf4 0%, #ffffff 100%)' }}>
                    <div>
                        <div className="brand" style={{ marginBottom: '1rem' }}>
                            <span className="brand-mark">🌱</span>
                            <span>Eco-Connect</span>
                        </div>
                        <h3 className="section-title">Conecta donantes con ONGs en tu nodo regional</h3>
                        <p className="page-subtitle">
                            Publica excedentes, reclama recursos y confirma entregas con un flujo distribuido simple y trazable.
                        </p>
                    </div>

                    <div className="kpi-grid" style={{ marginTop: '1.5rem' }}>
                        <div className="card kpi-card" style={{ background: '#fffef7' }}>
                            <p className="kpi-title">Rápido</p>
                            <p className="helper-text">Registro y login por región</p>
                        </div>
                        <div className="card kpi-card" style={{ background: '#f4fbf5' }}>
                            <p className="kpi-title">Seguro</p>
                            <p className="helper-text">JWT y roles por perfil</p>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Login;
