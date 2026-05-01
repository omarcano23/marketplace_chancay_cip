import { devStore, DEV_MOCK_USERS, getDevMatchesForProfile } from './devStore';

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

export const getDashboardPath = (role: AppRole) => `/dashboard/${role}`;

export const saveProfile = async (payload: Record<string, unknown>): Promise<AppUserProfile> => {
  const str = (v: unknown) => (v != null && v !== '' ? String(v) : undefined);
  const profile: AppUserProfile = {
    id: Date.now(),
    clerk_user_id: 'user-' + Date.now(),
    role: (payload.role as AppRole) || 'empresa',
    fullname: String(payload.fullname || 'Usuario'),
    email: String(payload.email || 'usuario@local.pe'),
    company_name: str(payload.company_name),
    industry: str(payload.industry),
    location: str(payload.location),
    size: str(payload.size),
    type: str(payload.type),
    services: str(payload.services),
    experience: str(payload.experience),
    activity_type: str(payload.activity_type),
    space_required: str(payload.space_required),
    energy_required: str(payload.energy_required),
  };
  devStore.setProfile(profile);
  return profile;
};

export const fetchMatchesForUser = async (_id: number): Promise<any[]> => {
  const profile = devStore.getProfile();
  if (!profile) return [];
  return getDevMatchesForProfile(profile);
};

export const fetchAllUsers = async (): Promise<any[]> => {
  const current = devStore.getProfile();
  return current
    ? [...DEV_MOCK_USERS, { ...current, created_at: new Date().toISOString() }]
    : [...DEV_MOCK_USERS];
};

export const deleteUserById = async (_id: number): Promise<void> => {
  // no-op en modo frontend
};
