/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import axios from 'axios';
import BotaoVoltar from '../components/BotaoVoltar';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [filter, setFilter] = useState('hoje'); // opções: hoje, estaSemana, esteMes, personalizado
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const buildQueryParams = () => {
    const params = new URLSearchParams();
    params.append('filter', filter);
    if (filter === 'personalizado' && dateRange.start && dateRange.end) {
      params.append('start', dateRange.start);
      params.append('end', dateRange.end);
    }
    return params.toString();
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setErro('');
      const token = localStorage.getItem('token');
      if (!token) {
        setErro('Usuário não autenticado');
        setLoading(false);
        return;
      }

      try {
        const query = buildQueryParams();
        const res = await axios.get(`http://localhost:5000/api/registro/dashboard?${query}`, {
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
  }, [filter, dateRange]);

  // Função para mudar filtro simples
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    // Reset range se não for personalizado
    if (newFilter !== 'personalizado') {
      setDateRange({ start: '', end: '' });
    }
  };

  // Totais (exemplo de cálculo simples)
  const totalLucroMes = dashboardData?.porMes?.reduce((acc, cur) => acc + cur.totalLucro, 0) || 0;
  const totalKmMes = dashboardData?.porMes?.reduce((acc, cur) => acc + cur.totalKm, 0) || 0;

  if (loading) return <p>Carregando dados...</p>;
  if (erro) return <p className="text-red-500">{erro}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <BotaoVoltar />

      {/* Filtros */}
      <div className="mb-6 flex flex-wrap gap-4">
        <button
          className={`py-2 px-4 rounded ${filter === 'hoje' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => handleFilterChange('hoje')}
        >
          Hoje
        </button>
        <button
          className={`py-2 px-4 rounded ${filter === 'estaSemana' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => handleFilterChange('estaSemana')}
        >
          Esta Semana
        </button>
        <button
          className={`py-2 px-4 rounded ${filter === 'esteMes' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => handleFilterChange('esteMes')}
        >
          Este Mês
        </button>
        <button
          className={`py-2 px-4 rounded ${filter === 'personalizado' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          onClick={() => handleFilterChange('personalizado')}
        >
          Personalizado
        </button>
      </div>

      {/* DatePickers só se personalizado */}
      {filter === 'personalizado' && (
        <div className="mb-6 flex gap-4 items-center">
          <label>
            De:{' '}
            <input
              type="date"
              value={dateRange.start}
              onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="border rounded p-1"
            />
          </label>
          <label>
            Até:{' '}
            <input
              type="date"
              value={dateRange.end}
              onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="border rounded p-1"
            />
          </label>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="p-4 bg-blue-100 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Lucro Total (Mês)</h2>
          <p className="text-2xl font-bold text-green-600">R$ {totalLucroMes.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-yellow-100 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Quilometragem Total (Mês)</h2>
          <p className="text-2xl font-bold text-yellow-700">{totalKmMes.toFixed(2)} km</p>
        </div>
        <div className="p-4 bg-gray-100 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Corridas Registradas</h2>
          <p className="text-2xl font-bold">{dashboardData.porDia.length}</p>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Lucro por Dia</h2>
        {dashboardData.porDia.length === 0 ? (
          <p>Nenhum registro por dia.</p>
        ) : (
          <ul className="list-disc pl-5 max-h-48 overflow-auto">
            {dashboardData.porDia.map((item, idx) => (
              <li key={idx}>
                {`${item._id.dia}/${item._id.mes}/${item._id.ano} — R$${item.totalLucro.toFixed(2)} — Km: ${item.totalKm.toFixed(2)}`}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Lucro por Semana</h2>
        {dashboardData.porSemana.length === 0 ? (
          <p>Nenhum registro por semana.</p>
        ) : (
          <ul className="list-disc pl-5 max-h-48 overflow-auto">
            {dashboardData.porSemana.map((item, idx) => (
              <li key={idx}>
                {`Semana ${item._id.semana} de ${item._id.ano} — R$${item.totalLucro.toFixed(2)} — Km: ${item.totalKm.toFixed(2)}`}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Lucro por Mês</h2>
        {dashboardData.porMes.length === 0 ? (
          <p>Nenhum registro por mês.</p>
        ) : (
          <ul className="list-disc pl-5 max-h-48 overflow-auto">
            {dashboardData.porMes.map((item, idx) => (
              <li key={idx}>
                {`${item._id.mes}/${item._id.ano} — R$${item.totalLucro.toFixed(2)} — Km: ${item.totalKm.toFixed(2)}`}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
