// import { useNavigate } from 'react-router-dom';

// export default function Inicio() {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     navigate('/login');
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-6">Bem-vindo ao Uber Control</h1>
//       <p className="mb-4">
//         Aqui você pode acompanhar seus dados resumidos e acessar rapidamente seu dashboard.
//       </p>

//       <div className="flex gap-4">
//         <button
//           className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
//           onClick={() => navigate('/dashboard')}
//         >
//           Ir para Dashboard
//         </button>

//         <button
//           className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
//           onClick={handleLogout}
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// }

import WelcomeHeader from '../components/WelcomeHeader';
import QuickActions from '../components/QuickActions';
import ResumoRapido from '../components/ResumoRapido';

export default function Inicio() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <WelcomeHeader />
      <QuickActions />
      <ResumoRapido />
    </div>
  );
}
