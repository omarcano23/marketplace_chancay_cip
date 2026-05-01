import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
      <header className="flex items-center px-8 py-4 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <img src="/cip-logo.png" alt="CIP" className="h-9 w-9 rounded-full object-cover flex-shrink-0" />
          <div className="flex flex-col leading-none">
            <span className="text-gray-900 dark:text-white text-base font-bold tracking-tight">Chancay Hub</span>
            <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">Colegio de Ingenieros del Perú</span>
          </div>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <img src="/cip-logo.png" alt="COLEGIO DE INGENIEROS DEL PERÚ" className="h-20 w-20 rounded-full object-cover shadow-lg shadow-primary/20" />
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white">Bienvenido a Chancay Hub</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Plataforma del COLEGIO DE INGENIEROS DEL PERÚ</p>
            </div>
          </div>

          <div className="w-full bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-8 flex flex-col gap-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white text-center">Acceder a la plataforma</h2>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => navigate('/registro')}
                className="w-full flex items-center justify-center rounded-lg bg-primary hover:bg-primary-dark text-white font-bold text-base h-12 shadow-lg shadow-primary/30 transition-all transform hover:-translate-y-0.5"
              >
                Registrarse
                <span className="material-symbols-outlined ml-2 text-xl">arrow_forward</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                <span className="text-xs text-gray-400 font-medium">o</span>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
              </div>
              <button
                onClick={() => navigate('/registro')}
                className="w-full flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold text-sm h-11 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Continuar sin cuenta
              </button>
            </div>
          </div>

          <Link to="/" className="text-sm text-gray-500 hover:text-primary transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Volver al inicio
          </Link>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
