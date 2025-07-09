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
