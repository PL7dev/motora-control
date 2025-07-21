import { Link } from 'react-router-dom';
import BotaoVoltar from '../components/BotaoVoltar';

export default function ComoFunciona() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <BotaoVoltar />
      <h1 className="text-4xl font-bold text-blue-800 mb-4">Como Funciona o <span className="text-blue-600">Motora Control</span></h1>
      <p className="mb-4">
        O Motora Control é uma ferramenta criada para motoristas de aplicativo que desejam acompanhar seus resultados e tomar decisões baseadas em dados reais.
      </p>
      <ul className="list-disc list-inside space-y-2">
        <li>Registre corridas com valor, quilometragem e gasto de combustível.</li>
        <li>Veja gráficos de lucro, gastos e performance ao longo do tempo.</li>
        <li>Exporte relatórios em PDF e consulte históricos detalhados.</li>
        <li>Personalize metas, seu carro e preço médio de gasolina.</li>
      </ul>
    </div>
  );
}