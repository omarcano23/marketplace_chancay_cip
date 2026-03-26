import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { getEmpresaSidebarProps, getPropietarioSidebarProps, getProveedorSidebarProps } from '../components/SidebarConfigs';

interface GenericSubPageProps {
  tab: string;
  role: 'empresa' | 'propietario' | 'proveedor';
  title: string;
}

const GenericSubPage: React.FC<GenericSubPageProps> = ({ tab, role, title }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(savedUser);
    if (parsedUser.role !== role) {
      navigate('/');
      return;
    }
    setUser(parsedUser);
  }, [navigate, role]);

  if (!user) return null;

  let sidebarProps;
  if (role === 'empresa') sidebarProps = getEmpresaSidebarProps(tab, user.fullname, user.company_name);
  else if (role === 'propietario') sidebarProps = getPropietarioSidebarProps(tab, user.fullname, user.company_name);
  else sidebarProps = getProveedorSidebarProps(tab, user.fullname, user.company_name);

  return (
    <Layout sidebarProps={sidebarProps} currentPathLabel={title}>
      <div className="flex flex-col gap-6">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm min-h-[400px] flex flex-col items-center justify-center text-center">
          <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6">
            <span className="material-symbols-outlined text-4xl">construction</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Sección de {title}</h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-md">
            Esta sección para el perfil de <strong>{user.fullname}</strong> está siendo sincronizada con los datos del Puerto de Chancay. Pronto podrás ver reportes detallados aquí.
          </p>
          <button 
            onClick={() => navigate(-1)}
            className="mt-8 px-6 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-200 transition-colors"
          >
            Volver al Panel Principal
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default GenericSubPage;
