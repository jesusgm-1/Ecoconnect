import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { excedentesAPI } from "../../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalKg: 0,
    totalExcedentes: 0,
    estadoData: [],
    tipoData: [],
  });
  const [loading, setLoading] = useState(true);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // El admin también trae data de su nodo (o de todos si la API lo permite)
        // Por ahora usamos el endpoint listar normal y agrupamos data en el frontend.
        const allData = await excedentesAPI.listar(user.region);

        // Métrica 1: Kilos totales salvados (asumiremos que todo es KG para la demo o filtramos por unidad='kg')
        const transferidos = allData.filter((e) => e.estado === "transferido");
        const kgSalvados = transferidos.reduce(
          (acc, curr) => acc + (curr.unidad === "kg" ? curr.cantidad : 0),
          0,
        );

        // Métrica 2: Cantidad por estado
        const estadosCount = allData.reduce((acc, curr) => {
          acc[curr.estado] = (acc[curr.estado] || 0) + 1;
          return acc;
        }, {});
        const estadoData = Object.keys(estadosCount).map((k) => ({
          name: k,
          value: estadosCount[k],
        }));

        // Métrica 3: Cantidad por Tipo
        const tipoCount = allData.reduce((acc, curr) => {
          acc[curr.tipo_recurso] = (acc[curr.tipo_recurso] || 0) + 1;
          return acc;
        }, {});
        const tipoData = Object.keys(tipoCount).map((k) => ({
          name: k,
          count: tipoCount[k],
        }));

        setStats({
          totalKg: kgSalvados,
          totalExcedentes: allData.length,
          estadoData,
          tipoData,
        });
      } catch (err) {
        console.error("Error obteniendo métricas", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchMetrics();
  }, [user]);

  if (loading) return <div>Generando métricas del sistema...</div>;

  return (
    <div>
      <h2>Panel de Administrador - {user.region.toUpperCase()}</h2>
      <p>
        Métricas en tiempo real sobre la economía circular en tu nodo regional.
      </p>

      <div style={styles.kpiContainer}>
        <div style={styles.kpiCard}>
          <h3>Excedentes Publicados</h3>
          <p style={styles.kpiValue}>{stats.totalExcedentes}</p>
        </div>
        <div style={styles.kpiCard}>
          <h3>Kg Salvados (Transferidos)</h3>
          <p style={{ ...styles.kpiValue, color: "#4caf50" }}>
            {stats.totalKg.toFixed(2)} KG
          </p>
        </div>
      </div>

      <div style={styles.chartsContainer}>
        {/* Gráfico de Barras: Tipos de Recursos */}
        <div style={styles.chartBox}>
          <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>
            Publicaciones por Tipo
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={stats.tipoData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" name="Cantidad" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico Circular: Estados de Excedentes */}
        <div style={styles.chartBox}>
          <h3 style={{ textAlign: "center", marginBottom: "1rem" }}>
            Estado Actual de Excedentes
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.estadoData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(0)}%)`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {stats.estadoData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const styles = {
  kpiContainer: {
    display: "flex",
    gap: "2rem",
    marginTop: "2rem",
    marginBottom: "2rem",
  },
  kpiCard: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    flex: 1,
    textAlign: "center",
  },
  kpiValue: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginTop: "1rem",
    color: "#333",
  },
  chartsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))",
    gap: "2rem",
  },
  chartBox: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
};

export default AdminDashboard;
