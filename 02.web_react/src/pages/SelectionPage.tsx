import { Link, useNavigate } from 'react-router-dom';
import Chatbot from '../components/Chatbot';
import { useEffect } from 'react';
import { getDashboardPath } from '../lib/authProfile';
import { useAppProfile } from '../hooks/useAppProfile';

const SelectionPage = () => {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn, loadingProfile, profile } = useAppProfile();

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      navigate('/signup');
      return;
    }
    if (loadingProfile) return;
    if (profile) {
      navigate(getDashboardPath(profile.role));
    }
  }, [isLoaded, isSignedIn, loadingProfile, profile, navigate]);

  if (!isLoaded || loadingProfile) return null;

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-light dark:bg-background-dark group/design-root overflow-x-hidden font-display">
      {/* Subtle Background Pattern/Image */}
      <div
        className="absolute inset-0 z-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#E31E24 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      ></div>
      
      <div className="layout-container flex h-full grow flex-col z-10 relative">
        {/* Top Navigation */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-10 py-4 sticky top-0 z-50">
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <img src="/cip-logo.png" alt="CIP" className="h-9 w-9 rounded-full object-cover flex-shrink-0" />
            <div className="flex flex-col leading-none">
              <span className="text-gray-900 dark:text-white text-base font-bold tracking-tight">Chancay Hub</span>
              <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">Colegio de Ingenieros del Perú</span>
            </div>
          </Link>
          <div className="flex flex-1 justify-end gap-8">
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
              <a className="hover:text-primary transition-colors" href="#">Ayuda</a>
              <a className="hover:text-primary transition-colors" href="#">Contacto</a>
            </div>
            <Link to="/" className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-sm font-bold transition-colors">
              <span className="truncate">Inicio</span>
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex flex-1 justify-center py-12 px-4 md:px-10">
          <div className="layout-content-container flex flex-col max-w-[1024px] flex-1 gap-12">
            {/* Page Heading */}
            <div className="flex flex-col gap-4 text-center items-center">
              <img src="/cip-logo.png" alt="COLEGIO DE INGENIEROS DEL PERÚ" className="h-20 w-20 rounded-full object-cover shadow-lg shadow-primary/20" />
              <h1 className="text-gray-900 dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-tight">
                Selecciona tu Perfil para Continuar
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-lg font-normal leading-normal max-w-2xl">
                Elige la opción que mejor describa tu actividad en el Puerto de Chancay para personalizar tu experiencia en la plataforma.
              </p>
            </div>

            {/* Role Selection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-2">
              <RoleCard 
                icon="landscape" 
                title="Propietario de Terreno" 
                description="Ofrezco terrenos para desarrollo industrial, almacenes o logística." 
                to="/registro/propietario"
              />
              <RoleCard 
                icon="factory" 
                title="Empresa Inversionista" 
                description="Busco ubicaciones estratégicas para establecer mi operación o planta." 
                to="/registro/empresa"
              />
              <RoleCard 
                icon="engineering" 
                title="Proveedor / Ingeniero" 
                description="Ofrezco servicios técnicos, ingeniería, consultoría o insumos al puerto." 
                to="/registro/proveedor"
              />
            </div>

            {/* Footer Action */}
            <div className="flex px-4 py-6 justify-center">
              <button 
                onClick={() => navigate('/')}
                className="group flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-6 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm font-bold leading-normal transition-colors"
              >
                <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
                <span className="truncate">Volver al inicio</span>
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Background Image for context (Subtle Overlay) */}
      <img
        alt="Blurred industrial shipping container texture"
        className="fixed top-0 left-0 w-full h-full object-cover opacity-[0.03] pointer-events-none z-0 mix-blend-multiply dark:mix-blend-overlay filter blur-sm"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFPwE4iphA4SZPllFq5Cj-fP0ZdWMNpli_jSQ_PRqEoWQI2I9bwsJHTh8L8am69Bo9PxJ7TH_zJVAeSrSwrHeRj1c3mnKLkdIc9wA5q1h08AfWRPXGz2t5TwDN9vGlfLT5LbczNvrgD6K0CzTZzy79NZf6skGUOomkQ4MaepNF3vMEoz22mIhRE5Rx-Vcu9FG-nfELxjxELbt6Wg3uawSFq9m-tL5QSMMDZN8jqFhuVYanv1WUXduGf0EamuqeRl5VXxsfK4bT8_MK"
      />
      <Chatbot />
    </div>
  );
};

const RoleCard = ({ icon, title, description, to }: { icon: string; title: string; description: string; to: string }) => (
  <Link
    to={to}
    className="group/card flex flex-1 flex-col gap-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-sm hover:shadow-xl hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden"
  >
    <div className="absolute top-0 left-0 w-1 h-full bg-transparent group-hover/card:bg-primary transition-colors"></div>
    <div className="icon-marker size-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-900 dark:text-white transition-colors duration-300 group-hover/card:bg-primary/10 group-hover/card:text-primary">
      <span className="material-symbols-outlined text-4xl">{icon}</span>
    </div>
    <div className="flex flex-col gap-2">
      <h2 className="text-gray-900 dark:text-white text-xl font-bold leading-tight group-hover/card:text-primary transition-colors">
        {title}
      </h2>
      <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-relaxed">
        {description}
      </p>
    </div>
    <div className="mt-auto pt-4 flex items-center text-primary font-bold text-sm opacity-0 group-hover/card:opacity-100 transition-opacity transform translate-y-2 group-hover/card:translate-y-0">
      Seleccionar
      <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
    </div>
  </Link>
);

export default SelectionPage;
