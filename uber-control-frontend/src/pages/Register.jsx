import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BotaoVoltar from '../components/BotaoVoltar';
import Spinner from '../components/Spinner'; // ⬅️ Import do Spinner

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    modeloCarro: '',
    kmPorLitro: '',
    metaLucroDiario: ''
  });

  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false); // ⬅️ estado de loading

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true); // começa o loading
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', form);
      localStorage.setItem('token', res.data.token);
      navigate('/inicio');
    } catch (err) {
      setErro(err.response?.data?.msg || 'Erro ao cadastrar');
    } finally {
      setLoading(false); // encerra o loading
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-xl shadow-md">
      <BotaoVoltar />
      <h2 className="text-xl font-bold mb-4">Cadastro</h2>

      {erro && <p className="text-red-500 mb-2">{erro}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome" className="input" />
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" className="input" />
        <input name="senha" type="password" value={form.senha} onChange={handleChange} placeholder="Senha" className="input" />
        <input name="modeloCarro" value={form.modeloCarro} onChange={handleChange} placeholder="Modelo do carro" className="input" />
        <input name="kmPorLitro" value={form.kmPorLitro} onChange={handleChange} placeholder="Km por litro" className="input" />
        <input name="metaLucroDiario" value={form.metaLucroDiario} onChange={handleChange} placeholder="Meta de lucro diário" className="input" />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white ${
            loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? <Spinner /> : 'Cadastrar'}
        </button>
      </form>

      <p className="mt-4 text-center">
        Já tem uma conta?{' '}
        <a href="/login" className="text-blue-600 hover:underline">
          Faça login aqui
        </a>
      </p>
    </div>
  );
}
