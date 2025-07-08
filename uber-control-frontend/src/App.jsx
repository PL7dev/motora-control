import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Registro from './pages/Registro';
import PrivateRoute from './components/PrivateRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />               
      <Route path="/login" element={<Login />} />         
      <Route path="/register" element={<Register />} />   

      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } 
      />

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
