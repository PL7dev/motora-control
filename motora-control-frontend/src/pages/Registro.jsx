import { useState } from 'react';
import axios from 'axios';
import BotaoVoltar from '../components/BotaoVoltar';
import Spinner from '../components/Spinner'; // ✅ Importa o componente

export default function Registro() {
  const [form, setForm] = useState({
    quilometragem: '',
    valorBruto: '',
    gastoCombustivel: '',
    valorCombustivelLitro: '',
  });

  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [loading, setLoading] = useState(false); // ✅ Estado para loading

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');
    setLoading(true); // ✅ Começa o loading

    try {
      const token = localStorage.getItem('token');

      await axios.post(
        'http://localhost:5000/api/registro',
        form,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setSucesso('Registro criado com sucesso!');
      setForm({
        quilometragem: '',
        valorBruto: '',
        gastoCombustivel: '',
        valorCombustivelLitro: '',
      });

      setTimeout(() => {
        window.location.href = '/inicio';  
      }, 2500);

    } catch (err) {
      setErro(err.response?.data?.msg || 'Erro ao criar registro');
    } finally {
      setLoading(false); // ✅ Encerra o loading mesmo se der erro
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-xl shadow-md">
      <BotaoVoltar destino="/inicio" />
      <h2 className="text-xl font-bold mb-4">Novo Registro de Corrida</h2>
      {erro && <p className="text-red-500">{erro}</p>}
      {sucesso && <p className="text-green-500">{sucesso}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          name="quilometragem"
          value={form.quilometragem}
          onChange={handleChange}
          placeholder="Quilometragem"
          className="input"
          required
        />
        <input
          type="number"
          name="valorBruto"
          value={form.valorBruto}
          onChange={handleChange}
          placeholder="Valor bruto"
          className="input"
          required
        />
        <input
          type="number"
          name="gastoCombustivel"
          value={form.gastoCombustivel}
          onChange={handleChange}
          placeholder="Gasto com combustível"
          className="input"
          required
          step={0.01}
          min={0}
        />
        <input
          type="number"
          name="valorCombustivelLitro"
          value={form.valorCombustivelLitro}
          onChange={handleChange}
          placeholder="Valor do combustível por litro"
          className="input"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex justify-center items-center"
        >
          {loading ? <Spinner /> : 'Salvar Registro'}
        </button>
      </form>
    </div>
  );
}