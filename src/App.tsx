import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import Settings from './pages/Ajustes';
import DefaultLayout from './layout/DefaultLayout';
import AuthLayout from './layout/AuthLayout';
import {AuthGuard} from './guards/AuthGuard';
import NotFound from './pages/NotFound';
import Inicio from './pages/Inicio/Inicio';
import Pacientes from './pages/Pacientes/Pacientes';
import Configuracion from './pages/Configuracion/Configuracion';
import Evaluaciones from './pages/Evaluaciones/Evaluaciones';
import PacienteDetalle from './pages/Pacientes/PacienteDetalle';
import Resultados from './pages/Evaluaciones/Resultados';
import Estadisticas from './pages/Estadisticas/Estadisticas';
import Perfiles from './pages/Perfiles/Perfiles';
import Tutoriales from './pages/Tutoriales/Tutoriales';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Routes>
      {/* Rutas de autenticación */}
      <Route
        path="/auth/signin"
        element={
          <AuthLayout>
            <PageTitle title="Inicia sesión | Evalingua" />
            <SignIn />
          </AuthLayout>
        }
      />
      {/* Rutas protegidas */}
      <Route
        index
        element={
          <AuthGuard>
            <DefaultLayout>
              <PageTitle title="Inicio | Evalingua" />
              <Inicio />
            </DefaultLayout>
          </AuthGuard>
        }
      />
      <Route
        path="/pacientes"
        element={
          <AuthGuard>
            <DefaultLayout>
              <PageTitle title="Pacientes | Evalingua" />
              <Pacientes />
            </DefaultLayout>
          </AuthGuard>
        }
      />
      <Route
          path='pacientes/detalle/:idEncriptado'
          element={
            <AuthGuard>
              <DefaultLayout>
                <PageTitle title="Detalle del paciente | Evalingua" />
                <PacienteDetalle />
              </DefaultLayout>
            </AuthGuard>
          }
        />
      <Route
        path="/ajustes"
        element={
          <AuthGuard>
            <DefaultLayout>
              <PageTitle title="Ajustes | Evalingua " />
              <Settings />
            </DefaultLayout>
          </AuthGuard>
        }
      />
      <Route
        path="/perfiles"
        element={
          <AuthGuard allowedRoles={['ADMIN']}>
            <DefaultLayout>
              <PageTitle title="Perfiles | Evalingua" />
              <Perfiles />
            </DefaultLayout>
          </AuthGuard>
        }
      />
      <Route
        path="/estadisticas"
        element={
          <AuthGuard>
            <DefaultLayout>
              <PageTitle title="Estadisticas | Evalingua" />
              <Estadisticas />
            </DefaultLayout>
          </AuthGuard>
        }
      />
      <Route
        path="/configuracion/:idEncriptado"
        element={
          <AuthGuard>
            <DefaultLayout>
              <PageTitle title="Configuración | Evalingua" />
              <Configuracion />
            </DefaultLayout>
          </AuthGuard>
        }
      />
      <Route
        path="/evaluaciones"
        element={
          <AuthGuard>
            <DefaultLayout>
              <PageTitle title="Evaluaciones | Evalingua" />
              <Evaluaciones />
            </DefaultLayout>
          </AuthGuard>
        }
      />
      <Route
        path='resultados'
          element={
          <AuthGuard>
            <DefaultLayout>
              <PageTitle title="Resultados | Evalingua" />
              <Resultados />
            </DefaultLayout>
          </AuthGuard>
        }
      />
      <Route
        path="/tutoriales"
        element={
          <AuthGuard>
            <DefaultLayout>
              <PageTitle title="Tutoriales | Evalingua" />
              <Tutoriales />
            </DefaultLayout>
          </AuthGuard>
        }
      />
      {/* Rutas de error */}
      <Route
        path="*"
        element={
          <AuthLayout>
            <PageTitle title="404" />
            <NotFound />
          </AuthLayout>
        }
      />
    </Routes>
  );
}

export default App;
