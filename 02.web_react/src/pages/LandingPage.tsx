import { Link } from 'react-router-dom';
import Chatbot from '../components/Chatbot';

const LandingPage = () => {
  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-[#111318] dark:text-white overflow-x-hidden min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f2f4] dark:border-b-gray-800 bg-white dark:bg-[#101622] px-10 py-3 shadow-sm">
        <div className="flex items-center gap-3 text-[#111318] dark:text-white">
          <img src="/cip-logo.png" alt="CIP" className="h-9 w-9 rounded-full object-cover flex-shrink-0" />
          <div className="flex flex-col leading-none">
            <span className="text-[#111318] dark:text-white text-base font-bold tracking-tight">Chancay Hub</span>
            <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">Colegio de Ingenieros del Perú</span>
          </div>
        </div>
        <div className="flex flex-1 justify-end gap-8">
          <div className="hidden md:flex items-center gap-9">
            <a className="text-[#111318] dark:text-gray-200 text-sm font-medium leading-normal hover:text-primary transition-colors" href="#sobre-nosotros">Sobre Nosotros</a>
            <a className="text-[#111318] dark:text-gray-200 text-sm font-medium leading-normal hover:text-primary transition-colors" href="#servicios">Servicios</a>
            <a className="text-[#111318] dark:text-gray-200 text-sm font-medium leading-normal hover:text-primary transition-colors" href="#socios">Socios</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-primary transition-colors px-4">
              Iniciar Sesión
            </Link>
            <Link
              to="/signup"
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-primary hover:bg-primary-dark transition-colors text-white text-sm font-bold leading-normal tracking-[0.015em] shadow-md hover:shadow-lg"
            >
              <span className="truncate">Registrarse</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex flex-col w-full">
        <section
          className="relative w-full min-h-[600px] flex items-center justify-center bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(16, 22, 34, 0.6) 0%, rgba(16, 22, 34, 0.7) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuAgccNijvpT6C8sW_YcG5nJjzpM0CoT41tKgxHEgB5u5pzsiGz8trEQL6gvIeUB0d6J8TYGn7PcLdASOhDBsnOv3yH_xY-44VUYVRJPdJXMpSUI9ntRftGN3ak4HJu9yosvTb1ouEu5mhUyDYxYgY6ENyMrCg7cavL3fVSFABIrCYVSWv5adZiC-y0PGSZmIWBqvs6v9xN3yJBudxiZsLjRqou1162ivE7ITos4dN0ezubOyGdWnDgvLGo0TcH6G1QORAitUdP5JKcq')`
          }}
        >
          <div className="layout-content-container flex flex-col max-w-[1200px] flex-1 px-6 md:px-10 lg:px-40 py-20 text-center md:text-left">
            <div className="flex flex-col gap-6 max-w-[800px]">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 w-fit backdrop-blur-sm self-center md:self-start">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="text-white text-xs font-medium tracking-wide uppercase">El Futuro Logístico del Perú</span>
              </div>
              <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-[-0.033em] drop-shadow-sm">
                Conectando Oportunidades en el Nuevo Hub Industrial de Chancay
              </h1>
              <h2 className="text-gray-200 text-lg md:text-xl font-normal leading-relaxed max-w-[640px]">
                La plataforma centralizada para propietarios de terrenos, inversionistas y proveedores de servicios en el megapuerto más importante del Pacífico Sur.
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 mt-4 justify-center md:justify-start">
                <Link
                  to="/signup"
                  className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-lg h-12 px-8 bg-primary hover:bg-primary-dark text-white text-base font-bold transition-all shadow-lg hover:shadow-primary/50"
                >
                  <span>Comenzar Ahora</span>
                  <span className="material-symbols-outlined ml-2" style={{ fontSize: '20px' }}>arrow_forward</span>
                </Link>
                <Link
                  to="/mapa"
                  className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-lg h-12 px-8 bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-md text-white text-base font-bold transition-all"
                >
                  <span>Ver Mapa Interactivo</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Partners section */}
        <div id="socios" className="w-full bg-white dark:bg-[#151c2b] border-b border-[#e5e7eb] dark:border-gray-800 py-8">
          <div className="max-w-[1200px] mx-auto px-6 md:px-10 flex flex-col items-center gap-6">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Con la confianza de instituciones líderes</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <Partner icon="apartment" name="Constructora Andina" />
              <Partner icon="water_damage" name="Naviera Del Sur" />
              <Partner icon="account_balance" name="Banco Industrial" />
              <Partner icon="local_shipping" name="Logística Global" />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section id="servicios" className="py-20 px-6 md:px-10 lg:px-40 bg-white dark:bg-background-dark">
          <div className="max-w-[1200px] mx-auto flex flex-col gap-12">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-gray-100 dark:border-gray-800 pb-8">
              <div className="flex flex-col gap-4 max-w-[720px]">
                <h2 className="text-[#111318] dark:text-white tracking-tight text-3xl md:text-4xl font-bold leading-tight">Impulsando el Desarrollo Industrial</h2>
                <p className="text-[#616f89] dark:text-gray-400 text-lg font-normal leading-relaxed">
                  Soluciones integrales diseñadas específicamente para conectar a todos los actores clave del ecosistema portuario de Chancay.
                </p>
              </div>
              <button className="hidden md:flex items-center text-primary font-bold hover:underline">
                Ver todas las soluciones
                <span className="material-symbols-outlined ml-1">arrow_right_alt</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard icon="map" title="Para Propietarios" description="Gestiona y valoriza tus activos inmobiliarios de manera eficiente. Accede a una red verificada de compradores." />
              <FeatureCard icon="monetization_on" title="Para Inversionistas" description="Encuentra oportunidades de inversión de alto impacto en la región con análisis de datos exclusivos del puerto." />
              <FeatureCard icon="engineering" title="Para Proveedores" description="Conecta directamente con grandes proyectos de ingeniería y construcción que requieren tus servicios especializados." />
            </div>
          </div>
        </section>

        {/* About section */}
        <section id="sobre-nosotros" className="py-10 px-6 md:px-10 lg:px-40 bg-[#eef3fb] dark:bg-[#0d121c] border-y border-[#dbe4f4] dark:border-gray-800">
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoCard title="Misión" text="Acelerar la conexión entre terrenos, inversión y servicios especializados con decisiones basadas en datos." icon="flag" />
            <InfoCard title="Visión" text="Consolidar el ecosistema digital de referencia para el desarrollo industrial en torno al Puerto de Chancay." icon="visibility" />
            <InfoCard title="Enfoque" text="Construcción iterativa MVP-first con autenticación segura, matching explicable y operación escalable." icon="rocket_launch" />
          </div>
        </section>

        {/* Technology section */}
        <section className="py-10 px-6 md:px-10 lg:px-40 bg-[#f8f9fc] dark:bg-[#0d121c]">
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6">
              <div className="inline-flex items-center gap-2 text-primary font-bold text-sm tracking-widest uppercase">
                <span className="w-8 h-[2px] bg-primary"></span>
                Tecnología y Conexión
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#111318] dark:text-white leading-tight">El Ecosistema Digital del Puerto de Chancay</h2>
              <p className="text-[#616f89] dark:text-gray-400 text-lg leading-relaxed">
                Nuestra plataforma utiliza tecnología de vanguardia para mapear terrenos, catalogar servicios y facilitar transacciones seguras. Desde la visualización geoespacial hasta la firma de contratos inteligentes.
              </p>
              <ul className="flex flex-col gap-4 mt-4">
                <ListItem text="Mapeo geoespacial de lotes industriales" />
                <ListItem text="Directorio verificado de proveedores locales" />
                <ListItem text="Reportes de mercado y tendencias portuarias" />
              </ul>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
              <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors z-10"></div>
              <img
                alt="Aerial view of shipping containers and logistics hub layout"
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBACIwwZp3FLXCOb06NWmEGyLGyX5sU1Ly1knBmzGXtDTTcrkI8kzgWGfxqbQtFvrcxSuFDWCPl5sdvG76RIigpwJ3WiAl7350lU-sHValJPUeMtLLkNeWGc2YsNw4bmmwTzhGr_-xsVohaATPLTdlhmSFKV0zil5OHJzG5cMrVYAOUSFn0NssWGhJEY1dHgaBwUtZX8TPW4m_4qcJS5dCb9m7ZmXLwBDW5XBcQxDWZUHS9vW6pKfDyew9ZdILth4LKQq8Em-ELfO-8"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 dark:bg-[#1a2230]/95 backdrop-blur p-4 rounded-lg shadow-lg z-20 flex justify-between items-center border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Inversión Proyectada</span>
                  <span className="text-xl font-bold text-[#111318] dark:text-white">$3.6 Billones</span>
                </div>
                <div className="w-[1px] h-8 bg-gray-200 dark:bg-gray-600"></div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Capacidad (TEUs)</span>
                  <span className="text-xl font-bold text-[#111318] dark:text-white">1M+ Anual</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 md:px-10 lg:px-40">
          <div className="max-w-[1200px] mx-auto relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-primary z-0"></div>
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#2A2A29]/90 to-primary/60 z-0"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 p-10 md:p-16">
              <div className="flex flex-col gap-4 max-w-xl text-center md:text-left">
                <h2 className="text-white text-3xl md:text-4xl font-bold leading-tight">¿Listo para ser parte del cambio?</h2>
                <p className="text-white/80 text-lg">Únete hoy a la comunidad empresarial más dinámica de la costa del Pacífico.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup" className="bg-white text-primary hover:bg-gray-100 font-bold py-3 px-8 rounded-lg shadow-lg transition-transform hover:-translate-y-1 text-center">
                  Crear Cuenta Gratis
                </Link>
                <button className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-bold py-3 px-8 rounded-lg transition-colors">
                  Contactar Ventas
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white dark:bg-[#101622] border-t border-[#f0f2f4] dark:border-gray-800">
          <div className="max-w-[1200px] mx-auto px-6 md:px-10 lg:px-40 py-12 flex flex-col gap-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="flex flex-col gap-4 col-span-1 md:col-span-1">
                <div className="flex items-center gap-3 text-[#111318] dark:text-white">
                  <img src="/cip-logo.png" alt="CIP" className="h-10 w-10 rounded-full object-cover flex-shrink-0" />
                  <div className="flex flex-col leading-none">
                    <h2 className="text-base font-bold">Chancay Hub</h2>
                    <span className="text-[10px] font-semibold text-primary uppercase tracking-wider mt-0.5">CIP</span>
                  </div>
                </div>
                <p className="text-[#616f89] dark:text-gray-400 text-sm leading-relaxed">
                  Facilitando el comercio y la industria en el nuevo eje portuario de Sudamérica.
                </p>
              </div>
              <FooterColumn title="Plataforma" links={[
                { label: 'Propiedades', to: '/info/propiedades' },
                { label: 'Directorio', to: '/info/directorio' },
                { label: 'Mapa Interactivo', to: '/mapa' },
              ]} />
              <FooterColumn title="Compañía" links={[
                { label: 'Sobre Nosotros', to: '#sobre-nosotros' },
                { label: 'Carreras', to: '/info/carreras' },
                { label: 'Blog', to: '/info/blog' },
              ]} />
              <FooterColumn title="Legal" links={[
                { label: 'Privacidad', to: '/info/privacidad' },
                { label: 'Términos', to: '/info/terminos' },
                { label: 'Cookies', to: '/info/cookies' },
              ]} />
            </div>
            <div className="h-px bg-[#f0f2f4] dark:bg-gray-800 w-full"></div>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
              <div className="flex flex-col gap-1">
                <p className="text-[#616f89] dark:text-gray-500 text-sm">© 2024 Chancay Hub. Todos los derechos reservados.</p>
                <p className="text-[#616f89] dark:text-gray-600 text-xs">Una iniciativa del <span className="font-semibold text-primary">COLEGIO DE INGENIEROS DEL PERÚ (CIP)</span></p>
              </div>
              <div className="flex items-center gap-4">
                <img src="/cip-logo.png" alt="COLEGIO DE INGENIEROS DEL PERÚ" className="h-8 w-8 rounded-full object-cover opacity-70 hover:opacity-100 transition-opacity" />
                <a className="text-[#616f89] dark:text-gray-400 hover:text-primary transition-colors" href="#">
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>public</span>
                </a>
                <a className="text-[#616f89] dark:text-gray-400 hover:text-primary transition-colors" href="#">
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>mail</span>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
      <Chatbot />
    </div>
  );
};

