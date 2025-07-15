import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Inicio from './pages/Inicio';
import Dashboard from './pages/Dashboard';
import HistoricoDetalhado from './pages/HistoricoDetalhado';
import Registro from './pages/Registro';
import PrivateRoute from './components/PrivateRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />               
      <Route path="/login" element={<Login />} />         
      <Route path="/register" element={<Register />} />   

      <Route 
        path="/inicio" 
        element={
          <PrivateRoute>
            <Inicio />
          </PrivateRoute>
        } 
      />

      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } 
      />

      <Route path="/historico" element={<HistoricoDetalhado />} />

      <Route 
        path="/registro" 
        element={
          <PrivateRoute>
            <Registro />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
}
