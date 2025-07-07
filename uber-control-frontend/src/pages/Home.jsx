import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Bem-vindo ao Uber Control</h1>
      <nav>
        <Link to="/login" className="mr-4 text-blue-600 hover:underline">
          Login
        </Link>
        <Link to="/register" className="text-blue-600 hover:underline">
          Cadastrar
        </Link>
      </nav>
    </div>
  );
}
