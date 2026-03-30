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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error('Missing VITE_API_BASE_URL. Define it in your deployment environment variables.');
}

export const getDashboardPath = (role: AppRole) => `/dashboard/${role}`;

export const fetchProfileByClerkId = async (clerkUserId: string): Promise<AppUserProfile | null> => {
  const response = await fetch(`${API_BASE_URL}/api/users/by-clerk/${encodeURIComponent(clerkUserId)}`);
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error('No se pudo recuperar el perfil del usuario');
  }

  const data = await response.json();
  return data.data ?? null;
};

export const saveProfile = async (payload: Record<string, unknown>): Promise<AppUserProfile> => {
  const response = await fetch(`${API_BASE_URL}/api/profile`, {
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
  const response = await fetch(`${API_BASE_URL}/api/matches/${id}`);
  if (!response.ok) return [];
  const data = await response.json();
  return data.message === 'success' ? data.data : [];
};

export const fetchAllUsers = async (): Promise<any[]> => {
  const response = await fetch(`${API_BASE_URL}/api/users`);
  if (!response.ok) return [];
  const data = await response.json();
  return data.data || [];
};

export const deleteUserById = async (id: number): Promise<void> => {
  await fetch(`${API_BASE_URL}/api/users/${id}`, { method: 'DELETE' });
};
