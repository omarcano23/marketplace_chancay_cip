import Layout from '../components/Layout';
import type { NavItemProps } from '../components/Sidebar';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardProveedor = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(savedUser));
  }, [navigate]);

  if (!user) return null;

  const sidebarProps = {
    role: 'Proveedor' as const,
    userName: user.fullname,
    userCompany: user.company_name,
    menuItems: [
      { icon: 'work', label: 'Oportunidades' },
      { icon: 'engineering', label: 'Proyectos', active: true },
      { icon: 'gavel', label: 'Licitaciones' },
      { icon: 'description', label: 'Documentación' },
      { icon: 'account_balance_wallet', label: 'Finanzas' },
      { icon: 'insights', label: 'Reportes' },
    ] as NavItemProps[]
  };

  return (
    <Layout sidebarProps={sidebarProps} currentPathLabel="Mis Proyectos">
      <div className="bg-white dark:bg-[#1e2532] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-1 flex overflow-hidden">
        <div className="flex-1 p-6 flex flex-col justify-center gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide border border-blue-200">Perfil de Servicio</span>
            <span className="text-slate-400 text-xs">Especialidad: {user.industry}</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Panel de Proveedor: {user.fullname}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl leading-relaxed">
            Tu experiencia de <strong>{user.experience}</strong> en <strong>{user.services}</strong> te posiciona como un socio clave.
          </p>
          <div className="mt-2 flex gap-3">
            <button className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary/30">
              Ver Pliegos Abiertos
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>
        <div 
          className="hidden md:block w-1/3 bg-cover bg-center rounded-r-lg relative" 
          style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDVCbJlbFT61fkw2pZq7Ln47iCgtm_LsW93cJLtxmOHmfoeCvzdLLXJuYxcIf5c2uhlRl7IZZQoM2Pw1TkL07U-ILb3PggG41leH6471gP9sBJ4NGg7EqTly2gGPEYkJ30InpVfyRSvJcSfwww80K3oe0v9OYDm51h_22L9Vs9THYdau5SRO04ySi_vdVv11jepNGnR6amf96yAChLjClnGTv_Lv7cUhPHWDsSXSTlrZMAjeC_9lDqZACKWLh8g1zzoLz10NzOpsGl0')" }}
        >
          <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white dark:to-[#1e2532]"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 bg-white dark:bg-[#1e2532] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col h-[500px]">
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">list_alt</span>
              Oportunidades de Servicio
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <p className="text-slate-500 italic">No hay licitaciones nuevas en este momento.</p>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4">
            <StatCard title="Propuestas Enviadas" value="8" icon="send" color="text-primary" bgColor="bg-blue-50" />
            <StatCard title="Proyectos Activos" value="2" icon="engineering" color="text-emerald-600" bgColor="bg-emerald-50" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

const StatCard = ({ title, value, icon, color, bgColor }: any) => (
  <div className="bg-white dark:bg-[#1e2532] p-5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-slate-500 font-medium">{title}</p>
        <h3 className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{value}</h3>
      </div>
      <div className={`p-2 ${bgColor} dark:bg-opacity-10 rounded-lg ${color}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
    </div>
  </div>
);

export default DashboardProveedor;
