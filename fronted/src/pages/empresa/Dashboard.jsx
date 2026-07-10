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
        <div className="page">
            <div className="page-hero">
                <div>
                    <h2 className="page-title">Dashboard de Empresa</h2>
                    <p className="page-subtitle">
                        Región actual: <strong>{user?.region?.toUpperCase()}</strong> · administra tus publicaciones y confirma entregas.
                    </p>
                </div>
                <Link to="/empresa/publicar" className="btn btn-primary">
                    + Nuevo Excedente
                </Link>
            </div>

            <section className="card section-card card-hover">
                <div className="toolbar" style={{ marginBottom: '1rem' }}>
                    <h3 className="section-title" style={{ marginBottom: 0 }}>Mis Excedentes Publicados</h3>
                </div>

                {excedentes.length === 0 ? (
                    <div className="empty-state">No has publicado ningún excedente aún.</div>
                ) : restantes.length === 0 ? (
                    <div className="empty-state">No tienes excedentes disponibles para mostrar en esta sección.</div>
                ) : (
                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tipo</th>
                                    <th>Cantidad</th>
                                    <th>Estado</th>
                                    <th>Fecha Límite</th>
                                </tr>
                            </thead>
                            <tbody>
                                {restantes.map((exc) => (
                                    <tr key={exc.id}>
                                        <td>{exc.id}</td>
                                        <td>{exc.tipo_recurso}</td>
                                        <td>{exc.cantidad} {exc.unidad}</td>
                                        <td>
                                            <span className={`status-badge status-${exc.estado}`}>
                                                {exc.estado}
                                            </span>
                                        </td>
                                        <td>{new Date(exc.fecha_limite).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <section className="card section-card card-hover">
                <h3 className="section-title">Excedentes Bloqueados</h3>

                {bloqueados.length === 0 ? (
                    <div className="empty-state">No tienes excedentes bloqueados pendientes de confirmación.</div>
                ) : (
                    <div className="table-wrap">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tipo</th>
                                    <th>Cantidad</th>
                                    <th>Estado</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bloqueados.map((exc) => (
                                    <tr key={exc.id}>
                                        <td>{exc.id}</td>
                                        <td>{exc.tipo_recurso}</td>
                                        <td>{exc.cantidad} {exc.unidad}</td>
                                        <td>
                                            <span className={`status-badge status-${exc.estado}`}>
                                                {exc.estado}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                className="btn btn-info"
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
                    </div>
                )}
            </section>
        </div>
    );
};

export default EmpresaDashboard;
