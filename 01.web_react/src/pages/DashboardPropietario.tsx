import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPropietarioSidebarProps } from '../components/SidebarConfigs';

const DashboardPropietario = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [matches, setMatches] = useState<any[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(savedUser);
    setUser(parsedUser);

    // Fetch matches reales
    fetch(`http://localhost:4001/api/matches/${parsedUser.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.message === 'success') setMatches(data.data);
      });
  }, [navigate]);

  if (!user) return null;

  return (
    <Layout sidebarProps={getPropietarioSidebarProps('terrenos', user.fullname, user.company_name)} currentPathLabel="Mis Terrenos">
      <div className="bg-white dark:bg-[#1e2532] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-1 flex overflow-hidden">
        <div className="flex-1 p-6 flex flex-col justify-center gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide border border-blue-200">Panel Propietario</span>
            <span className="text-slate-400 text-xs">Ubicación: {user.location}</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Panel de Gestión: {user.fullname}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl leading-relaxed">
            Tu terreno de <strong>{user.size}m²</strong> en <strong>{user.location}</strong> está siendo evaluado por socios estratégicos.
          </p>
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
              <span className="material-symbols-outlined text-primary">map</span>
              Mis Terrenos Registrados
            </h3>
          </div>
          <div className="flex-1 relative bg-slate-100 overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-80" 
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBN4tQktM0BjQ5-AHbLT7dQTvTyEycqwGakmNIXqF17SlwqK4SiZq3jvDZZrHFtVTDliEBsPMv9MtmUiMpV2YnSJ1CF9CqhDLnFz5Pw8DRmKSa8eNtHAhsCyLEGDrKc6sEsRv9jWB1B32fwHDMob5BxjhK6ynaS-Ac8qpIWYNh6WYzBcDziTdo8NKg2YmOmsUvPnEvay3pVBUlP_gg9ik7IGqQfSP6arGnSxR8EPgKFgB03-evT5uGAlGuOCdyfECBy0LNEqPc7xIpj')" }}
            ></div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <StatCard title="Interesados" value={matches.length} icon="real_estate_agent" color="text-primary" bgColor="bg-blue-50" />
          <div className="bg-white dark:bg-[#1e2532] flex-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col p-5">
            <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-4">Inversores Interesados</h3>
            <div className="flex flex-col gap-3">
              {matches.map((m, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div>
                    <p className="text-sm font-bold dark:text-white">{m.company_name || m.fullname}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">{m.industry}</p>
                  </div>
                  <span className="text-primary material-symbols-outlined">chevron_right</span>
                </div>
              ))}
            </div>
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

export default DashboardPropietario;
