import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Chatbot from '../components/Chatbot';

const locations = [
  {
    id: 1,
    name: "Terminal Norte - Contenedores",
    type: "Puerto",
    coords: { top: '25%', left: '20%' },
    description: "Hub principal automatizado para buques de gran calado.",
    stats: { capacidad: "1.5M TEU", calado: "17.8m" },
    color: "bg-blue-500"
  },
  {
    id: 2,
    name: "ZAL - Zona Logística",
    type: "Logística",
    coords: { top: '50%', left: '45%' },
    description: "Área estratégica para almacenes y servicios de valor agregado.",
    stats: { area: "120 Ha", naves: "12" },
    color: "bg-emerald-500"
  },
  {
    id: 3,
    name: "Chancay Park",
    type: "Industrial",
    coords: { top: '40%', left: '75%' },
    description: "Complejo industrial para manufactura y tecnología.",
    stats: { lotes: "24 Disp.", energia: "Alta" },
    color: "bg-orange-500"
  }
];

const InteractiveMap = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<any>(null);

  return (
    <div className="font-display bg-background-light dark:bg-background-dark min-h-screen flex flex-col">
      {/* Header Estándar (Igual que LandingPage) */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-10 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/" className="size-8 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>anchor</span>
          </Link>
          <h2 className="text-gray-900 dark:text-white text-xl font-bold leading-tight tracking-tight">
            Chancay Hub
          </h2>
        </div>
        <div className="flex flex-1 justify-end gap-8">
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-gray-600 dark:text-gray-300 text-sm font-medium hover:text-primary transition-colors">Inicio</Link>
            <a className="text-gray-600 dark:text-gray-300 text-sm font-medium hover:text-primary transition-colors" href="#">Zonas</a>
            <a className="text-gray-600 dark:text-gray-300 text-sm font-medium hover:text-primary transition-colors" href="#">Inversión</a>
          </div>
          <button 
            onClick={() => navigate('/login')}
            className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary hover:bg-blue-700 text-white text-sm font-bold transition-all shadow-md shadow-primary/20"
          >
            Iniciar Sesión
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 md:px-10 py-12 flex flex-col gap-8">
        {/* Título de la sección */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white">Mapa de Oportunidades Georreferenciado</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-3xl">
            Explora las zonas estratégicas del Megapuerto de Chancay. Selecciona los puntos de interés para visualizar datos técnicos y disponibilidad.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Contenedor del Mapa (Centro) */}
          <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden relative min-h-[600px] group">
            {/* Fondo del Mapa */}
            <div 
              className="absolute inset-0 bg-cover bg-center grayscale opacity-60 group-hover:opacity-80 transition-opacity duration-700"
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBN4tQktM0BjQ5-AHbLT7dQTvTyEycqwGakmNIXqF17SlwqK4SiZq3jvDZZrHFtVTDliEBsPMv9MtmUiMpV2YnSJ1CF9CqhDLnFz5Pw8DRmKSa8eNtHAhsCyLEGDrKc6sEsRv9jWB1B32fwHDMob5BxjhK6ynaS-Ac8qpIWYNh6WYzBcDziTdo8NKg2YmOmsUvPnEvay3pVBUlP_gg9ik7IGqQfSP6arGnSxR8EPgKFgB03-evT5uGAlGuOCdyfECBy0LNEqPc7xIpj')" }}
            ></div>
            
            {/* Capa de rejilla sutil */}
            <div className="absolute inset-0 bg-white/10 dark:bg-black/20 pointer-events-none"></div>

            {/* Marcadores */}
            {locations.map((loc) => (
              <button
                key={loc.id}
                onClick={() => setSelected(loc)}
                className={`absolute size-6 rounded-full border-4 border-white shadow-2xl transition-all transform hover:scale-150 z-10 ${loc.color} ${selected?.id === loc.id ? 'scale-150 ring-8 ring-primary/20' : ''}`}
                style={{ top: loc.coords.top, left: loc.coords.left }}
              >
                <div className={`absolute -inset-4 rounded-full border border-current opacity-0 ${selected?.id === loc.id ? 'animate-ping opacity-20' : ''}`}></div>
              </button>
            ))}

            {/* Tooltip flotante sutil */}
            <div className="absolute bottom-6 left-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-600 dark:text-gray-300 shadow-lg">
              Interactúa con los puntos marcados en el visor
            </div>
          </div>

          {/* Panel de Detalles (Derecha) */}
          <aside className="lg:col-span-1 flex flex-col gap-6">
            {!selected ? (
              <div className="bg-slate-50 dark:bg-gray-800/50 rounded-3xl p-8 border border-dashed border-gray-300 dark:border-gray-700 h-full flex flex-col items-center justify-center text-center">
                <div className="size-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-gray-400 text-3xl">touch_app</span>
                </div>
                <h3 className="font-bold text-gray-400 uppercase text-xs tracking-widest">Información de Zona</h3>
                <p className="text-gray-400 text-sm mt-2">Haz clic en un marcador para inspeccionar la zona.</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg animate-fade-in-up h-full flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase text-white ${selected.color}`}>
                    {selected.type}
                  </span>
                  <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                
                <h2 className="text-2xl font-black text-gray-900 dark:text-white leading-tight mb-4">{selected.name}</h2>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
                  {selected.description}
                </p>

                <div className="flex flex-col gap-3 mb-8">
                  {Object.entries(selected.stats).map(([key, val]: any) => (
                    <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                      <span className="text-xs text-gray-500 uppercase font-bold">{key}</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{val}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-4 flex flex-col gap-3">
                  <Link to="/registro" className="bg-primary hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all text-center text-sm shadow-lg shadow-primary/20">
                    Registrar Interés
                  </Link>
                  <button className="text-primary text-xs font-bold hover:underline">Ver ficha técnica completa</button>
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>

      {/* Footer Simple */}
      <footer className="mt-auto py-8 px-10 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-xs text-gray-400">
        <p>© 2024 Chancay Hub. Infraestructura Digital Portuaria.</p>
        <div className="flex gap-6 font-medium">
          <a href="#" className="hover:text-primary">Términos Geográficos</a>
          <a href="#" className="hover:text-primary">Capas de Datos</a>
        </div>
      </footer>

      <Chatbot />
    </div>
  );
};

export default InteractiveMap;
