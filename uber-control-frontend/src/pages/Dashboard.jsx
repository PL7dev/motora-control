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

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    if (newFilter !== 'personalizado') {
      setDateRange({ start: '', end: '' });
    }
  };

  if (loading) return <p>Carregando dados...</p>;
  if (erro) return <p className="text-red-500">{erro}</p>;
  if (!dashboardData) return null;

  const { usuario, porDia, porSemana, porMes } = dashboardData;

  // Totais e médias
  const totalLucro = porMes?.reduce((acc, cur) => acc + cur.totalLucro, 0) || 0;
  const totalKm = porMes?.reduce((acc, cur) => acc + cur.totalKm, 0) || 0;
  // Para gasto combustível, preço do combustível pode vir do backend; aqui só exemplo
  const precoCombustivel = dashboardData.precoCombustivel || 5;
  const totalGastoCombustivel = totalKm / (usuario.kmPorLitro || 10) * precoCombustivel;
  const mediaLucro = porDia?.length
    ? porDia.reduce((acc, cur) => acc + cur.totalLucro, 0) / porDia.length
    : 0;
  const mediaKm = porDia?.length
    ? porDia.reduce((acc, cur) => acc + cur.totalKm, 0) / porDia.length
    : 0;
  const valorMedioKm = mediaKm > 0 ? mediaLucro / mediaKm : 0;

  // Checa se meta do lucro diário foi batida para o filtro atual (ex: hoje)
  // Por simplicidade, pega o lucro do primeiro dia em porDia e compara com meta
  const lucroDiaAtual = porDia?.[0]?.totalLucro || 0;
  const metaBatida = lucroDiaAtual >= (usuario.metaLucroDiario || 100);

  // Cores padronizadas (4 cores que se alternam)
  const cores = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-yellow-100 text-yellow-800',
    'bg-purple-100 text-purple-800',
  ];

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 flex items-center justify-between">
        Dashboard
        <div className="text-right text-base">
          <p><strong>Modelo do Carro:</strong> {usuario.modeloCarro || 'Não informado'}</p>
          <p><strong>Km por Litro:</strong> {(usuario.kmPorLitro || 10).toFixed(2)}</p>
        </div>
      </h1>
      <BotaoVoltar />

      {/* Filtros */}
      <div className="mb-6 flex flex-wrap gap-4">
        {['hoje', 'estaSemana', 'esteMes', 'personalizado'].map((filt) => (
          <button
            key={filt}
            className={`py-2 px-4 rounded ${filter === filt ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => handleFilterChange(filt)}
          >
            {filt === 'hoje' && 'Hoje'}
            {filt === 'estaSemana' && 'Esta Semana'}
            {filt === 'esteMes' && 'Este Mês'}
            {filt === 'personalizado' && 'Personalizado'}
          </button>
        ))}
      </div>

      {/* DatePickers */}
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

      {/* Cards principais */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-10">
        <div className={`p-4 rounded shadow ${cores[0]}`}>
          <h2 className="text-xl font-semibold mb-2 flex items-center justify-between">
            Lucro Total
            <span title={metaBatida ? 'Meta diária batida!' : 'Meta diária não batida!'}>
              {metaBatida ? <span className="text-green-600 text-2xl">✅</span> : <span className="text-red-600 text-2xl">❌</span>}
            </span>
          </h2>
          <p className="text-3xl font-bold">R$ {totalLucro.toFixed(2)}</p>
        </div>

        <div className={`p-4 rounded shadow ${cores[1]}`}>
          <h2 className="text-xl font-semibold mb-2">Quilometragem Total</h2>
          <p className="text-3xl font-bold">{totalKm.toFixed(2)} km</p>
        </div>

        <div className={`p-4 rounded shadow ${cores[2]}`}>
          <h2 className="text-xl font-semibold mb-2">Corridas Registradas</h2>
          <p className="text-3xl font-bold">{porDia.length}</p>
        </div>

        <div className={`p-4 rounded shadow ${cores[3]}`}>
          <h2 className="text-xl font-semibold mb-2">Gasto Total com Combustível</h2>
          <p className="text-3xl font-bold">R$ {totalGastoCombustivel.toFixed(2)}</p>
        </div>

        <div className={`p-4 rounded shadow ${cores[0]}`}>
          <h2 className="text-xl font-semibold mb-2">Média de Lucro</h2>
          <p className="text-3xl font-bold">R$ {mediaLucro.toFixed(2)}</p>
        </div>

        <div className={`p-4 rounded shadow ${cores[1]}`}>
          <h2 className="text-xl font-semibold mb-2">Média de Km</h2>
          <p className="text-3xl font-bold">{mediaKm.toFixed(2)} km</p>
        </div>

        <div className={`p-4 rounded shadow ${cores[2]}`}>
          <h2 className="text-xl font-semibold mb-2">Valor Médio por Km</h2>
          <p className="text-3xl font-bold">R$ {valorMedioKm.toFixed(2)}</p>
        </div>

        <div className={`p-4 rounded shadow ${cores[3]}`}>
          <h2 className="text-xl font-semibold mb-2">Meta Lucro Diário</h2>
          <p className="text-3xl font-bold">R$ {(usuario.metaLucroDiario || 100).toFixed(2)}</p>
        </div>
      </div>

      {/* Lucro por Dia */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Lucro por Dia</h2>
        {porDia.length === 0 ? (
          <p>Nenhum registro por dia.</p>
        ) : (
          <ul className="list-disc pl-5 max-h-48 overflow-auto">
            {porDia.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2">
                {`${item._id.dia}/${item._id.mes}/${item._id.ano} — R$${item.totalLucro.toFixed(2)} — Km: ${item.totalKm.toFixed(2)}`}
                {item.metaBateu !== undefined ? (
                  item.metaBateu ? (
                    <span className="text-green-600 font-bold ml-2">✔️</span>
                  ) : (
                    <span className="text-red-600 font-bold ml-2">❌</span>
                  )
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Lucro por Semana */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Lucro por Semana</h2>
        {porSemana.length === 0 ? (
          <p>Nenhum registro por semana.</p>
        ) : (
          <ul className="list-disc pl-5 max-h-48 overflow-auto">
            {porSemana.map((item, idx) => (
              <li key={idx}>
                {`Semana ${item._id.semana} de ${item._id.ano} — R$${item.totalLucro.toFixed(2)} — Km: ${item.totalKm.toFixed(2)}`}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Lucro por Mês */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Lucro por Mês</h2>
        {porMes.length === 0 ? (
          <p>Nenhum registro por mês.</p>
        ) : (
          <ul className="list-disc pl-5 max-h-48 overflow-auto">
            {porMes.map((item, idx) => (
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
