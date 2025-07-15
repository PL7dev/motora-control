import { Link } from 'react-router-dom';
import Lottie from "lottie-react";
import carAnimation from "../assets/car-animation.json";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-xl text-center">
        <div className="w-64 h-36 mx-auto mb-6">
          <Lottie animationData={carAnimation} loop={true} />
        </div>

        <h1 className="text-4xl font-bold text-blue-800 mb-4">
          Bem-vindo ao <span className="text-blue-600">Uber Control</span>
        </h1>

        <p className="text-gray-600 text-lg mb-6">
          Controle seus ganhos, gastos com combustível e metas diárias como motorista de app.
        </p>
        
        <div className="flex justify-center gap-4 mb-6">
          <Link to="/login" className="bg-blue-400 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
            Entrar
          </Link>
          <Link to="/register" className="border border-blue-600 text-blue-600 px-6 py-2 rounded hover:bg-blue-50 transition">
            Cadastrar
          </Link>
        </div>

        <div className="flex justify-center gap-4 text-sm text-gray-500">
          <Link to="/como-funciona" className="hover:underline">
            Como Funciona
          </Link>
          <a
            href="https://github.com/pl7dev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            GitHub do Desenvolvedor
          </a>
        </div>
      </div>
    </div>
  );
}