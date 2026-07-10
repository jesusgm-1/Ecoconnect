import { useState, useEffect } from "react";
import { useAuth } from "../../context/useAuth";
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
        const region = user?.region?.toLowerCase();
        if (!region) {
          throw new Error(
            "No se pudo determinar la región del usuario autenticado",
          );
        }

        const [allData, transferenciasData] = await Promise.all([
          excedentesAPI.todos(region),
          excedentesAPI.transferencias(region),
        ]);
        const items = Array.isArray(allData) ? allData : [];
        const transferencias = Array.isArray(transferenciasData)
          ? transferenciasData
          : [];

        const kgSalvados = transferencias.reduce(
          (acc, curr) => acc + (Number(curr.kg_transferidos) || 0),
          0,
        );

        const estadosCount = items.reduce((acc, curr) => {
          acc[curr.estado] = (acc[curr.estado] || 0) + 1;
          return acc;
        }, {});
        const estadoData = Object.keys(estadosCount).map((k) => ({
          name: k,
          value: estadosCount[k],
        }));

        const tipoCount = items.reduce((acc, curr) => {
          acc[curr.tipo_recurso] = (acc[curr.tipo_recurso] || 0) + 1;
          return acc;
        }, {});
        const tipoData = Object.keys(tipoCount).map((k) => ({
          name: k,
          count: tipoCount[k],
        }));

        setStats({
          totalKg: kgSalvados,
          totalExcedentes: items.length,
          estadoData,
          tipoData,
        });
      } catch (err) {
        console.error("Error obteniendo métricas", err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.region) {
      fetchMetrics();
    }
  }, [user]);

  if (loading) return <div>Generando métricas del sistema...</div>;

  return (
    <div className="page">
      <div className="page-hero">
        <div>
          <h2 className="page-title">Panel de Administrador - {user?.region?.toUpperCase()}</h2>
          <p className="page-subtitle">Métricas en tiempo real sobre la economía circular en tu nodo regional.</p>
        </div>
      </div>

      <div className="kpi-grid">
        <div className="card kpi-card card-hover">
          <p className="kpi-title">Excedentes Registrados</p>
          <p className="kpi-value">{stats.totalExcedentes}</p>
        </div>
        <div className="card kpi-card card-hover">
          <p className="kpi-title">Kg Salvados (Transferidos)</p>
          <p className="kpi-value" style={{ color: '#2e7d32' }}>
            {stats.totalKg.toFixed(2)} KG
          </p>
        </div>
      </div>

      <div className="split-grid">
        <div className="card chart-box card-hover">
          <h3 className="section-title">Publicaciones por Tipo</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={stats.tipoData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#2e7d32" name="Cantidad" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card chart-box card-hover">
          <h3 className="section-title">Estado Actual de Excedentes</h3>
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

export default AdminDashboard;
