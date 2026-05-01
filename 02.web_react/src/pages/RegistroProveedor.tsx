import AuthLayout from '../components/AuthLayout';
import { useNavigate } from 'react-router-dom';
import { saveProfile } from '../lib/authProfile';
import { useAppProfile } from '../hooks/useAppProfile';

const RegistroProveedor = () => {
  const navigate = useNavigate();
  const { setProfile } = useAppProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const fullname = String(formData.get('fullname') || '');

    const profile = await saveProfile({
      role: 'proveedor',
      fullname: fullname || 'Proveedor',
      email: `contacto@${fullname.toLowerCase().replace(/[^a-z0-9]/g, '') || 'proveedor'}.pe`,
      industry: formData.get('profession'),
      services: formData.get('services'),
      experience: formData.get('experience'),
    });

    setProfile(profile);
    navigate('/dashboard/proveedor');
  };

  return (
    <AuthLayout
      title="Registro de Proveedor / Profesional"
      description="Completa tu perfil profesional para conectar con oportunidades de desarrollo e inversión en el Puerto de Chancay."
      icon="engineering"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="flex flex-col gap-5">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3">
            Datos Profesionales
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nombre Completo</label>
              <input name="fullname" required className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary focus:ring-primary shadow-sm p-2.5" placeholder="Ej. Juan Pérez" type="text" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Profesión / Especialidad</label>
              <input name="profession" className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary focus:ring-primary shadow-sm p-2.5" placeholder="Ej. Ingeniero Civil" type="text" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Años de Experiencia</label>
              <input name="experience" className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary focus:ring-primary shadow-sm p-2.5" placeholder="Ej. 10" type="number" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3">
            Servicios Ofrecidos
          </h3>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Descripción de Servicios</label>
            <textarea name="services" className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-primary focus:ring-primary shadow-sm p-2.5" placeholder="Describe los servicios técnicos, consultoría o estudios que ofreces..." rows={4}></textarea>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-3">
            Certificaciones y CV
          </h3>
          <div className="mt-1 flex justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 px-6 py-10 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer group">
            <div className="text-center">
              <span className="material-symbols-outlined text-gray-400 text-5xl mb-3 group-hover:text-primary transition-colors">cloud_upload</span>
              <div className="mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-400 justify-center">
                <label className="relative cursor-pointer rounded-md bg-transparent font-semibold text-primary focus-within:outline-none hover:text-primary-dark hover:underline">
                  <span>Sube un archivo</span>
                  <input className="sr-only" id="file-upload" name="file-upload" type="file" />
                </label>
                <p className="pl-1">o arrastra y suelta</p>
              </div>
              <p className="text-xs leading-5 text-gray-500 dark:text-gray-500">PDF, DOCX hasta 10MB</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-100 dark:border-gray-700 mt-2">
          <button type="button" onClick={() => navigate('/registro')} className="group flex min-w-[100px] cursor-pointer items-center justify-center gap-2 rounded-lg h-10 px-4 bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm font-bold transition-colors">
            <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
            <span>Atrás</span>
          </button>
          <button type="submit" className="flex min-w-[180px] cursor-pointer items-center justify-center rounded-lg h-11 px-6 bg-primary hover:bg-primary-dark text-white text-base font-bold shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">
            <span>Completar Registro</span>
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default RegistroProveedor;
