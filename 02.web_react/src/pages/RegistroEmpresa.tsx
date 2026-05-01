import AuthLayout from '../components/AuthLayout';
import { useNavigate } from 'react-router-dom';
import { saveProfile } from '../lib/authProfile';
import { useAppProfile } from '../hooks/useAppProfile';

const RegistroEmpresa = () => {
  const navigate = useNavigate();
  const { setProfile } = useAppProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const companyName = String(formData.get('company_name') || '');

    const profile = await saveProfile({
      role: 'empresa',
      fullname: companyName || 'Empresa',
      email: `contacto@${companyName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'empresa'}.pe`,
      company_name: companyName,
      tax_id: formData.get('tax_id'),
      industry: formData.get('industry'),
      activity_type: formData.get('activity_type'),
      space_required: formData.get('space_required'),
      energy_required: formData.get('energy_required'),
    });

    setProfile(profile);
    navigate('/dashboard/empresa');
  };

  return (
    <AuthLayout
      title="Registro de Empresa Inversionista"
      description="Complete el perfil de su organización para acceder a oportunidades de inversión, terrenos industriales y alianzas estratégicas en el Puerto de Chancay."
      maxWidth="max-w-[960px]"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3 pb-2 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-center size-8 rounded-full bg-primary/10 dark:bg-primary/20 text-primary font-bold text-sm">1</div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Datos de la Empresa</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300" htmlFor="company_name">Razón Social / Nombre de la Empresa <span className="text-red-500">*</span></label>
              <input className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 p-2.5 text-sm text-gray-900 dark:text-white focus:border-primary focus:ring-primary" id="company_name" name="company_name" placeholder="Ej. Inversiones del Pacífico S.A.C." required type="text" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300" htmlFor="tax_id">RUC / Tax ID <span className="text-red-500">*</span></label>
              <input className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 p-2.5 text-sm text-gray-900 dark:text-white focus:border-primary focus:ring-primary" id="tax_id" name="tax_id" placeholder="20123456789" required type="text" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300" htmlFor="industry">Sector / Industria <span className="text-red-500">*</span></label>
              <select className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 p-2.5 text-sm text-gray-900 dark:text-white focus:border-primary focus:ring-primary" id="industry" name="industry" required>
                <option value="">Seleccione una industria</option>
                <option value="logistica">Logística y Transporte</option>
                <option value="manufactura">Manufactura Industrial</option>
                <option value="agroindustrial">Agroindustrial</option>
                <option value="energia">Energía y Minas</option>
                <option value="tecnologia">Tecnología e Innovación</option>
                <option value="inmobiliaria">Desarrollo Inmobiliario</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3 pb-2 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-center size-8 rounded-full bg-primary/10 dark:bg-primary/20 text-primary font-bold text-sm">2</div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Intereses de Inversión</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300" htmlFor="activity_type">Tipo de actividad</label>
              <input className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 p-2.5 text-sm text-gray-900 dark:text-white focus:border-primary focus:ring-primary" id="activity_type" name="activity_type" placeholder="Ej. Logística de importación, Manufactura de plásticos, etc." type="text" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300" htmlFor="space_required">Espacio requerido en m2</label>
              <input className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 p-2.5 text-sm text-gray-900 dark:text-white focus:border-primary focus:ring-primary" id="space_required" name="space_required" placeholder="Ej. 5000" type="number" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300" htmlFor="energy_required">Energía requerida en kw</label>
              <input className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 p-2.5 text-sm text-gray-900 dark:text-white focus:border-primary focus:ring-primary" id="energy_required" name="energy_required" placeholder="Ej. 200" type="number" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100 dark:border-gray-700 mt-2">
          <button type="button" onClick={() => navigate('/registro')} className="px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Cancelar
          </button>
          <button type="submit" className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2">
            Registrar Empresa
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default RegistroEmpresa;
