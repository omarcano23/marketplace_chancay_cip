import AuthLayout from '../components/AuthLayout';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/react';
import { saveProfile } from '../lib/authProfile';
import { useEffect } from 'react';
import { useAppProfile } from '../hooks/useAppProfile';

const RegistroPropietario = () => {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn, user } = useUser();
  const { setProfile } = useAppProfile();

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) navigate('/signup');
  }, [isLoaded, isSignedIn, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn || !user?.id) {
      navigate('/signup');
      return;
    }

    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      role: 'propietario',
      fullname: formData.get('fullname') || user.fullName || user.firstName,
      email: formData.get('email') || user.primaryEmailAddress?.emailAddress,
      phone: formData.get('phone'),
      location: formData.get('location'),
      size: formData.get('size'),
      type: formData.get('type')
    };

    try {
      const profile = await saveProfile(data);
      setProfile(profile);
      navigate('/dashboard/propietario');
    } catch (error) {
      console.error('Error registering:', error);
      alert('Error al conectar con el servidor');
    }
  };

  if (!isLoaded || !isSignedIn) return null;

  return (
    <AuthLayout 
      title="Registro de Propietario de Terreno" 
      description="Complete el formulario con la información de su propiedad para unirse a la red de oportunidades de Chancay Hub."
      icon="landscape"
      roleTag="Perfil Propietario"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="flex flex-col gap-5">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
            Información Personal
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="fullname">Nombre Completo</label>
              <input className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white p-3 text-sm focus:border-primary focus:ring-primary focus:outline-none transition-colors" id="fullname" name="fullname" placeholder="Ingrese su nombre completo" type="text" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="email">Correo Electrónico</label>
              <input className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white p-3 text-sm focus:border-primary focus:ring-primary focus:outline-none transition-colors" id="email" name="email" placeholder="ejemplo@correo.com" type="email" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="phone">Teléfono Móvil</label>
              <input className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white p-3 text-sm focus:border-primary focus:ring-primary focus:outline-none transition-colors" id="phone" name="phone" placeholder="+51 999 999 999" type="tel" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
            Detalles del Terreno
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="location">Ubicación / Dirección</label>
              <div className="relative flex items-center">
                <input className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white p-3 text-sm focus:border-primary focus:ring-primary focus:outline-none transition-colors pr-10" id="location" name="location" placeholder="Ej. Carretera Panamericana Norte Km 80, Chancay" type="text" />
                <button type="button" className="absolute right-0 top-0 bottom-0 px-3 flex items-center justify-center text-gray-500 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-r-lg">
                  <span className="material-symbols-outlined text-xl">location_on</span>
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="size">Área Total</label>
              <div className="relative">
                <input className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white p-3 pr-10 text-sm focus:border-primary focus:ring-primary focus:outline-none transition-colors" id="size" name="size" placeholder="0" type="number" />
                <span className="absolute right-3 top-3 text-gray-500 text-sm">m²</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="type">Tipo de Terreno</label>
              <select className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white p-3 text-sm focus:border-primary focus:ring-primary focus:outline-none transition-colors appearance-none" id="type" name="type">
                <option disabled defaultValue="">Seleccione una opción</option>
                <option value="industrial">Industrial</option>
                <option value="logistico">Logístico</option>
                <option value="mixto">Mixto</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button type="button" className="group flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-transparent border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-white text-sm font-bold leading-normal transition-colors">
              <span className="material-symbols-outlined text-lg">add</span>
              <span className="truncate">Agregar Otro Terreno</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">
            Documentación Legal (Opcional)
          </h3>
          <div className="flex justify-center rounded-lg border border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-6 py-10 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer group">
            <div className="text-center">
              <span className="material-symbols-outlined mx-auto h-12 w-12 text-gray-400 group-hover:text-primary transition-colors">cloud_upload</span>
              <div className="mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-400 justify-center">
                <label className="relative cursor-pointer rounded-md bg-transparent font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-blue-700" htmlFor="file-upload">
                  <span>Subir archivo</span>
                  <input className="sr-only" id="file-upload" name="file-upload" type="file" />
                </label>
                <p className="pl-1">o arrastrar y soltar</p>
              </div>
              <p className="text-xs leading-5 text-gray-500 dark:text-gray-500 mt-2">PDF, JPG o PNG hasta 10MB (Partida Registral, Título, etc.)</p>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button type="submit" className="w-full flex items-center justify-center rounded-lg bg-primary hover:bg-blue-700 text-white font-bold text-base h-12 shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5">
            Registrar Terreno
            <span className="material-symbols-outlined ml-2 text-xl">arrow_forward</span>
          </button>
          <p className="mt-4 text-center text-xs text-gray-500 dark:text-gray-400">
            Al registrarte, aceptas nuestros <a className="underline hover:text-primary" href="#">Términos y Condiciones</a> y <a className="underline hover:text-primary" href="#">Política de Privacidad</a>.
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default RegistroPropietario;
