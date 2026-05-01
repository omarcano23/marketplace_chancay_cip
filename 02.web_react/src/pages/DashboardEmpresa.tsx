import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEmpresaSidebarProps } from '../components/SidebarConfigs';
import { fetchMatchesForUser } from '../lib/authProfile';
import { useAppProfile } from '../hooks/useAppProfile';

const DashboardEmpresa = () => {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn, loadingProfile, profile: user } = useAppProfile();
  const [matches, setMatches] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      navigate('/login');
      return;
    }
    if (loadingProfile) return;
    if (!user) {
      navigate('/registro');
      return;
    }
    if (user.role !== 'empresa') {
      navigate(`/dashboard/${user.role}`);
      return;
    }

    fetchMatchesForUser(user.id).then(setMatches);
  }, [isLoaded, isSignedIn, loadingProfile, user, navigate]);

  if (!isLoaded || loadingProfile || !user) return null;

  return (
    <Layout sidebarProps={getEmpresaSidebarProps('vinculacion', user.fullname, user.company_name)} currentPathLabel="Vinculación">
      <div className="bg-white dark:bg-[#1e2532] rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-1 flex overflow-hidden">
        <div className="flex-1 p-6 flex flex-col justify-center gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wide border border-green-200">Match Engine</span>
            <span className="text-slate-400 text-xs">Basado en tus requerimientos</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Bienvenido, {user.fullname}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl leading-relaxed">
            Hemos encontrado <strong>{matches.length} socios potenciales</strong> que cumplen con tu perfil de <strong>{user.industry}</strong> y tus necesidades de espacio.
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
              Mapa de Oportunidades
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
          <StatCard title="Total Matches" value={matches.length} icon="hub" color="text-primary" bgColor="bg-primary/10" />
          <div className="bg-white dark:bg-[#1e2532] flex-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col p-5">
            <h3 className="font-bold text-slate-800 dark:text-white text-sm mb-4">Sugerencias del Sistema</h3>
            <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto">
              {matches.map((m, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg group hover:bg-primary/5 transition-colors cursor-pointer border border-transparent hover:border-primary/20">
                  <div>
                    <p className="text-sm font-bold dark:text-white group-hover:text-primary transition-colors">{m.company_name || m.fullname}</p>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">{m.role}</p>
                  </div>
                  <span className="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 transition-opacity">add_circle</span>
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

export default DashboardEmpresa;
