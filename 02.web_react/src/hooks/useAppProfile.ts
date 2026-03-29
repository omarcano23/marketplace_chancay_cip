import { useUser } from '@clerk/react';
import { useEffect, useState } from 'react';
import { fetchProfileByClerkId, type AppUserProfile } from '../lib/authProfile';

const profileCache = new Map<string, AppUserProfile | null>();

export const useAppProfile = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [profile, setProfileState] = useState<AppUserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!isLoaded) return;

      if (!isSignedIn || !user?.id) {
        setProfileState(null);
        setLoadingProfile(false);
        return;
      }

      const cachedProfile = profileCache.get(user.id);
      if (cachedProfile !== undefined) {
        setProfileState(cachedProfile);
        setLoadingProfile(false);
        return;
      }

      setLoadingProfile(true);
      setError(null);
      try {
        const data = await fetchProfileByClerkId(user.id);
        profileCache.set(user.id, data);
        setProfileState(data);
      } catch (err: any) {
        setError(err?.message || 'Error cargando perfil');
      } finally {
        setLoadingProfile(false);
      }
    };

    load();
  }, [isLoaded, isSignedIn, user?.id]);

  const setProfile = (nextProfile: AppUserProfile | null) => {
    if (user?.id) {
      profileCache.set(user.id, nextProfile);
    }
    setProfileState(nextProfile);
  };

  return {
    isLoaded,
    isSignedIn,
    clerkUser: user,
    profile,
    loadingProfile,
    error,
    setProfile,
  };
};
