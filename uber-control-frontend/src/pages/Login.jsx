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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      navigate('/inicio');
    } catch (err) {
      setErro(err.response?.data?.msg || 'Erro ao fazer login');
    } finally {
      setLoading(false);
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
          className="input w-full p-2 border rounded"
          required
        />
        <input
          name="senha"
          type="password"
          value={form.senha}
          onChange={handleChange}
          placeholder="Senha"
          className="input w-full p-2 border rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 flex justify-center items-center"
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            'Entrar'
          )}
        </button>
      </form>

      <a href="/esqueci-senha" className="text-center text-blue-600 hover:underline block mt-4">
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
