import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/react";

interface HeaderProps {
  currentPathLabel: string;
}

const Header: React.FC<HeaderProps> = ({ currentPathLabel }) => {
  return (
    <header className="h-20 bg-white dark:bg-[#1a202c] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 flex-shrink-0 z-10">
      <div className="flex items-center gap-2">
        <span className="text-slate-400 text-sm font-medium">Dashboard</span>
        <span className="text-slate-300 text-sm">/</span>
        <span className="text-primary font-semibold text-sm bg-primary/10 px-2 py-1 rounded">{currentPathLabel}</span>
      </div>
      
      <div className="flex-1 max-w-lg mx-8">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-slate-400 group-focus-within:text-primary">search</span>
          </div>
          <input 
            className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-slate-100 dark:bg-slate-800 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-slate-900 dark:text-white" 
            placeholder="Buscar empresas, cargas o servicios..." 
            type="text"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white dark:border-[#1a202c]"></span>
        </button>
        <button className="p-2 text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          <span className="material-symbols-outlined">help</span>
        </button>
        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-1"></div>
        
        <Show when="signed-out">
          <div className="flex items-center gap-3">
            <SignInButton mode="modal">
              <button className="text-sm font-medium text-slate-600 hover:text-primary transition-colors">Iniciar sesión</button>
            </SignInButton>
            <SignUpButton mode="modal" forceRedirectUrl="/registro" fallbackRedirectUrl="/registro">
              <button className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">Registrarse</button>
            </SignUpButton>
          </div>
        </Show>
        
        <Show when="signed-in">
          <div className="flex items-center gap-3">
            <UserButton />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Mi Perfil</span>
          </div>
        </Show>
      </div>
    </header>
  );
};

export default Header;
