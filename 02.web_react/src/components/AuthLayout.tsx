import { Link, useNavigate } from 'react-router-dom';
import { Show, UserButton } from '@clerk/react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  icon?: string;
  roleTag?: string;
  maxWidth?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ 
  children, 
  title, 
  description, 
  icon, 
  roleTag,
  maxWidth = "max-w-[800px]"
}) => {
  const navigate = useNavigate();

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden font-display">
      <div
        className="absolute inset-0 z-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#1152d4 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      ></div>
      
      <div className="layout-container flex h-full grow flex-col z-10 relative">
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-10 py-4 sticky top-0 z-50">
          <div className="flex items-center gap-4 text-gray-900 dark:text-white">
            <Link to="/" className="size-8 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>anchor</span>
            </Link>
            <h2 className="text-gray-900 dark:text-white text-xl font-bold leading-tight tracking-tight">
              Chancay Hub
            </h2>
          </div>
          <div className="flex flex-1 justify-end gap-8">
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
              <a className="hover:text-primary transition-colors" href="#">Ayuda</a>
              <a className="hover:text-primary transition-colors" href="#">Contacto</a>
            </div>
            <Show when="signed-out">
              <Link to="/login" className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-sm font-bold transition-colors">
                <span className="truncate">Iniciar Sesión</span>
              </Link>
            </Show>
            <Show when="signed-in">
              <div className="flex items-center gap-3">
                <UserButton />
                <span className="text-sm font-bold text-gray-800 dark:text-gray-200">Cuenta activa</span>
              </div>
            </Show>
          </div>
        </header>

        <main className="flex flex-1 justify-center py-12 px-4 md:px-10">
          <div className={`layout-content-container flex flex-col ${maxWidth} flex-1 gap-8`}>
            <div className="flex flex-col gap-4 text-center items-center animate-fade-in-up">
              {roleTag && (
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-900/30 px-3 py-1 text-primary dark:text-blue-300 mb-2">
                  {icon && <span className="material-symbols-outlined text-sm">{icon}</span>}
                  <span className="text-xs font-bold uppercase tracking-wide">{roleTag}</span>
                </div>
              )}
              {icon && !roleTag && (
                <div className="size-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-primary mb-2">
                  <span className="material-symbols-outlined text-4xl">{icon}</span>
                </div>
              )}
              <h1 className="text-gray-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tight">
                {title}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-lg font-normal leading-normal max-w-2xl">
                {description}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="p-6 md:p-8 flex flex-col gap-8">
                {children}
              </div>
            </div>

            <div className="flex px-4 py-2 justify-center">
              <button 
                onClick={() => navigate('/registro')}
                className="group flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-6 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm font-bold leading-normal transition-colors"
              >
                <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
                <span className="truncate">Volver a selección</span>
              </button>
            </div>
          </div>
        </main>
      </div>

      <img
        alt="Blurred industrial shipping container texture"
        className="fixed top-0 left-0 w-full h-full object-cover opacity-[0.03] pointer-events-none z-0 mix-blend-multiply dark:mix-blend-overlay filter blur-sm"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFPwE4iphA4SZPllFq5Cj-fP0ZdWMNpli_jSQ_PRqEoWQI2I9bwsJHTh8L8am69Bo9PxJ7TH_zJVAeSrSwrHeRj1c3mnKLkdIc9wA5q1h08AfWRPXGz2t5TwDN9vGlfLT5LbczNvrgD6K0CzTZzy79NZf6skGUOomkQ4MaepNF3vMEoz22mIhRE5Rx-Vcu9FG-nfELxjxELbt6Wg3uawSFq9m-tL5QSMMDZN8jqFhuVYanv1WUXduGf0EamuqeRl5VXxsfK4bT8_MK"
      />
    </div>
  );
};

export default AuthLayout;
