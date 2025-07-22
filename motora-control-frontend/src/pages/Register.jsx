import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BotaoVoltar from '../components/BotaoVoltar';
import Spinner from '../components/Spinner';
import baseUrl from '../services/api';

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    modeloCarro: '',
    kmPorLitro: '',
    metaLucroDiario: '',
  });

  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      const res = await axios.post(`${baseUrl}/auth/register`, form);
      localStorage.setItem('token', res.data.token);
      navigate('/inicio');
    } catch (err) {
      setErro(err.response?.data?.msg || 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-xl shadow-md">
      <BotaoVoltar />
      <h2 className="text-xl font-bold mb-4">Cadastro</h2>
      {erro && <p className="text-red-500">{erro}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="nome"
          value={form.nome}
          onChange={handleChange}
          placeholder="Nome"
          className="input"
          required
        />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="input"
          required
        />
        <input
          name="senha"
          type="password"
          value={form.senha}
          onChange={handleChange}
          placeholder="Senha"
          className="input"
          required
        />
        <input
          name="modeloCarro"
          value={form.modeloCarro}
          onChange={handleChange}
          placeholder="Modelo do carro"
          className="input"
        />
        <input
          name="kmPorLitro"
          value={form.kmPorLitro}
          onChange={handleChange}
          placeholder="Km por litro"
          className="input"
          type="number"
          step="0.01"
          min="0"
        />
        <input
          name="metaLucroDiario"
          value={form.metaLucroDiario}
          onChange={handleChange}
          placeholder="Meta de lucro diário"
          className="input"
          type="number"
          step="0.01"
          min="0"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex justify-center items-center"
        >
          {loading ? <Spinner size={5} color="white" /> : 'Cadastrar'}
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
