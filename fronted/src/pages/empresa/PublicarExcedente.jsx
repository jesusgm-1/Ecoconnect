import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { excedentesAPI } from '../../services/api';

const PublicarExcedente = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        tipo_recurso: 'Alimentos',
        cantidad: '',
        unidad: 'kg',
        fecha_limite: '',
        ubicacion: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Usuario actual:", user);
        console.log("empresa_id:", user?.empresa_id);
        setLoading(true);
        setError('');

        try {
            const payload = {
                ...formData,
                cantidad: parseFloat(formData.cantidad),
                estado: 'disponible',
                empresa_id: user?.empresa_id
            };

            const region = user?.region?.toLowerCase();
            if (!region) {
                throw new Error('No se pudo determinar la región del usuario autenticado');
            }

            await excedentesAPI.crear(region, payload);
            alert('Excedente publicado exitosamente');
            navigate('/empresa/dashboard');
        } catch (err) {
            console.error('Error al publicar:', err);
            setError(err.response?.data?.detail || 'Error al publicar el excedente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page">
            <div className="page-hero">
                <div>
                    <h2 className="page-title">Publicar Nuevo Excedente</h2>
                    <p className="page-subtitle">Completa los datos del recurso que deseas poner a disposición.</p>
                </div>
            </div>

            <section className="card form-card card-hover" style={{ width: 'min(100%, 640px)' }}>
                {error && <div className="notice notice-error" style={{ marginBottom: '1rem' }}>{error}</div>}

                <form onSubmit={handleSubmit} className="form-grid">
                    <div className="field">
                        <label>Tipo de Recurso</label>
                        <select name="tipo_recurso" value={formData.tipo_recurso} onChange={handleChange} required className="select">
                            <option value="Alimentos">Alimentos</option>
                            <option value="Materiales">Materiales</option>
                            <option value="Ropa">Ropa</option>
                            <option value="Tecnologia">Tecnología</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>

                    <div className="split-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }}>
                        <div className="field">
                            <label>Cantidad</label>
                            <input
                                type="number"
                                name="cantidad"
                                min="0.1"
                                step="any"
                                value={formData.cantidad}
                                onChange={handleChange}
                                required
                                className="input"
                            />
                        </div>
                        <div className="field">
                            <label>Unidad</label>
                            <select name="unidad" value={formData.unidad} onChange={handleChange} className="select">
                                <option value="kg">Kilogramos</option>
                                <option value="litros">Litros</option>
                                <option value="unidades">Unidades</option>
                            </select>
                        </div>
                    </div>

                    <div className="field">
                        <label>Fecha Límite</label>
                        <input
                            type="date"
                            name="fecha_limite"
                            value={formData.fecha_limite}
                            onChange={handleChange}
                            required
                            className="input"
                        />
                        <small className="helper-text">Solo se registra la fecha de vencimiento, sin hora.</small>
                    </div>

                    <div className="field">
                        <label>Ubicación Específica</label>
                        <input
                            type="text"
                            name="ubicacion"
                            placeholder="Ej. Almacén Central, Zona A"
                            value={formData.ubicacion}
                            onChange={handleChange}
                            required
                            className="input"
                        />
                    </div>

                    <div className="actions-row" style={{ marginTop: '0.5rem' }}>
                        <button type="button" onClick={() => navigate('/empresa/dashboard')} className="btn btn-ghost">
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading} className="btn btn-primary">
                            {loading ? 'Publicando...' : 'Publicar Excedente'}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
};

export default PublicarExcedente;
