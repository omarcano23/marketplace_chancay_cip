import type { NavItemProps } from './Sidebar';

export const getAdminSidebarProps = (activeTab: string, userName: string) => ({
  role: 'Admin' as const,
  userName: userName,
  userCompany: 'Chancay Management',
  menuItems: [
    { icon: 'admin_panel_settings', label: 'Dashboard', active: activeTab === 'dashboard', to: '/dashboard/admin' },
    { icon: 'supervised_user_circle', label: 'Usuarios', active: activeTab === 'users', to: '/dashboard/admin/users' },
    { icon: 'analytics', label: 'Métricas', active: activeTab === 'metrics', to: '/dashboard/admin/metrics' },
    { icon: 'shield_person', label: 'Seguridad', active: activeTab === 'security', to: '/dashboard/admin/security' },
    { icon: 'settings', label: 'Configuración', active: activeTab === 'settings', to: '/dashboard/admin/settings' },
  ] as NavItemProps[]
});
