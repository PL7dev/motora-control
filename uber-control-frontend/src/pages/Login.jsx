import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BotaoVoltar from '../components/BotaoVoltar';

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    senha: '',
  });

  const [erro, setErro] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', res.data.token); // salva token no localStorage
      navigate('/inicio'); // redireciona para início após login
    } catch (err) {
      setErro(err.response?.data?.msg || 'Erro ao fazer login');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-xl shadow-md">
      <BotaoVoltar />
      <h2 className="text-xl font-bold mb-4">Login</h2>
      {erro && <p className="text-red-500">{erro}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Entrar
        </button>
      </form>
      <a href="/esqueci-senha" className="text-center text-blue-600 hover:underline">
        Esqueci minha senha
      </a>
      <p className="mt-4 text-center">
        Não tem uma conta?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Cadastre-se aqui
          </a>
      </p>
    </div>
  );
}
