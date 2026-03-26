import Sidebar from './Sidebar';
import type { NavItemProps } from './Sidebar';
import Header from './Header';
import Chatbot from './Chatbot';

interface LayoutProps {
  children: React.ReactNode;
  sidebarProps: {
    role: 'Empresa' | 'Propietario' | 'Proveedor' | 'Admin';
    userName: string;
    userCompany?: string;
    menuItems: NavItemProps[];
  };
  currentPathLabel: string;
}

const Layout: React.FC<LayoutProps> = ({ children, sidebarProps, currentPathLabel }) => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white h-screen overflow-hidden flex">
      <Sidebar {...sidebarProps} />
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-background-light dark:bg-background-dark relative">
        <Header currentPathLabel={currentPathLabel} />
        <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto flex flex-col gap-8">
            {children}
            
            <footer className="flex justify-between items-center text-xs text-slate-400 pb-4 mt-auto">
              <p>© 2024 Chancay Hub. Todos los derechos reservados.</p>
              <div className="flex gap-4">
                <a className="hover:text-slate-600" href="#">Privacidad</a>
                <a className="hover:text-slate-600" href="#">Términos</a>
              </div>
            </footer>
          </div>
        </div>
      </main>
      <Chatbot />
    </div>
  );
};

export default Layout;
