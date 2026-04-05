export type AppRole = 'admin' | 'empresa' | 'propietario' | 'proveedor';

export interface AppUserProfile {
  id: number;
  clerk_user_id: string;
  role: AppRole;
  fullname: string;
  email: string;
  company_name?: string;
  industry?: string;
  location?: string;
  size?: string;
  type?: string;
  services?: string;
  experience?: string;
  activity_type?: string;
  space_required?: string;
  energy_required?: string;
}

const DEFAULT_PROD_API_BASE_URL = 'https://deep-data-api-chancayhub.kguo1f.easypanel.host';
const rawApiBaseUrl = String(import.meta.env.VITE_API_BASE_URL || '').trim();
const isLoopbackUrl = /(^https?:\/\/)?(localhost|127\.0\.0\.1)(:\d+)?/i.test(rawApiBaseUrl);

const API_BASE_URL = (
  import.meta.env.PROD
    ? rawApiBaseUrl && !isLoopbackUrl
      ? rawApiBaseUrl
      : DEFAULT_PROD_API_BASE_URL
    : rawApiBaseUrl || 'http://localhost:4001'
).replace(/\/$/, '');

const getClerkBearerToken = async (): Promise<string | null> => {
  if (typeof window === 'undefined') return null;

  const clerk = (window as any).Clerk;
  if (!clerk?.session) return null;

  try {
    const token = await clerk.session.getToken();
    return token || null;
  } catch {
    return null;
  }
};

const apiFetch = async (path: string, init: RequestInit = {}) => {
  const headers = new Headers(init.headers || {});
  const token = await getClerkBearerToken();

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
  });
};

export const getDashboardPath = (role: AppRole) => `/dashboard/${role}`;

export const fetchProfileByClerkId = async (clerkUserId: string): Promise<AppUserProfile | null> => {
  const response = await apiFetch(`/api/users/by-clerk/${encodeURIComponent(clerkUserId)}`);
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error('No se pudo recuperar el perfil del usuario');
  }

  const data = await response.json();
  return data.data ?? null;
};

export const saveProfile = async (payload: Record<string, unknown>): Promise<AppUserProfile> => {
  const response = await apiFetch('/api/profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'No se pudo guardar el perfil');
  }

  const data = await response.json();
  return data.data;
};

export const fetchMatchesForUser = async (id: number): Promise<any[]> => {
  const response = await apiFetch(`/api/matches/${id}`);
  if (!response.ok) return [];
  const data = await response.json();
  return data.message === 'success' ? data.data : [];
};

export const fetchAllUsers = async (): Promise<any[]> => {
  const response = await apiFetch('/api/users');
  if (!response.ok) return [];
  const data = await response.json();
  return data.data || [];
};

export const deleteUserById = async (id: number): Promise<void> => {
  await apiFetch(`/api/users/${id}`, { method: 'DELETE' });
};