const Partner = ({ icon, name }: { icon: string; name: string }) => (
  <div className="flex items-center gap-2 font-bold text-xl text-gray-700 dark:text-gray-300">
    <span className="material-symbols-outlined text-3xl">{icon}</span>
    {name}
  </div>
);

const FeatureCard = ({ icon, title, description }: { icon: string; title: string; description: string }) => (
  <div className="group flex flex-col gap-6 rounded-xl border border-[#e5e7eb] dark:border-gray-700 bg-white dark:bg-[#1a2230] p-8 transition-all hover:shadow-xl hover:border-primary/50 relative overflow-hidden">
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
      <span className="material-symbols-outlined text-primary text-9xl">{icon}</span>
    </div>
    <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
      <span className="material-symbols-outlined text-3xl">{icon}</span>
    </div>
    <div className="flex flex-col gap-3 relative z-10">
      <h3 className="text-[#111318] dark:text-white text-xl font-bold">{title}</h3>
      <p className="text-[#616f89] dark:text-gray-400 text-base leading-relaxed">{description}</p>
    </div>
  </div>
);

const ListItem = ({ text }: { text: string }) => (
  <li className="flex items-center gap-3 text-[#111318] dark:text-gray-200 font-medium">
    <span className="material-symbols-outlined text-primary">check_circle</span>
    {text}
  </li>
);

const InfoCard = ({ title, text, icon }: { title: string; text: string; icon: string }) => (
  <article className="rounded-xl bg-white dark:bg-[#1a2230] border border-slate-200 dark:border-slate-700 p-6 flex flex-col gap-3 shadow-sm">
    <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
      <span className="material-symbols-outlined">{icon}</span>
    </div>
    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{text}</p>
  </article>
);

const FooterColumn = ({ title, links }: { title: string; links: Array<{ label: string; to: string }> }) => (
  <div className="flex flex-col gap-3">
    <h3 className="text-[#111318] dark:text-white font-bold text-sm uppercase tracking-wide">{title}</h3>
    {links.map((link) => (
      link.to.startsWith('#') ? (
        <a key={link.label} className="text-[#616f89] dark:text-gray-400 text-sm hover:text-primary transition-colors" href={link.to}>
          {link.label}
        </a>
      ) : (
        <Link key={link.label} className="text-[#616f89] dark:text-gray-400 text-sm hover:text-primary transition-colors" to={link.to}>
          {link.label}
        </Link>
      )
    ))}
  </div>
);

export default LandingPage;
