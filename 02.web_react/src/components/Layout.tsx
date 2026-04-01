import Sidebar from './Sidebar';
import type { NavItemProps } from './Sidebar';
import Header from './Header';
import Chatbot from './Chatbot';
import { useState } from 'react';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white h-dvh overflow-hidden flex">
      <Sidebar {...sidebarProps} className="hidden md:flex" />

      {mobileMenuOpen && (
        <>
          <button
            className="fixed inset-0 bg-black/40 z-30 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Cerrar menú"
          />
          <Sidebar
            {...sidebarProps}
            className="fixed left-0 top-0 bottom-0 z-40 md:hidden"
            onNavigate={() => setMobileMenuOpen(false)}
          />
        </>
      )}

      <main className="flex-1 flex flex-col h-full overflow-hidden bg-background-light dark:bg-background-dark relative">
        <Header currentPathLabel={currentPathLabel} onMenuClick={() => setMobileMenuOpen(true)} />
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto flex flex-col gap-6 md:gap-8">
            {children}
            
            <footer className="flex flex-col md:flex-row justify-between md:items-center gap-3 text-xs text-slate-400 pb-4 mt-auto">
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
