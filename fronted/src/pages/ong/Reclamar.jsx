import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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
                // Al hacer el GET de toda la lista, buscamos el que coincida con el ID
                // Ya que tu gateway actualmente no tiene implementado (o no documentado) 
                // el endpoint GET /excedentes/{region}/{id} en la API de servicios,
                // vamos a buscar la lista y filtrar por id.
                const data = await excedentesAPI.listar(user.region);
                const actual = data.find(e => e.id.toString() === id);
                
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

        if (user) fetchDetalle();
    }, [id, user]);

    const handleConfirmar = async () => {
        setClaiming(true);
        setError('');
        try {
            // Actualmente la api pide (region, excedenteId, ongId)
            // Asumimos que como el user decodifica y el backend saca el ID del token,
            // podemos pasar un fake_id o sacar ong_id del token si esta, de lo contrario
            // asumo que en auth tu token guardaba "email". Pongamos un id provisorio (ej 1)
            // IMPORTANTE: el jwt debe tener el user.id o ong.id para que funcione real. 
            // Tu API gateway tiene: /excedentes/{region}/{excedente_id}/reclamar?ong_id={ong_id}
            
            // Asumimos que el backend obtiene el auth o mandas el id, por ahora envio 1
            // si user.id no existe (modificar luego si lo metes al token).
            const ongID = user.id || 1; 

            await excedentesAPI.reclamar(user.region, id, ongID);
            
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
        backgroundColor: '#1976d2', // Azul
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
