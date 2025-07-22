import { useEffect, useState } from 'react';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_API_URL

export default function ResumoRapido() {
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buscarResumo = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${baseUrl}/registro/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const { porDia, porMes } = res.data;

        const totalCorridas = porDia.length;
        const lucroTotal = porMes.reduce((acc, mes) => acc + mes.totalLucro, 0);
        const totalKm = porMes.reduce((acc, mes) => acc + mes.totalKm, 0);
        const mediaLucroKm = totalKm > 0 ? (lucroTotal / totalKm).toFixed(2) : 0;

        setDados({ totalCorridas, lucroTotal, totalKm, mediaLucroKm });
      } catch (err) {
        setErro(err.response?.data?.msg || 'Erro ao buscar resumo');
      } finally {
        setLoading(false);
      }
    };

    buscarResumo();
  }, []);

  if (loading) return <p>Carregando resumo...</p>;
  if (erro) return <p className="text-red-500">{erro}</p>;

  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      <ResumoCard titulo="Dias registrado" valor={dados.totalCorridas} />
      <ResumoCard titulo="Lucro Total" valor={`R$ ${dados.lucroTotal.toFixed(2)}`} />
      <ResumoCard titulo="Total KM" valor={`${dados.totalKm.toFixed(2)} km`} />
      <ResumoCard titulo="Média R$/km" valor={`R$ ${dados.mediaLucroKm}`} />
    </div>
  );
}

function ResumoCard({ titulo, valor }) {
  return (
    <div className="bg-white shadow rounded p-4 text-center">
      <h3 className="text-sm text-gray-500">{titulo}</h3>
      <p className="text-xl font-bold text-gray-800">{valor}</p>
    </div>
  );
}
