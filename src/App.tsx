import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Chart from './pages/Chart';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import DefaultLayout from './layout/DefaultLayout';
import AuthLayout from './layout/AuthLayout';
import {AuthGuard} from './guards/AuthGuard';
import NotFound from './pages/NotFound';
import Inicio from './pages/Inicio/Inicio';
import Pacientes from './pages/Pacientes/Pacientes';
import Configuracion from './pages/Configuracion/Configuracion';
import Resultados from './pages/Resultados/Resultados';
import PacienteDetalle from './pages/Pacientes/PacienteDetalle';

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
      <Route
        path="/auth/signup"
        element={
          <AuthLayout>
            <PageTitle title="Signup | TailAdmin - Tailwind CSS Admin Dashboard Template" />
            <SignUp />
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
        path="/profile"
        element={
          <AuthGuard>
            <DefaultLayout>
              <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Profile />
            </DefaultLayout>
          </AuthGuard>
        }
      />
      <Route
        path="/forms/form-elements"
        element={
          <AuthGuard>
            <DefaultLayout>
              <PageTitle title="Form Elements | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <FormElements />
            </DefaultLayout>
          </AuthGuard>
        }
      />
      <Route
        path="/forms/form-layout"
        element={
          <AuthGuard>
            <DefaultLayout>
              <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <FormLayout />
            </DefaultLayout>
          </AuthGuard>
        }
      />
      <Route
        path="/tables"
        element={
          <AuthGuard>
            <DefaultLayout>
              <PageTitle title="Tables | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Tables />
            </DefaultLayout>
          </AuthGuard>
        }
      />
      <Route
        path="/settings"
        element={
          <AuthGuard>
            <DefaultLayout>
              <PageTitle title="Settings | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Settings />
            </DefaultLayout>
          </AuthGuard>
        }
      />
      <Route
        path="/chart"
        element={
          <AuthGuard>
            <DefaultLayout>
              <PageTitle title="Basic Chart | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Chart />
            </DefaultLayout>
          </AuthGuard>
        }
      />
      <Route
        path="/ui/alerts"
        element={
          <AuthGuard>
            <DefaultLayout>
              <PageTitle title="Alerts | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Alerts />
            </DefaultLayout>
          </AuthGuard>
        }
      />
      <Route
        path="/ui/buttons"
        element={
          <AuthGuard>
            <DefaultLayout>
              <PageTitle title="Buttons | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Buttons />
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
        path="/resultados"
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
