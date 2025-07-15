/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import axios from 'axios';
import BotaoVoltar from '../components/BotaoVoltar';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function HistoricoDetalhado() {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const exportarPDF = () => {
  const doc = new jsPDF();

  const titulo = 'Histórico Detalhado';
  const intervalo = dateRange.start && dateRange.end
    ? `Período: ${new Date(dateRange.start).toLocaleDateString()} até ${new Date(dateRange.end).toLocaleDateString()}`
    : 'Todos os registros';

  doc.setFontSize(18);
  doc.text(titulo, 14, 20);
  doc.setFontSize(12);
  doc.text(intervalo, 14, 30);

  const colunas = [
    'Data',
    'Quilometragem',
    'Valor Bruto',
    'Gasto Combustível',
    'Lucro Líquido',
    'Lucro/Km',
    'Bruto/Km',
  ];

  const linhas = registros.map(reg => {
    const lucroPorKm = reg.quilometragem ? reg.lucroLiquido / reg.quilometragem : 0;
    const brutoPorKm = reg.quilometragem ? reg.valorBruto / reg.quilometragem : 0;
    return [
      new Date(reg.data).toLocaleDateString(),
      reg.quilometragem,
      `R$ ${reg.valorBruto.toFixed(2)}`,
      `R$ ${reg.gastoCombustivel.toFixed(2)}`,
      `R$ ${reg.lucroLiquido.toFixed(2)}`,
      `R$ ${lucroPorKm.toFixed(2)}`,
      `R$ ${brutoPorKm.toFixed(2)}`
    ];
  });

  // Totalizadores
  const somaKm = registros.reduce((acc, r) => acc + r.quilometragem, 0);
  const somaBruto = registros.reduce((acc, r) => acc + r.valorBruto, 0);
  const somaGasto = registros.reduce((acc, r) => acc + r.gastoCombustivel, 0);
  const somaLucro = registros.reduce((acc, r) => acc + r.lucroLiquido, 0);
  const mediaLucroKm = somaKm > 0 ? somaLucro / somaKm : 0;
  const mediaBrutoKm = somaKm > 0 ? somaBruto / somaKm : 0;

  const linhaTotal = [
    'TOTAL',
    somaKm,
    `R$ ${somaBruto.toFixed(2)}`,
    `R$ ${somaGasto.toFixed(2)}`,
    `R$ ${somaLucro.toFixed(2)}`,
    `R$ ${mediaLucroKm.toFixed(2)}`,
    `R$ ${mediaBrutoKm.toFixed(2)}`
  ];

  autoTable(doc, {
    startY: 40,
    head: [colunas],
    body: [...linhas, linhaTotal],
    styles: { fontSize: 10 },
    headStyles: { fillColor: [33, 150, 243] },
  });

  doc.save('historico_detalhado.pdf');
  };


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

	// Cálculo dos totais
	const totalizadores = registros.reduce(
	  (acc, curr) => {
	    acc.valorBruto += curr.valorBruto || 0;
	    acc.gastoCombustivel += curr.gastoCombustivel || 0;
	    acc.lucroLiquido += curr.lucroLiquido || 0;
	    acc.quilometragem += curr.quilometragem || 0;
	    return acc;
	  },
	  { valorBruto: 0, gastoCombustivel: 0, lucroLiquido: 0, quilometragem: 0 }
	);

	const [sortColumn, setSortColumn] = useState(null); // ex: 'valorBruto'
	const [sortDirection, setSortDirection] = useState('asc'); // 'asc' ou 'desc'

// Função de ordenação
	const ordenarRegistros = () => {
	  if (!sortColumn) return registros;

	  return [...registros].sort((a, b) => {
	    let valA = a[sortColumn];
	    let valB = b[sortColumn];

	    if (sortColumn === 'lucroPorKm') {
	      valA = a.quilometragem > 0 ? a.lucroLiquido / a.quilometragem : 0;
	      valB = b.quilometragem > 0 ? b.lucroLiquido / b.quilometragem : 0;
	    }

	    if (sortColumn === 'brutoPorKm') {
	      valA = a.quilometragem > 0 ? a.valorBruto / a.quilometragem : 0;
	      valB = b.quilometragem > 0 ? b.valorBruto / b.quilometragem : 0;
	    }

	    if (typeof valA === 'string') {
	      return sortDirection === 'asc'
	        ? valA.localeCompare(valB)
	        : valB.localeCompare(valA);
	    }

	    return sortDirection === 'asc' ? valA - valB : valB - valA;
	  });
	};

	const registrosOrdenados = ordenarRegistros();

	const toggleSort = (coluna) => {
	  if (sortColumn === coluna) {
	    setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
	  } else {
	    setSortColumn(coluna);
	    setSortDirection('asc');
	  }
	};


	return (
	  <div className="max-w-6xl mx-auto p-6">
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
	        <table className="w-full border-collapse mb-6 text-sm sm:text-base">
	          <thead>
	            <tr>
	              <th className="border p-2 cursor-pointer" onClick={() => toggleSort('data')}>
  								Data {sortColumn === 'data' && (sortDirection === 'asc' ? '↑' : '↓')}
								</th>
								<th className="border p-2 cursor-pointer" onClick={() => toggleSort('quilometragem')}>
								  Quilometragem {sortColumn === 'quilometragem' && (sortDirection === 'asc' ? '↑' : '↓')}
								</th>
								<th className="border p-2 cursor-pointer" onClick={() => toggleSort('valorBruto')}>
								  Valor Bruto {sortColumn === 'valorBruto' && (sortDirection === 'asc' ? '↑' : '↓')}
								</th>
								<th className="border p-2 cursor-pointer" onClick={() => toggleSort('gastoCombustivel')}>
								  Gasto Combustível {sortColumn === 'gastoCombustivel' && (sortDirection === 'asc' ? '↑' : '↓')}
								</th>
								<th className="border p-2 cursor-pointer" onClick={() => toggleSort('lucroLiquido')}>
								  Lucro Líquido {sortColumn === 'lucroLiquido' && (sortDirection === 'asc' ? '↑' : '↓')}
								</th>
								<th className="border p-2 cursor-pointer" onClick={() => toggleSort('lucroPorKm')}>
								  Lucro / Km {sortColumn === 'lucroPorKm' && (sortDirection === 'asc' ? '↑' : '↓')}
								</th>
								<th className="border p-2 cursor-pointer" onClick={() => toggleSort('brutoPorKm')}>
								  Bruto / Km {sortColumn === 'brutoPorKm' && (sortDirection === 'asc' ? '↑' : '↓')}
								</th>
	            </tr>
	          </thead>
	          <tbody>
	            {registros.length === 0 ? (
	              <tr><td colSpan="7" className="text-center p-4">Nenhum registro encontrado.</td></tr>
	            ) : (
	              <>
	                {registrosOrdenados.map(reg => {
  									const lucroPorKm = reg.quilometragem > 0 ? reg.lucroLiquido / reg.quilometragem : 0;
  									const brutoPorKm = reg.quilometragem > 0 ? reg.valorBruto / reg.quilometragem : 0;
  									return (
	                    <tr key={reg._id}>
	                      <td className="border p-2">{new Date(reg.data).toLocaleDateString()}</td>
	                      <td className="border p-2">{reg.quilometragem}</td>
	                      <td className="border p-2">R$ {reg.valorBruto.toFixed(2)}</td>
	                      <td className="border p-2">R$ {reg.gastoCombustivel.toFixed(2)}</td>
	                      <td className="border p-2">R$ {reg.lucroLiquido.toFixed(2)}</td>
	                      <td className="border p-2">R$ {lucroPorKm.toFixed(2)}</td>
	                      <td className="border p-2">R$ {brutoPorKm.toFixed(2)}</td>
	                    </tr>
	                  );
	                })}
	                {/* Linha de totalizadores */}
	                <tr className="bg-gray-100 font-semibold text-black">
	                  <td className="border p-2">Totais:</td>
	                  <td className="border p-2">{totalizadores.quilometragem.toFixed(2)} km</td>
	                  <td className="border p-2">R$ {totalizadores.valorBruto.toFixed(2)}</td>
	                  <td className="border p-2">R$ {totalizadores.gastoCombustivel.toFixed(2)}</td>
	                  <td className="border p-2">R$ {totalizadores.lucroLiquido.toFixed(2)}</td>
	                  <td className="border p-2">
	                    R$ {totalizadores.quilometragem > 0
	                      ? (totalizadores.lucroLiquido / totalizadores.quilometragem).toFixed(2)
	                      : '0.00'}
	                  </td>
	                  <td className="border p-2">
	                    R$ {totalizadores.quilometragem > 0
	                      ? (totalizadores.valorBruto / totalizadores.quilometragem).toFixed(2)
	                      : '0.00'}
	                  </td>
	                </tr>
	              </>
	            )}
	          </tbody>
	        </table>

		<button
  			onClick={exportarPDF}
  			className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
		> Exportar como PDF
		</button>


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