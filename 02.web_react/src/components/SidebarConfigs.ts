import type { NavItemProps } from './Sidebar';

export const getEmpresaSidebarProps = (activeTab: string, userName: string, companyName?: string) => ({
  role: 'Empresa' as const,
  userName,
  userCompany: companyName,
  menuItems: [
    { icon: 'link', label: 'Vinculación', active: activeTab === 'vinculacion', to: '/dashboard/empresa' },
    { icon: 'engineering', label: 'Factibilidad Técnica', active: activeTab === 'tecnica', to: '/dashboard/empresa/technical' },
    { icon: 'gavel', label: 'Legal y Financiero', active: activeTab === 'legal', to: '/dashboard/empresa/legal' },
    { icon: 'science', label: 'Simulaciones', active: activeTab === 'simulaciones', to: '/dashboard/empresa/simulations' },
    { icon: 'insights', label: 'Insights Comerciales', active: activeTab === 'insights', to: '/dashboard/empresa/insights' },
  ] as NavItemProps[]
});

export const getPropietarioSidebarProps = (activeTab: string, userName: string, companyName?: string) => ({
  role: 'Propietario' as const,
  userName,
  userCompany: companyName || 'Propietario Independiente',
  menuItems: [
    { icon: 'landscape', label: 'Mis Terrenos', active: activeTab === 'terrenos', to: '/dashboard/propietario' },
    { icon: 'real_estate_agent', label: 'Oportunidades', active: activeTab === 'oportunidades', to: '/dashboard/propietario/opportunities' },
    { icon: 'folder_shared', label: 'Documentación', active: activeTab === 'documentacion', to: '/dashboard/propietario/docs' },
    { icon: 'analytics', label: 'Rendimiento', active: activeTab === 'rendimiento', to: '/dashboard/propietario/stats' },
    { icon: 'help', label: 'Consultas', active: activeTab === 'consultas', to: '/dashboard/propietario/queries' },
  ] as NavItemProps[]
});

export const getProveedorSidebarProps = (activeTab: string, userName: string, companyName?: string) => ({
  role: 'Proveedor' as const,
  userName,
  userCompany: companyName,
  menuItems: [
    { icon: 'engineering', label: 'Proyectos', active: activeTab === 'proyectos', to: '/dashboard/proveedor' },
    { icon: 'work', label: 'Oportunidades', active: activeTab === 'oportunidades', to: '/dashboard/proveedor/opportunities' },
    { icon: 'gavel', label: 'Licitaciones', active: activeTab === 'licitaciones', to: '/dashboard/proveedor/tenders' },
    { icon: 'account_balance_wallet', label: 'Finanzas', active: activeTab === 'finanzas', to: '/dashboard/proveedor/finance' },
  ] as NavItemProps[]
});
