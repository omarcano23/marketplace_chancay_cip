import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminSidebarProps } from '../components/AdminSidebarConfig';
import { deleteUserById, fetchAllUsers } from '../lib/authProfile';
import { useAppProfile } from '../hooks/useAppProfile';

const AdminUsers = () => {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn, loadingProfile, profile: adminUser } = useAppProfile();
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');

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
    fetchUsers();
  }, [isLoaded, isSignedIn, loadingProfile, adminUser, navigate]);

  const fetchUsers = async () => {
    const users = await fetchAllUsers();
    setAllUsers(users);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Eliminar este usuario?')) {
      await deleteUserById(id);
      fetchUsers();
    }
  };

  if (!isLoaded || loadingProfile || !adminUser) return null;

  const filtered = filter === 'all' ? allUsers : allUsers.filter(u => u.role === filter);

  return (
    <Layout sidebarProps={getAdminSidebarProps('users', adminUser.fullname)} currentPathLabel="Gestión de Usuarios">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <h3 className="font-bold dark:text-white">Directorio del Hub ({filtered.length})</h3>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="text-sm border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-lg p-2 focus:ring-primary focus:border-primary"
          >
            <option value="all">Todos los roles</option>
            <option value="empresa">Empresas</option>
            <option value="propietario">Propietarios</option>
            <option value="proveedor">Proveedores</option>
          </select>
        </div>

        <div className="md:hidden p-4 flex flex-col gap-3">
          {filtered.map(u => (
            <div key={u.id} className="rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bold dark:text-white truncate">{u.fullname}</p>
                  <p className="text-xs text-slate-500 truncate">{u.email}</p>
                </div>
                <button onClick={() => handleDelete(u.id)} className="text-red-500 hover:text-red-700 p-1">
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase border border-slate-200 dark:border-slate-600 dark:text-slate-300">{u.role}</span>
                <span className="text-xs text-slate-500 truncate text-right">{u.company_name || u.location || u.services || 'Sin detalle'}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left min-w-[760px]">
          <thead className="bg-slate-50 dark:bg-slate-900/50 text-[11px] uppercase font-bold text-slate-500 tracking-widest">
            <tr>
              <th className="px-6 py-4">Usuario</th>
              <th className="px-6 py-4">Rol</th>
              <th className="px-6 py-4">Detalles</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
            {filtered.map(u => (
              <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold dark:text-white">{u.fullname}</span>
                    <span className="text-xs text-slate-500">{u.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase border border-slate-200 dark:border-slate-600 dark:text-slate-300">{u.role}</span>
                </td>
                <td className="px-6 py-4 text-xs dark:text-slate-400">
                  {u.company_name || u.location || u.services}
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDelete(u.id)} className="text-red-500 hover:text-red-700 p-2">
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </Layout>
  );
};

export default AdminUsers;
