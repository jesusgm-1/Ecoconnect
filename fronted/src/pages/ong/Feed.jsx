import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { excedentesAPI } from '../../services/api';
import { Link } from 'react-router-dom';

const OngFeed = () => {
    const { user } = useAuth();
    const [excedentes, setExcedentes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchExcedentes = async () => {
            try {
                // Buscamos los excedentes de la región de la ONG logueada
                const data = await excedentesAPI.listar(user.region);
                
                // Filtramos SOLO los excedentes que estén "disponibles"
                // y que no estén vencidos para mostrar en el feed publico
                const disponibles = data.filter(e => e.estado === 'disponible');
                setExcedentes(disponibles); 
            } catch (err) {
                console.error(err);
                setError('No se pudieron cargar los excedentes disponibles.');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchExcedentes();
        }
    }, [user]);

    if (loading) return <div>Cargando excedentes disponibles...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <div>
            <h2>Feed de Excedentes ({user.region.toUpperCase()})</h2>
            <p>Aquí puedes ver los recursos que las empresas han puesto a disposición.</p>

            <div style={{ marginTop: '2rem' }}>
                {excedentes.length === 0 ? (
                    <p style={{ marginTop: '1rem', color: '#666' }}>No hay excedentes disponibles en tu región en este momento.</p>
                ) : (
                    <div style={styles.grid}>
                        {excedentes.map((exc) => (
                            <div key={exc.id} style={styles.card}>
                                <div style={styles.cardHeader}>
                                    <h3>{exc.tipo_recurso}</h3>
                                    <span style={styles.badge}>{exc.cantidad} {exc.unidad}</span>
                                </div>
                                <div style={styles.cardBody}>
                                    <p><strong>Ubicación:</strong> {exc.ubicacion}</p>
                                    <p><strong>Fecha Límite:</strong> {new Date(exc.fecha_limite).toLocaleDateString()}</p>
                                    <p style={{ fontSize: '0.8rem', color: '#666' }}>
                                        Publicado: {new Date(exc.fecha_registro || Date.now()).toLocaleDateString()}
                                    </p>
                                </div>
                                <div style={styles.cardFooter}>
                                    <Link to={/ong/reclamar/} style={styles.reclamarBtn}>
                                        Reclamar
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem',
        marginTop: '1rem'
    },
    card: {
        background: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
    },
    cardHeader: {
        backgroundColor: '#4caf50',
        color: 'white',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    badge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: '0.2rem 0.6rem',
        borderRadius: '12px',
        fontWeight: 'bold'
    },
    cardBody: {
        padding: '1rem',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
    },
    cardFooter: {
        padding: '1rem',
        borderTop: '1px solid #eee',
        backgroundColor: '#fafafa'
    },
    reclamarBtn: {
        display: 'block',
        textAlign: 'center',
        backgroundColor: '#1976d2',
        color: 'white',
        textDecoration: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        fontWeight: 'bold',
        transition: 'background-color 0.2s'
    }
};

export default OngFeed;
