import { useState, useEffect } from 'react';
import { useAuth } from '../../context/useAuth';
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
                const region = user?.region?.toLowerCase();
                if (!region) {
                    throw new Error('No se pudo determinar la región del usuario autenticado');
                }

                const data = await excedentesAPI.listar(region);
                const disponibles = Array.isArray(data)
                    ? data.filter((e) => e.estado === 'disponible')
                    : [];
                setExcedentes(disponibles);
            } catch (err) {
                console.error(err);
                setError('No se pudieron cargar los excedentes disponibles.');
            } finally {
                setLoading(false);
            }
        };

        if (user?.region) {
            fetchExcedentes();
        }
    }, [user]);

    if (loading) return <div className="empty-state">Cargando excedentes disponibles...</div>;
    if (error) return <div className="notice notice-error">{error}</div>;

    return (
        <div className="page">
            <div className="page-hero">
                <div>
                    <h2 className="page-title">Feed de Excedentes</h2>
                    <p className="page-subtitle">Región {user?.region?.toUpperCase()} · recursos disponibles para tu organización.</p>
                </div>
            </div>

            <div className="grid-cards">
                {excedentes.length === 0 ? (
                    <div className="card empty-state">No hay excedentes disponibles en tu región en este momento.</div>
                ) : (
                    excedentes.map((exc) => (
                        <article key={exc.id} className="card card-hover">
                            <div style={{ padding: '1.25rem 1.25rem 0.9rem' }}>
                                <div className="toolbar" style={{ alignItems: 'flex-start' }}>
                                    <div>
                                        <h3 className="section-title" style={{ marginBottom: '0.35rem' }}>{exc.tipo_recurso}</h3>
                                        <p className="helper-text">Ubicación: {exc.ubicacion}</p>
                                    </div>
                                    <span className="status-badge status-disponible">{exc.cantidad} {exc.unidad}</span>
                                </div>
                            </div>

                            <div style={{ padding: '0 1.25rem 1rem' }}>
                                <p className="helper-text">Fecha límite: {new Date(exc.fecha_limite).toLocaleDateString()}</p>
                                <p className="helper-text" style={{ marginTop: '0.35rem' }}>
                                    Publicado: {new Date(exc.fecha_registro || new Date()).toLocaleDateString()}
                                </p>
                            </div>

                            <div style={{ padding: '0 1.25rem 1.25rem' }}>
                                <Link to={`/ong/reclamar/${exc.id}`} className="btn btn-info" style={{ width: '100%' }}>
                                    Reclamar
                                </Link>
                            </div>
                        </article>
                    ))
                )}
            </div>
        </div>
    );
};

export default OngFeed;
