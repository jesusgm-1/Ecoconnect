import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { excedentesAPI } from '../../services/api';

const OngReclamar = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [excedente, setExcedente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [claiming, setClaiming] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDetalle = async () => {
            try {
                const region = user?.region?.toLowerCase();
                if (!region) {
                    throw new Error('No se pudo determinar la región del usuario autenticado');
                }

                const data = await excedentesAPI.listar(region);
                const actual = Array.isArray(data)
                    ? data.find((e) => e.id.toString() === id)
                    : null;

                if (actual && actual.estado === 'disponible') {
                    setExcedente(actual);
                } else {
                    setError('El excedente no existe o ya no está disponible.');
                }
            } catch (err) {
                console.error(err);
                setError('Error al cargar la información del excedente.');
            } finally {
                setLoading(false);
            }
        };

        if (user?.region) fetchDetalle();
    }, [id, user]);

    const handleConfirmar = async () => {
        setClaiming(true);
        setError('');
        try {
            const ongID = user.id || 1;
            const region = user?.region?.toLowerCase();
            if (!region) {
                throw new Error('No se pudo determinar la región del usuario autenticado');
            }

            await excedentesAPI.reclamar(region, id, ongID);
            alert('¡Excedente reclamado exitosamente!');
            navigate('/ong/feed');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || 'Error al intentar reclamar el excedente.');
        } finally {
            setClaiming(false);
        }
    };

    if (loading) return <div>Cargando información del recurso...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;
    if (!excedente) return <div>No se encontró el recurso.</div>;

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2>Confirmar Reclamo</h2>
                <p>Estás a punto de confirmar tu interés en recoger el siguiente recurso:</p>

                <div style={styles.detailBox}>
                    <p><strong>Tipo:</strong> {excedente.tipo_recurso}</p>
                    <p><strong>Cantidad a recibir:</strong> {excedente.cantidad} {excedente.unidad}</p>
                    <p><strong>Ubicación de recojo:</strong> {excedente.ubicacion}</p>
                    <p><strong>Fecha máxima:</strong> {new Date(excedente.fecha_limite).toLocaleDateString()}</p>
                </div>

                <div style={styles.warningBox}>
                    <strong>Importante:</strong> Al confirmar, te comprometes a acercarte a la ubicación indicada cumpliendo los protocolos correspondientes antes de la fecha límite y de que el estado cambie.
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                    <button
                        onClick={() => navigate('/ong/feed')}
                        style={styles.cancelBtn}
                        disabled={claiming}
                    >
                        Volver
                    </button>
                    <button
                        onClick={handleConfirmar}
                        style={styles.submitBtn}
                        disabled={claiming}
                    >
                        {claiming ? 'Procesando...' : 'Confirmar Reclamo'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '2rem'
    },
    card: {
        background: '#fff',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '500px',
    },
    detailBox: {
        backgroundColor: '#f5f5f5',
        padding: '1.5rem',
        borderRadius: '6px',
        margin: '1.5rem 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
    },
    warningBox: {
        backgroundColor: '#fff3cd',
        color: '#c62828',
        padding: '1rem',
        borderRadius: '6px',
        fontSize: '0.9rem',
        borderLeft: '4px solid #c62828'
    },
    submitBtn: {
        flex: 1,
        padding: '0.75rem',
        backgroundColor: '#1976d2',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        fontSize: '1rem',
        cursor: 'pointer',
        fontWeight: 'bold'
    },
    cancelBtn: {
        flex: 1,
        padding: '0.75rem',
        backgroundColor: '#e0e0e0',
        color: '#333',
        border: 'none',
        borderRadius: '4px',
        fontSize: '1rem',
        cursor: 'pointer',
        fontWeight: 'bold'
    }
};

export default OngReclamar;
