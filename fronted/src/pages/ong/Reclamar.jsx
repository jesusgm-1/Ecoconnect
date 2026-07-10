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

    if (loading) return <div className="empty-state">Cargando información del recurso...</div>;
    if (error) return <div className="notice notice-error">{error}</div>;
    if (!excedente) return <div className="notice notice-warning">No se encontró el recurso.</div>;

    return (
        <div className="page">
            <div className="page-hero">
                <div>
                    <h2 className="page-title">Confirmar Reclamo</h2>
                    <p className="page-subtitle">Revisa el recurso antes de reservarlo para tu organización.</p>
                </div>
            </div>

            <section className="card form-card card-hover" style={{ width: 'min(100%, 640px)' }}>
                <p className="helper-text">Estás a punto de confirmar tu interés en recoger el siguiente recurso:</p>

                <div className="card section-card" style={{ background: '#f7f9fb', marginTop: '1rem' }}>
                    <div className="form-grid" style={{ gap: '0.65rem' }}>
                        <p><strong>Tipo:</strong> {excedente.tipo_recurso}</p>
                        <p><strong>Cantidad a recibir:</strong> {excedente.cantidad} {excedente.unidad}</p>
                        <p><strong>Ubicación de recojo:</strong> {excedente.ubicacion}</p>
                        <p><strong>Fecha máxima:</strong> {new Date(excedente.fecha_limite).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="notice notice-warning" style={{ marginTop: '1rem' }}>
                    <strong>Importante:</strong> Al confirmar, te comprometes a acercarte a la ubicación indicada cumpliendo los protocolos correspondientes antes de la fecha límite y de que el estado cambie.
                </div>

                <div className="actions-row" style={{ marginTop: '1.5rem' }}>
                    <button
                        onClick={() => navigate('/ong/feed')}
                        className="btn btn-ghost"
                        disabled={claiming}
                    >
                        Volver
                    </button>
                    <button
                        onClick={handleConfirmar}
                        className="btn btn-info"
                        disabled={claiming}
                    >
                        {claiming ? 'Procesando...' : 'Confirmar Reclamo'}
                    </button>
                </div>
            </section>
        </div>
    );
};

export default OngReclamar;
