import { Link } from 'react-router-dom';

interface NavItemProps {
  icon: string;
  label: string;
  active?: boolean;
  to?: string;
  onClick?: () => void;
}

const NavItem = ({ icon, label, active = false, to = "#", onClick }: NavItemProps) => (
  <Link 
    className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all group ${
      active ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`} 
    to={to}
    onClick={onClick}
  >
    <span className={`material-symbols-outlined ${active ? 'icon-filled' : 'group-hover:text-white transition-colors'}`}>
      {icon}
    </span>
    <span className="text-sm font-medium">{label}</span>
  </Link>
);

interface SidebarProps {
  role: 'Empresa' | 'Propietario' | 'Proveedor' | 'Admin';
  userEmail?: string;
  userName: string;
  userCompany?: string;
  menuItems: NavItemProps[];
  className?: string;
  onNavigate?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ role, userName, userCompany, menuItems, className = '', onNavigate }) => {
  return (
    <aside className={`w-72 bg-sidebar-bg flex flex-col h-full flex-shrink-0 text-white shadow-xl z-20 transition-all duration-300 ${className}`}>
      <Link to="/" onClick={onNavigate} className="h-20 flex items-center px-6 gap-3 border-b border-white/10 hover:bg-white/5 transition-colors">
        <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
          <span className="material-symbols-outlined text-white">anchor</span>
        </div>
        <div className="flex flex-col">
          <h1 className="text-base font-bold leading-none tracking-tight">Chancay Hub</h1>
          <p className="text-xs text-slate-400 mt-1">Portal {role}s</p>
        </div>
      </Link>
...

      <nav className="flex-1 overflow-y-auto py-6 px-3 flex flex-col gap-1">
        <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Plataforma</p>
        {menuItems.map((item, index) => (
          <NavItem key={index} {...item} onClick={onNavigate} />
        ))}
      </nav>

      <div className="p-4 border-t border-white/10 bg-black/20">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-slate-700 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAWQeBoYG1w65Qm0xQqknXN4aWzUjMBluhpDNOHq_EscbwIPFBCUSvqwMTvUGQN4VOQtXh0wEmp_0Eonuz8NbS-FngalMoixS2_bYY6A89eiilZA5kosoL2b7yJe4w4EZIv7EITCq12Ta0dPHF-HwTOcuieTY4YGnUvtlhWMUgDxvswfWMHu-6eN_pbrntobJkD_WiyO6y9kIOaF3zPCWHmE4WdP_m9da7CmxFiw56kw70v_p6OF7zjLi-UkqsdplpD8eil9rdv9CRy')" }}></div>
          <div className="flex flex-col flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{userName}</p>
            <p className="text-xs text-slate-400 truncate">{userCompany}</p>
          </div>
          <button className="text-slate-400 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
export type { NavItemProps };
