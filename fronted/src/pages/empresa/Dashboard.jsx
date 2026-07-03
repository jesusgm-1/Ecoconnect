import { useState, useEffect } from 'react';
import { useAuth } from '../../context/useAuth';
import { excedentesAPI } from '../../services/api';
import { Link } from 'react-router-dom';

const EmpresaDashboard = () => {
    const { user } = useAuth();
    const [excedentes, setExcedentes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [accionEnCurso, setAccionEnCurso] = useState(null);

    useEffect(() => {
        const fetchExcedentes = async () => {
            try {
                const region = user?.region?.toLowerCase();
                if (!region) {
                    throw new Error('No se pudo determinar la región del usuario autenticado');
                }
                if (!user?.empresa_id) {
                    throw new Error('No se pudo determinar la empresa del usuario autenticado');
                }

                const data = await excedentesAPI.porEmpresa(region, user.empresa_id);
                setExcedentes(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
                setError('No se pudieron cargar los excedentes');
            } finally {
                setLoading(false);
            }
        };

        if (user?.region) {
            fetchExcedentes();
        }
    }, [user]);

    const handleConfirmar = async (excedenteId) => {
        try {
            if (!user?.region || !user?.empresa_id) {
                throw new Error('No se pudo determinar el contexto de autenticación');
            }

            setAccionEnCurso(excedenteId);
            await excedentesAPI.confirmar(user.region.toLowerCase(), excedenteId, user.empresa_id);

            const data = await excedentesAPI.porEmpresa(user.region.toLowerCase(), user.empresa_id);
            setExcedentes(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            setError('No se pudo confirmar la entrega');
        } finally {
            setAccionEnCurso(null);
        }
    };

    const bloqueados = excedentes.filter((exc) => exc.estado === 'bloqueado');
    const restantes = excedentes.filter((exc) => exc.estado !== 'bloqueado');

    if (loading) return <div>Cargando dashboard...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div>
            <h2>Dashboard de Empresa</h2>
            <p>Bienvenido. Región actual: <strong>{user?.region?.toUpperCase()}</strong></p>

            <div style={{ marginTop: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>Mis Excedentes Publicados</h3>
                    <Link to="/empresa/publicar" style={styles.createBtn}>
                        + Nuevo Excedente
                    </Link>
                </div>

                {excedentes.length === 0 ? (
                    <p style={{ marginTop: '1rem', color: '#666' }}>No has publicado ningún excedente aún.</p>
                ) : restantes.length === 0 ? (
                    <p style={{ marginTop: '1rem', color: '#666' }}>No tienes excedentes disponibles para mostrar en esta sección.</p>
                ) : (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>ID</th>
                                <th style={styles.th}>Tipo</th>
                                <th style={styles.th}>Cantidad</th>
                                <th style={styles.th}>Estado</th>
                                <th style={styles.th}>Fecha Límite</th>
                            </tr>
                        </thead>
                        <tbody>
                            {restantes.map((exc) => (
                                <tr key={exc.id} style={styles.tr}>
                                    <td style={styles.td}>{exc.id}</td>
                                    <td style={styles.td}>{exc.tipo_recurso}</td>
                                    <td style={styles.td}>{exc.cantidad} {exc.unidad}</td>
                                    <td style={styles.td}>
                                        <span style={getEstadoStyle(exc.estado)}>
                                            {exc.estado}
                                        </span>
                                    </td>
                                    <td style={styles.td}>{new Date(exc.fecha_limite).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <div style={{ marginTop: '2rem' }}>
                    <h3>Excedentes Bloqueados</h3>

                    {bloqueados.length === 0 ? (
                        <p style={{ marginTop: '1rem', color: '#666' }}>No tienes excedentes bloqueados pendientes de confirmación.</p>
                    ) : (
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>ID</th>
                                    <th style={styles.th}>Tipo</th>
                                    <th style={styles.th}>Cantidad</th>
                                    <th style={styles.th}>Estado</th>
                                    <th style={styles.th}>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bloqueados.map((exc) => (
                                    <tr key={exc.id} style={styles.tr}>
                                        <td style={styles.td}>{exc.id}</td>
                                        <td style={styles.td}>{exc.tipo_recurso}</td>
                                        <td style={styles.td}>{exc.cantidad} {exc.unidad}</td>
                                        <td style={styles.td}>
                                            <span style={getEstadoStyle(exc.estado)}>
                                                {exc.estado}
                                            </span>
                                        </td>
                                        <td style={styles.td}>
                                            <button
                                                type="button"
                                                style={styles.confirmBtn}
                                                onClick={() => handleConfirmar(exc.id)}
                                                disabled={accionEnCurso === exc.id}
                                            >
                                                {accionEnCurso === exc.id ? 'Confirmando...' : 'Confirmar Entrega'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

const getEstadoStyle = (estado) => {
    const colorMap = {
        disponible: '#4caf50',
        transferido: '#2196f3',
        bloqueado: '#ff9800',
        vencido: '#f44336'
    };

    const color = colorMap[estado] ?? '#999';

    return {
        backgroundColor: color,
        color: 'white',
        padding: '0.2rem 0.5rem',
        borderRadius: '12px',
        fontSize: '0.8rem',
        fontWeight: 'bold'
    };
};

const styles = {
    createBtn: {
        backgroundColor: '#2e7d32',
        color: 'white',
        textDecoration: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        fontWeight: 'bold'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginTop: '1rem',
        backgroundColor: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    th: {
        padding: '1rem',
        textAlign: 'left',
        backgroundColor: '#f5f5f5',
        borderBottom: '2px solid #ddd'
    },
    tr: {
        borderBottom: '1px solid #ddd'
    },
    td: {
        padding: '1rem'
    },
    confirmBtn: {
        backgroundColor: '#1565c0',
        color: 'white',
        border: 'none',
        padding: '0.55rem 0.9rem',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold'
    }
};

export default EmpresaDashboard;
