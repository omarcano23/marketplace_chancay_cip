import Layout from '../components/Layout';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminSidebarProps } from '../components/AdminSidebarConfig';
import { useAppProfile } from '../hooks/useAppProfile';

const AdminSecurity = () => {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn, loadingProfile, profile: adminUser } = useAppProfile();

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
    }
  }, [isLoaded, isSignedIn, loadingProfile, adminUser, navigate]);

  if (!isLoaded || loadingProfile || !adminUser) return null;

  return (
    <Layout sidebarProps={getAdminSidebarProps('security', adminUser.fullname)} currentPathLabel="Seguridad del Sistema">
      <div className="flex flex-col gap-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold dark:text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-red-500">lock_open</span>
              Intentos de Acceso Recientes
            </h3>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase">Firewall Activo</span>
          </div>
          <div className="flex flex-col gap-4">
            <LogItem ip="192.168.1.1" status="Success" time="Justo ahora" user="admin@chancay.com" />
            <LogItem ip="185.22.41.12" status="Failed" time="Hace 15 min" user="unknown_user" />
            <LogItem ip="192.168.1.45" status="Success" time="Hace 1 hora" user="empresa@test.com" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatusCard label="Servidor API" status="Online" color="text-green-500" />
          <StatusCard label="Base de Datos SQLite" status="Connected" color="text-green-500" />
          <StatusCard label="SSL Certificate" status="Valid" color="text-green-500" />
        </div>
      </div>
    </Layout>
  );
};

const LogItem = ({ ip, status, time, user }: any) => (
  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-900 rounded-lg text-xs">
    <div className="flex gap-4">
      <span className="font-mono text-slate-500">{ip}</span>
      <span className="font-bold dark:text-white">{user}</span>
    </div>
    <div className="flex gap-4 items-center">
      <span className="text-slate-400">{time}</span>
      <span className={`font-bold ${status === 'Success' ? 'text-green-600' : 'text-red-600'}`}>{status}</span>
    </div>
  </div>
);

const StatusCard = ({ label, status, color }: any) => (
  <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col gap-1">
    <span className="text-[10px] font-bold text-slate-500 uppercase">{label}</span>
    <span className={`text-sm font-bold ${color}`}>{status}</span>
  </div>
);

export default AdminSecurity;
