import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', form);
      localStorage.setItem('token', res.data.token); // salva o token
      navigate('/dashboard'); // redireciona se sucesso
    } catch (err) {
      setErro(err.response?.data?.msg || 'Erro ao cadastrar');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Cadastro</h2>
      {erro && <p className="text-red-500">{erro}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome" className="input" />
        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" className="input" />
        <input name="senha" type="password" value={form.senha} onChange={handleChange} placeholder="Senha" className="input" />
        <input name="modeloCarro" value={form.modeloCarro} onChange={handleChange} placeholder="Modelo do carro" className="input" />
        <input name="kmPorLitro" value={form.kmPorLitro} onChange={handleChange} placeholder="Km por litro" className="input" />
        <input name="metaLucroDiario" value={form.metaLucroDiario} onChange={handleChange} placeholder="Meta de lucro diário" className="input" />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Cadastrar</button>
      </form>
    </div>
  );
}
