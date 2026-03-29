import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SelectionPage from './pages/SelectionPage';
import DashboardEmpresa from './pages/DashboardEmpresa';
import DashboardPropietario from './pages/DashboardPropietario';
import DashboardProveedor from './pages/DashboardProveedor';
import DashboardAdmin from './pages/DashboardAdmin';
import AdminUsers from './pages/AdminUsers';
import AdminMetrics from './pages/AdminMetrics';
import AdminSecurity from './pages/AdminSecurity';
import AdminSettings from './pages/AdminSettings';
import GenericSubPage from './pages/GenericSubPage';
import InteractiveMap from './pages/InteractiveMap';
import RegistroPropietario from './pages/RegistroPropietario';
import RegistroEmpresa from './pages/RegistroEmpresa';
import RegistroProveedor from './pages/RegistroProveedor';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import PostAuthRedirect from './pages/PostAuthRedirect';
import InfoPage from './pages/InfoPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login/*" element={<LoginPage />} />
        <Route path="/signup/*" element={<SignUpPage />} />
        <Route path="/post-auth" element={<PostAuthRedirect />} />
        <Route path="/info/:slug" element={<InfoPage />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/mapa" element={<InteractiveMap />} />
        <Route path="/registro" element={<SelectionPage />} />
        <Route path="/registro/propietario" element={<RegistroPropietario />} />
        <Route path="/registro/empresa" element={<RegistroEmpresa />} />
        <Route path="/registro/proveedor" element={<RegistroProveedor />} />
        
        {/* Empresa Routes */}
        <Route path="/dashboard/empresa" element={<DashboardEmpresa />} />
        <Route path="/dashboard/empresa/technical" element={<GenericSubPage tab="tecnica" role="empresa" title="Factibilidad Técnica" />} />
        <Route path="/dashboard/empresa/legal" element={<GenericSubPage tab="legal" role="empresa" title="Legal y Financiero" />} />
        <Route path="/dashboard/empresa/simulations" element={<GenericSubPage tab="simulaciones" role="empresa" title="Simulaciones" />} />
        <Route path="/dashboard/empresa/insights" element={<GenericSubPage tab="insights" role="empresa" title="Insights Comerciales" />} />

        {/* Propietario Routes */}
        <Route path="/dashboard/propietario" element={<DashboardPropietario />} />
        <Route path="/dashboard/propietario/opportunities" element={<GenericSubPage tab="oportunidades" role="propietario" title="Oportunidades" />} />
        <Route path="/dashboard/propietario/docs" element={<GenericSubPage tab="documentacion" role="propietario" title="Documentación" />} />
        <Route path="/dashboard/propietario/stats" element={<GenericSubPage tab="rendimiento" role="propietario" title="Rendimiento" />} />
        <Route path="/dashboard/propietario/queries" element={<GenericSubPage tab="consultas" role="propietario" title="Consultas" />} />

        {/* Proveedor Routes */}
        <Route path="/dashboard/proveedor" element={<DashboardProveedor />} />
        <Route path="/dashboard/proveedor/opportunities" element={<GenericSubPage tab="oportunidades" role="proveedor" title="Oportunidades" />} />
        <Route path="/dashboard/proveedor/tenders" element={<GenericSubPage tab="licitaciones" role="proveedor" title="Licitaciones" />} />
        <Route path="/dashboard/proveedor/finance" element={<GenericSubPage tab="finanzas" role="proveedor" title="Finanzas" />} />
        
        {/* Admin Routes */}
        <Route path="/dashboard/admin" element={<DashboardAdmin />} />
        <Route path="/dashboard/admin/users" element={<AdminUsers />} />
        <Route path="/dashboard/admin/metrics" element={<AdminMetrics />} />
        <Route path="/dashboard/admin/security" element={<AdminSecurity />} />
        <Route path="/dashboard/admin/settings" element={<AdminSettings />} />
      </Routes>
    </Router>
  );
}

export default App;
