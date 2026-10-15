import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './lib/auth';
import { ToastProvider } from './lib/toast';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Planes from './pages/Planes';
import Registro from './pages/Registro';
import Servicios from './pages/Servicios';
import GestionCitas from './pages/admin/GestionCitas';
import GestionPlanes from './pages/admin/GestionPlanes';
import GestionServicios from './pages/admin/GestionServicios';
import GestionSuscripciones from './pages/admin/GestionSuscripciones';
import GestionUsuarios from './pages/admin/GestionUsuarios';
import Panel from './pages/admin/Panel';
import MiPerfil from './pages/cliente/MiPerfil';
import MisCitas from './pages/cliente/MisCitas';
import MisSuscripciones from './pages/cliente/MisSuscripciones';

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            {/* Públicas */}
            <Route index element={<Landing />} />
            <Route path="servicios" element={<Servicios />} />
            <Route path="planes" element={<Planes />} />
            <Route path="login" element={<Login />} />
            <Route path="registro" element={<Registro />} />

            {/* Cualquier usuario autenticado */}
            <Route element={<ProtectedRoute />}>
              <Route path="app/perfil" element={<MiPerfil />} />
            </Route>

            {/* Cliente */}
            <Route element={<ProtectedRoute roles={['client']} />}>
              <Route path="app/citas" element={<MisCitas />} />
              <Route path="app/suscripciones" element={<MisSuscripciones />} />
            </Route>

            {/* Empleada + admin */}
            <Route element={<ProtectedRoute roles={['admin', 'employee']} />}>
              <Route path="admin/citas" element={<GestionCitas />} />
              <Route
                path="admin/suscripciones"
                element={<GestionSuscripciones />}
              />
            </Route>

            {/* Solo admin */}
            <Route element={<ProtectedRoute roles={['admin']} />}>
              <Route path="admin" element={<Panel />} />
              <Route path="admin/servicios" element={<GestionServicios />} />
              <Route path="admin/planes" element={<GestionPlanes />} />
              <Route path="admin/usuarios" element={<GestionUsuarios />} />
            </Route>

            <Route path="*" element={<Landing />} />
          </Route>
        </Routes>
      </AuthProvider>
    </ToastProvider>
  );
}
