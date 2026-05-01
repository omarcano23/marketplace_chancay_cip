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

  const empresas = allUsers.filter((u) => u.role === 'empresa').length;
  const propietarios = allUsers.filter((u) => u.role === 'propietario').length;
  const proveedores = allUsers.filter((u) => u.role === 'proveedor').length;
  const recentUsers = [...allUsers]
    .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
    .slice(0, 5);

  return (
    <Layout sidebarProps={getAdminSidebarProps('dashboard', adminUser.fullname)} currentPathLabel="Resumen Global">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
        <div className="md:col-span-2 flex flex-col gap-8">
          <div className="bg-gradient-to-r from-[#2A2A29] to-primary rounded-2xl p-5 md:p-8 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">Bienvenido al Centro de Control</h2>
              <p className="opacity-90 max-w-md text-sm md:text-base">El Puerto de Chancay está creciendo. Tienes {allUsers.length} perfiles activos esperando vinculación.</p>
              <button onClick={() => navigate('/dashboard/admin/users')} className="mt-4 md:mt-6 bg-white text-primary px-4 md:px-6 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-slate-50 transition-colors">
                Gestionar Usuarios
              </button>
            </div>
            <span className="material-symbols-outlined absolute right-[-10px] md:right-[-20px] bottom-[-10px] md:bottom-[-20px] text-[120px] md:text-[200px] opacity-10 rotate-12">hub</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <QuickStat title="Empresas Registradas" value={empresas} trend={`${Math.round((empresas / Math.max(allUsers.length, 1)) * 100)}% del total`} icon="apartment" color="text-primary" />
            <StatCard title="Propietarios Registrados" value={propietarios} icon="landscape" color="text-emerald-600" />
            <StatCard title="Proveedores Registrados" value={proveedores} icon="engineering" color="text-orange-600" />
            <StatCard title="Total de Usuarios" value={allUsers.length} icon="groups" color="text-indigo-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">history</span>
            Actividad Reciente
          </h3>
          <div className="flex flex-col gap-6">
            {recentUsers.length === 0 ? (
              <p className="text-sm text-slate-500">Aún no hay actividad registrada.</p>
            ) : (
              recentUsers.map((u) => (
                <ActivityItem
                  key={u.id}
                  user={u.fullname || u.email || `Usuario #${u.id}`}
                  action={`Nuevo registro (${u.role})`}
                  time={timeAgo(u.created_at)}
                  type={u.role}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

const timeAgo = (dateValue?: string) => {
  if (!dateValue) return 'Sin fecha';
  const diffMs = Date.now() - new Date(dateValue).getTime();
  if (Number.isNaN(diffMs) || diffMs < 0) return 'Hace un momento';

  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'Hace segundos';
  if (minutes < 60) return `Hace ${minutes} min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Hace ${hours} h`;

  const days = Math.floor(hours / 24);
  return `Hace ${days} d`;
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
    <div className={`size-2 rounded-full ${type === 'empresa' ? 'bg-primary/100' : type === 'proveedor' ? 'bg-orange-500' : type === 'propietario' ? 'bg-emerald-500' : 'bg-indigo-500'}`}></div>
    <div className="flex-1">
      <p className="text-sm font-bold dark:text-white">{user}</p>
      <p className="text-xs text-slate-500">{action}</p>
    </div>
    <span className="text-[10px] text-slate-400 font-medium">{time}</span>
  </div>
);

export default DashboardAdmin;
