import { useNavigate } from 'react-router-dom';

export default function BotaoVoltar({ destino = -1 }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(destino)}
      className="text-sm text-blue-600 hover:underline mb-4 inline-block"
    >
      ← Voltar
    </button>
  );
}
