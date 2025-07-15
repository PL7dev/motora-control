/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import axios from 'axios';
import BotaoVoltar from '../components/BotaoVoltar';

export default function HistoricoDetalhado() {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const fetchRegistros = async () => {
    setLoading(true);
    setErro('');
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Usuário não autenticado');
      
      const params = new URLSearchParams();
      params.append('page', page);
      if (dateRange.start) params.append('start', dateRange.start);
      if (dateRange.end) params.append('end', dateRange.end);

      const res = await axios.get(`http://localhost:5000/api/registro/historico?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRegistros(res.data.registros);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      setErro(err.response?.data?.msg || err.message || 'Erro ao carregar registros');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistros();
  }, [page, dateRange]);

  const handleDateChange = (field, value) => {
    setDateRange(prev => ({ ...prev, [field]: value }));
    setPage(1); // resetar página ao mudar filtro
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Histórico Detalhado</h1>
      <BotaoVoltar />    
      <div className="mb-6 flex gap-4">
        <label>
          De: <input type="date" value={dateRange.start} onChange={e => handleDateChange('start', e.target.value)} className="border rounded p-1" />
        </label>
        <label>
          Até: <input type="date" value={dateRange.end} onChange={e => handleDateChange('end', e.target.value)} className="border rounded p-1" />
        </label>
      </div>

      {loading && <p>Carregando registros...</p>}
      {erro && <p className="text-red-500">{erro}</p>}

      {!loading && !erro && (
        <>
          <table className="w-full border-collapse mb-6">
            <thead>
              <tr>
                <th className="border p-2">Data</th>
                <th className="border p-2">Quilometragem</th>
                <th className="border p-2">Valor Bruto</th>
                <th className="border p-2">Gasto Combustível</th>
                <th className="border p-2">Lucro Líquido</th>
              </tr>
            </thead>
            <tbody>
              {registros.length === 0 ? (
                <tr><td colSpan="5" className="text-center p-4">Nenhum registro encontrado.</td></tr>
              ) : (
                registros.map(reg => (
                  <tr key={reg._id}>
                    <td className="border p-2">{new Date(reg.data).toLocaleDateString()}</td>
                    <td className="border p-2">{reg.quilometragem}</td>
                    <td className="border p-2">R$ {reg.valorBruto.toFixed(2)}</td>
                    <td className="border p-2">R$ {reg.gastoCombustivel.toFixed(2)}</td>
                    <td className="border p-2">R$ {reg.lucroLiquido.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="flex justify-between">
            <button disabled={page <= 1} onClick={() => setPage(p => Math.max(p - 1, 1))} className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">Anterior</button>
            <span>Página {page} de {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(p => Math.min(p + 1, totalPages))} className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50">Próximo</button>
          </div>
        </>
      )}
    </div>
  );
}