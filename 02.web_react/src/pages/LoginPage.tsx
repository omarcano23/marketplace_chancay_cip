import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Chatbot from '../components/Chatbot';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:4001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Guardar sesión
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirigir según el rol
        const role = data.user.role;
        navigate(`/dashboard/${role}`);
      } else {
        setError(data.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark font-display px-4">
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#1152d4 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 z-10">
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="size-12 flex items-center justify-center bg-primary rounded-xl text-white shadow-lg shadow-primary/30">
            <span className="material-symbols-outlined text-3xl">anchor</span>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bienvenido a Chancay Hub</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Ingresa a tu portal de oportunidades</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">error</span>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Correo Electrónico</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 text-sm focus:border-primary focus:ring-primary focus:outline-none transition-all"
              placeholder="ejemplo@test.com"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña</label>
              <a href="#" className="text-xs text-primary hover:underline">¿Olvidaste tu contraseña?</a>
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 p-3 text-sm focus:border-primary focus:ring-primary focus:outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-0.5"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            ¿No tienes una cuenta? <Link to="/registro" className="text-primary font-bold hover:underline">Regístrate aquí</Link>
          </p>
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default LoginPage;
