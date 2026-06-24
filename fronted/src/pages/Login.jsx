import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const Login = () => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    // Form states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [region, setRegion] = useState('lima');
    const [rol, setRol] = useState('empresa'); // 'empresa' o 'ong'
    const [nombre, setNombre] = useState('');
    const [ruc, setRuc] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (isLoginMode) {
                // En FastAPI OAuth2 generalmente se pide 'username' y 'password'
                // Aqui mandamos como JSON pero dependiendo del backend podria necesitar form-data.
                // Asumimos JSON personalizado por ahora:
                const payload = {
                    email: email, // O 'username: email' dependiendo de tu backend auth.py
                    password: password
                };
                
                const data = await authAPI.login(region, payload);
                if (data.access_token) {
                    login(data.access_token);
                    navigate('/'); // Root redirigirá según el rol
                } else {
                    setError('Credenciales incorrectas');
                }
            } else {
                // Modo Registro
                const payload = {
                    email,
                    password,
                    rol,
                    region,
                    nombre,
                    ...(rol === 'empresa' && { ruc }),
                    ...(rol === 'ong' && { categorias_interes: 'General' }) // Simplificado
                };
                const data = await authAPI.register(region, payload);
                // Asumimos que el registro tambien devuelve un token, o pide hacer login luego
                if (data.access_token) {
                    login(data.access_token);
                    navigate('/');
                } else {
                    // Si no devuelve token, pasamos a login
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
        <div style={styles.container}>
            <div style={styles.card}>
                <h2>{isLoginMode ? 'Iniciar Sesión' : 'Registro'} - Eco-Connect</h2>
                
                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label>Región Nodo</label>
                        <select value={region} onChange={(e) => setRegion(e.target.value)} required style={styles.input}>
                            <option value="lima">Lima</option>
                            <option value="arequipa">Arequipa</option>
                            <option value="trujillo">Trujillo</option>
                        </select>
                    </div>

                    <div style={styles.inputGroup}>
                        <label>Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input} />
                    </div>

                    <div style={styles.inputGroup}>
                        <label>Contraseña</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={styles.input} />
                    </div>

                    {!isLoginMode && (
                        <>
                            <div style={styles.inputGroup}>
                                <label>Rol</label>
                                <select value={rol} onChange={(e) => setRol(e.target.value)} required style={styles.input}>
                                    <option value="empresa">Empresa</option>
                                    <option value="ong">ONG</option>
                                </select>
                            </div>

                            <div style={styles.inputGroup}>
                                <label>Nombre de la Entidad</label>
                                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required style={styles.input} />
                            </div>

                            {rol === 'empresa' && (
                                <div style={styles.inputGroup}>
                                    <label>RUC</label>
                                    <input type="text" value={ruc} onChange={(e) => setRuc(e.target.value)} required style={styles.input} />
                                </div>
                            )}
                        </>
                    )}

                    <button type="submit" style={styles.button}>
                        {isLoginMode ? 'Entrar' : 'Registrarse'}
                    </button>
                </form>

                <p style={styles.toggleText}>
                    {isLoginMode ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                    <button style={styles.toggleBtn} onClick={() => setIsLoginMode(!isLoginMode)}>
                        {isLoginMode ? ' Registrate aquí' : ' Inicia sesión'}
                    </button>
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
    },
    card: {
        background: '#fff',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        marginTop: '1.5rem',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        textAlign: 'left',
    },
    input: {
        padding: '0.75rem',
        borderRadius: '4px',
        border: '1px solid #ccc',
        fontSize: '1rem',
    },
    button: {
        padding: '0.75rem',
        backgroundColor: '#2e7d32',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        fontSize: '1rem',
        cursor: 'pointer',
        marginTop: '1rem',
    },
    error: {
        color: 'red',
        fontSize: '0.9rem',
        marginTop: '1rem',
        backgroundColor: '#ffebee',
        padding: '0.5rem',
        borderRadius: '4px',
    },
    toggleText: {
        marginTop: '1.5rem',
        fontSize: '0.9rem',
    },
    toggleBtn: {
        background: 'none',
        border: 'none',
        color: '#1976d2',
        cursor: 'pointer',
        textDecoration: 'underline',
        fontSize: '0.9rem',
    }
};

export default Login;
