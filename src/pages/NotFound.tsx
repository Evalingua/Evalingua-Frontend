import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 p-5 dark:bg-boxdark">
      <div className="text-center">
        <h1 className="mb-4 text-7xl font-bold text-primary dark:text-white">
          404
        </h1>
        <h2 className="mb-5 text-2xl font-bold text-boxdark dark:text-white">
          ¡Oops! Página no encontrada
        </h2>
        <p className="mb-6 text-lg text-boxdark dark:text-white">
          La página que estás buscando no existe o ha sido movida.
        </p>
        <button
          onClick={() => navigate('/')}
          className="rounded-lg bg-primary px-8 py-3 font-medium text-white hover:bg-opacity-90"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default NotFound;
