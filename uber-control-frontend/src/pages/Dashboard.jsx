import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setErro('Usuário não autenticado');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('http://localhost:5000/api/registro/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDashboardData(res.data);
      } catch (err) {
        setErro(err.response?.data?.msg || 'Erro ao carregar dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <p>Carregando dados...</p>;
  if (erro) return <p className="text-red-500">{erro}</p>;

  return (
    <><div className="max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div><section className="mb-6">
        <h2 className="font-semibold text-lg mb-2">Lucro por Dia</h2>
        {dashboardData.porDia.length === 0 ? (
          <p>Nenhum registro por dia.</p>
        ) : (
          <ul>
            {dashboardData.porDia.map((item, idx) => (
              <li key={idx}>
                {`${item._id.dia}/${item._id.mes}/${item._id.ano} — Lucro: R$${item.totalLucro.toFixed(2)} — Km: ${item.totalKm.toFixed(2)}`}
              </li>
            ))}
          </ul>
        )}
      </section><section className="mb-6">
        <h2 className="font-semibold text-lg mb-2">Lucro por Semana</h2>
        {dashboardData.porSemana.length === 0 ? (
          <p>Nenhum registro por semana.</p>
        ) : (
          <ul>
            {dashboardData.porSemana.map((item, idx) => (
              <li key={idx}>
                {`Semana ${item._id.semana} de ${item._id.ano} — Lucro: R$${item.totalLucro.toFixed(2)} — Km: ${item.totalKm.toFixed(2)}`}
              </li>
            ))}
          </ul>
        )}
      </section><section>
        <h2 className="font-semibold text-lg mb-2">Lucro por Mês</h2>
        {dashboardData.porMes.length === 0 ? (
          <p>Nenhum registro por mês.</p>
        ) : (
          <ul>
            {dashboardData.porMes.map((item, idx) => (
              <li key={idx}>
                {`${item._id.mes}/${item._id.ano} — Lucro: R$${item.totalLucro.toFixed(2)} — Km: ${item.totalKm.toFixed(2)}`}
              </li>
            ))}
          </ul>
        )}
      </section></>
  );
}