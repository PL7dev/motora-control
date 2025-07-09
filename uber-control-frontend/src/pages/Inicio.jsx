export default function Inicio() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Bem-vindo ao Uber Control</h1>
      <p className="mb-4">Aqui você pode acompanhar seus dados resumidos e acessar rapidamente seu dashboard.</p>
      <button
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        onClick={() => window.location.href = '/dashboard'}
      >
        Ir para Dashboard
      </button>
    </div>
  );
}
