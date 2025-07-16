import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ResetarSenha() {
  const { token } = useParams();
  const [novaSenha, setNovaSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setMensagem('');

    try {
      const res = await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { novaSenha });
      setMensagem(res.data.msg);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setErro(err.response?.data?.msg || 'Erro ao redefinir senha.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Redefinir Senha</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="Nova senha"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Redefinir Senha
        </button>
      </form>
      {mensagem && <p className="text-green-600 mt-4">{mensagem}</p>}
      {erro && <p className="text-red-600 mt-4">{erro}</p>}
    </div>
  );
}
