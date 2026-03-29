import Layout from '../components/Layout';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminSidebarProps } from '../components/AdminSidebarConfig';
import { useAppProfile } from '../hooks/useAppProfile';

const AdminSettings = () => {
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
    <Layout sidebarProps={getAdminSidebarProps('settings', adminUser.fullname)} currentPathLabel="Configuración">
      <div className="max-w-2xl bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <h3 className="font-bold dark:text-white">Ajustes de la Plataforma</h3>
        </div>
        <div className="p-6 flex flex-col gap-6">
          <SettingToggle label="Mantenimiento del Sistema" description="Desactiva el acceso a todos los usuarios excepto administradores." defaultChecked={false} />
          <SettingToggle label="Registro de Nuevos Usuarios" description="Permitir que nuevos usuarios se registren desde la landing." defaultChecked={true} />
          <SettingToggle label="Notificaciones por Email" description="Enviar alertas automáticas cuando haya un nuevo match." defaultChecked={true} />
          
          <div className="pt-4 flex justify-end">
            <button className="bg-primary text-white px-6 py-2 rounded-lg font-bold text-sm shadow-md hover:bg-blue-700 transition-all">
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const SettingToggle = ({ label, description, defaultChecked }: any) => (
  <div className="flex justify-between items-center py-2">
    <div className="flex flex-col gap-1">
      <span className="text-sm font-bold dark:text-white">{label}</span>
      <span className="text-xs text-slate-500">{description}</span>
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" defaultChecked={defaultChecked} className="sr-only peer" />
      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
    </label>
  </div>
);

export default AdminSettings;
