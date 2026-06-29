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
                empresaid: user?.empresa_id
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
        <div style={styles.container}>
            <div style={styles.card}>
                <h2>Publicar Nuevo Excedente</h2>
                <p>Completa los datos del recurso que deseas poner a disposición.</p>

                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label>Tipo de Recurso</label>
                        <select name="tipo_recurso" value={formData.tipo_recurso} onChange={handleChange} required style={styles.input}>
                            <option value="Alimentos">Alimentos</option>
                            <option value="Materiales">Materiales</option>
                            <option value="Ropa">Ropa</option>
                            <option value="Tecnologia">Tecnología</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ ...styles.inputGroup, flex: 1 }}>
                            <label>Cantidad</label>
                            <input
                                type="number"
                                name="cantidad"
                                min="0.1"
                                step="any"
                                value={formData.cantidad}
                                onChange={handleChange}
                                required
                                style={styles.input}
                            />
                        </div>
                        <div style={{ ...styles.inputGroup, flex: 1 }}>
                            <label>Unidad</label>
                            <select name="unidad" value={formData.unidad} onChange={handleChange} style={styles.input}>
                                <option value="kg">Kilogramos</option>
                                <option value="litros">Litros</option>
                                <option value="unidades">Unidades</option>
                            </select>
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <label>Fecha Límite</label>
                        <input
                            type="datetime-local"
                            name="fecha_limite"
                            value={formData.fecha_limite}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                        <small style={{ color: '#666' }}>Fecha en la que el recurso expira o dejará de estar disponible.</small>
                    </div>

                    <div style={styles.inputGroup}>
                        <label>Ubicación Específica</label>
                        <input
                            type="text"
                            name="ubicacion"
                            placeholder="Ej. Almacén Central, Zona A"
                            value={formData.ubicacion}
                            onChange={handleChange}
                            required
                            style={styles.input}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" onClick={() => navigate('/empresa/dashboard')} style={styles.cancelBtn}>
                            Cancelar
                        </button>
                        <button type="submit" disabled={loading} style={styles.submitBtn}>
                            {loading ? 'Publicando...' : 'Publicar Excedente'}
                        </button>
                    </div>
                </form>
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
    submitBtn: {
        flex: 1,
        padding: '0.75rem',
        backgroundColor: '#2e7d32',
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
    },
    error: {
        color: 'red',
        fontSize: '0.9rem',
        marginTop: '1rem',
        backgroundColor: '#ffebee',
        padding: '0.5rem',
        borderRadius: '4px',
    }
};

export default PublicarExcedente;
