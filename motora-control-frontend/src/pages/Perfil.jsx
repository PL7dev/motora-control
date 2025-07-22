/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import axios from 'axios';
import BotaoVoltar from '../components/BotaoVoltar';
import baseUrl from '../services/api';

export default function Perfil() {
  const [form, setForm] = useState({
    modeloCarro: '',
    kmPorLitro: '',
    metaLucroDiario: ''
  });

  const [loading, setLoading] = useState(true); // loading inicial
  const [submitting, setSubmitting] = useState(false); // loading do submit
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${baseUrl}/perfil`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setForm({
          modeloCarro: res.data.modeloCarro || '',
          kmPorLitro: res.data.kmPorLitro || '',
          metaLucroDiario: res.data.metaLucroDiario || ''
        });
      } catch (err) {
        setMensagem('Erro ao carregar perfil');
      } finally {
        setLoading(false);
      }
    };
    fetchPerfil();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMensagem('');
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/perfil', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMensagem('Perfil atualizado com sucesso!');

      setTimeout(() => {
        window.location.href = '/inicio';
      }, 2500);
    } catch (err) {
      setMensagem('Erro ao atualizar perfil');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Perfil do Usuário</h1>
      <BotaoVoltar />
      {mensagem && <p className="my-4 text-center text-blue-600">{mensagem}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label>
          Modelo do Carro:
          <input
            type="text"
            name="modeloCarro"
            value={form.modeloCarro}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </label>

        <label>
          Km por Litro:
          <input
            type="number"
            name="kmPorLitro"
            value={form.kmPorLitro}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </label>

        <label>
          Meta de Lucro Diário (R$):
          <input
            type="number"
            name="metaLucroDiario"
            value={form.metaLucroDiario}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </label>

        <button
          type="submit"
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
          disabled={submitting}
        >
          {submitting ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>
    </div>
  );
}
