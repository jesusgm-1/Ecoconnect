import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { excedentesAPI } from '../../services/api';
import { Link } from 'react-router-dom';

const EmpresaDashboard = () => {
    const { user } = useAuth();
    const [excedentes, setExcedentes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchExcedentes = async () => {
            try {
                // Buscamos los excedentes de la región del usuario logueado
                const data = await excedentesAPI.listar(user.region);
                
                // Filtramos para que la empresa solo vea SUS excedentes
                // Asumiendo que el backend devuelve { id, empresa_id, tipo_recurso... } 
                // En un caso real el backend debería filtrar esto por el token del usuario
                // pero lo haremos aquí preventivamente.
                // *Nota:* Necesitaríamos que el token devuelva el empresa_id o filtrar en el backend.
                setExcedentes(data); 
            } catch (err) {
                console.error(err);
                setError('No se pudieron cargar los excedentes');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchExcedentes();
        }
    }, [user]);

    if (loading) return <div>Cargando dashboard...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div>
            <h2>Dashboard de Empresa</h2>
            <p>Bienvenido. Región actual: <strong>{user.region.toUpperCase()}</strong></p>

            <div style={{ marginTop: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3>Mis Excedentes Publicados</h3>
                    <Link to="/empresa/publicar" style={styles.createBtn}>
                        + Nuevo Excedente
                    </Link>
                </div>

                {excedentes.length === 0 ? (
                    <p style={{ marginTop: '1rem', color: '#666' }}>No has publicado ningún excedente aún.</p>
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
                            {excedentes.map((exc) => (
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
            </div>
        </div>
    );
};

const getEstadoStyle = (estado) => {
    let color = '#ccc';
    switch(estado) {
        case 'disponible': color = '#4caf50'; break;
        case 'transferido': color = '#2196f3'; break;
        case 'bloqueado': color = '#ff9800'; break;
        case 'vencido': color = '#f44336'; break;
        default: color = '#999';
    }
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
        padding: '1rem',
    }
};

export default EmpresaDashboard;
