import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminSidebarProps } from '../components/AdminSidebarConfig';
import { fetchAllUsers } from '../lib/authProfile';
import { useAppProfile } from '../hooks/useAppProfile';

const DashboardAdmin = () => {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn, loadingProfile, profile: adminUser } = useAppProfile();
  const [allUsers, setAllUsers] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      navigate('/login');
      return;
    }
    if (loadingProfile) return;
    if (!adminUser) {
      navigate('/registro');
      return;
    }
    if (adminUser.role !== 'admin') {
      navigate(`/dashboard/${adminUser.role}`);
      return;
    }
    fetchAllUsers().then(setAllUsers);
  }, [isLoaded, isSignedIn, loadingProfile, adminUser, navigate]);

  if (!isLoaded || loadingProfile || !adminUser) return null;

  return (
    <Layout sidebarProps={getAdminSidebarProps('dashboard', adminUser.fullname)} currentPathLabel="Resumen Global">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 flex flex-col gap-8">
          <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-2">Bienvenido al Centro de Control</h2>
              <p className="opacity-90 max-w-md">El Puerto de Chancay está creciendo. Tienes {allUsers.length} perfiles activos esperando vinculación.</p>
              <button onClick={() => navigate('/dashboard/admin/users')} className="mt-6 bg-white text-primary px-6 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-slate-50 transition-colors">
                Gestionar Usuarios
              </button>
            </div>
            <span className="material-symbols-outlined absolute right-[-20px] bottom-[-20px] text-[200px] opacity-10 rotate-12">hub</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <QuickStat title="Consultas del Chatbot" value="142" trend="+12% hoy" icon="chat" color="text-emerald-600" />
            <StatCard title="Matches Exitosos" value="28" icon="handshake" color="text-blue-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">history</span>
            Actividad Reciente
          </h3>
          <div className="flex flex-col gap-6">
            <ActivityItem user="Elena Wong" action="Nuevo registro" time="Hace 10 min" type="empresa" />
            <ActivityItem user="Miguel Torres" action="Actualizó servicios" time="Hace 1 hora" type="proveedor" />
            <ActivityItem user="Fundo La Querencia" action="Nuevo match" time="Hace 2 horas" type="propietario" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

const QuickStat = ({ title, value, trend, icon, color }: any) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{title}</p>
        <h3 className="text-2xl font-black mt-1 dark:text-white">{value}</h3>
        <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded">{trend}</span>
      </div>
      <span className={`material-symbols-outlined ${color}`}>{icon}</span>
    </div>
  </div>
);

const StatCard = ({ title, value, icon, color }: any) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{title}</p>
        <h3 className="text-2xl font-black mt-1 dark:text-white">{value}</h3>
      </div>
      <span className={`material-symbols-outlined ${color}`}>{icon}</span>
    </div>
  </div>
);

const ActivityItem = ({ user, action, time, type }: any) => (
  <div className="flex gap-4 items-center">
    <div className={`size-2 rounded-full ${type === 'empresa' ? 'bg-blue-500' : type === 'proveedor' ? 'bg-orange-500' : 'bg-emerald-500'}`}></div>
    <div className="flex-1">
      <p className="text-sm font-bold dark:text-white">{user}</p>
      <p className="text-xs text-slate-500">{action}</p>
    </div>
    <span className="text-[10px] text-slate-400 font-medium">{time}</span>
  </div>
);

export default DashboardAdmin;
