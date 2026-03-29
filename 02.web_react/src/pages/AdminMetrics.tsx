import Layout from '../components/Layout';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminSidebarProps } from '../components/AdminSidebarConfig';
import { useAppProfile } from '../hooks/useAppProfile';

const AdminMetrics = () => {
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
    <Layout sidebarProps={getAdminSidebarProps('metrics', adminUser.fullname)} currentPathLabel="Análisis de Plataforma">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="font-bold dark:text-white mb-6">Crecimiento de Usuarios (Mensual)</h3>
          <div className="flex items-end gap-2 h-48">
            <Bar height="40%" label="Ene" />
            <Bar height="55%" label="Feb" />
            <Bar height="45%" label="Mar" />
            <Bar height="70%" label="Abr" />
            <Bar height="85%" label="May" />
            <Bar height="100%" label="Jun" active />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="font-bold dark:text-white mb-6">Distribución por Sector</h3>
          <div className="flex flex-col gap-4">
            <ProgressRow label="Logística" value={65} color="bg-blue-500" />
            <ProgressRow label="Inmobiliaria" value={45} color="bg-emerald-500" />
            <ProgressRow label="Ingeniería" value={30} color="bg-orange-500" />
            <ProgressRow label="Agroindustria" value={20} color="bg-indigo-500" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

const Bar = ({ height, label, active }: any) => (
  <div className="flex-1 flex flex-col items-center gap-2">
    <div className={`w-full rounded-t-lg transition-all ${active ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'}`} style={{ height }}></div>
    <span className="text-[10px] text-slate-500 font-bold uppercase">{label}</span>
  </div>
);

const ProgressRow = ({ label, value, color }: any) => (
  <div className="flex flex-col gap-1">
    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="w-full h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
      <div className={`h-full ${color}`} style={{ width: `${value}%` }}></div>
    </div>
  </div>
);

export default AdminMetrics;
