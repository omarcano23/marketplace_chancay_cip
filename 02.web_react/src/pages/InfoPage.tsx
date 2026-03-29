import { Link, useParams } from 'react-router-dom';

type InfoContent = {
  title: string;
  intro: string;
  bullets: string[];
};

const infoContentBySlug: Record<string, InfoContent> = {
  propiedades: {
    title: 'Propiedades',
    intro: 'Conecta terrenos estratégicos con empresas e inversionistas del ecosistema portuario de Chancay.',
    bullets: [
      'Publicación de lotes con ubicación, metraje y tipo de uso.',
      'Perfilamiento de demanda según actividad logística o industrial.',
      'Visibilidad de oportunidades para propietarios y empresas.',
    ],
  },
  directorio: {
    title: 'Directorio',
    intro: 'Explora perfiles de actores clave del hub: empresas, propietarios, proveedores y profesionales.',
    bullets: [
      'Búsqueda por tipo de actor y especialidad.',
      'Perfiles con información de contacto y experiencia.',
      'Soporte para procesos de vinculación comercial.',
    ],
  },
  carreras: {
    title: 'Carreras',
    intro: 'Estamos construyendo un equipo enfocado en tecnología, analítica y desarrollo territorial.',
    bullets: [
      'Roles en producto, desarrollo, datos y operaciones.',
      'Trabajo orientado a impacto real en el ecosistema logístico.',
      'Proceso de selección por etapas y evaluación técnica.',
    ],
  },
  blog: {
    title: 'Blog',
    intro: 'Publicamos análisis y novedades del hub industrial de Chancay.',
    bullets: [
      'Tendencias de inversión y logística regional.',
      'Casos de uso de matching y datos en decisiones de ubicación.',
      'Novedades de la plataforma y próximos lanzamientos.',
    ],
  },
  privacidad: {
    title: 'Política de Privacidad',
    intro: 'Tratamos los datos con enfoque de minimización, seguridad y trazabilidad.',
    bullets: [
      'Recolectamos únicamente información necesaria para operar la plataforma.',
      'Los accesos se registran y se aplican controles por rol.',
      'Puedes solicitar actualización o eliminación de tus datos.',
    ],
  },
  terminos: {
    title: 'Términos y Condiciones',
    intro: 'Define responsabilidades de uso y límites operativos de la plataforma.',
    bullets: [
      'El usuario es responsable de la veracidad de la información registrada.',
      'La plataforma puede suspender cuentas ante uso indebido.',
      'Las funcionalidades evolucionan en fases y pueden cambiar con aviso.',
    ],
  },
  cookies: {
    title: 'Política de Cookies',
    intro: 'Usamos cookies para sesión, seguridad y experiencia de navegación.',
    bullets: [
      'Cookies esenciales para autenticación y navegación.',
      'Cookies analíticas para mejorar rendimiento y usabilidad.',
      'Configuración administrable desde el navegador.',
    ],
  },
};

const InfoPage = () => {
  const { slug } = useParams();
  const content = (slug && infoContentBySlug[slug]) || {
    title: 'Contenido no encontrado',
    intro: 'La sección solicitada no está disponible actualmente.',
    bullets: ['Puedes volver al inicio y navegar desde la landing.'],
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark px-6 py-10 md:px-10">
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 md:p-10 shadow-sm">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">{content.title}</h1>
          <p className="text-slate-600 dark:text-slate-300">{content.intro}</p>
          <ul className="list-disc list-inside text-slate-600 dark:text-slate-300 space-y-2">
            {content.bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="pt-4">
            <Link to="/" className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
              <span className="material-symbols-outlined text-base">arrow_back</span>
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPage;
