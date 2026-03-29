import { useUser } from '@clerk/react';
import { useEffect, useState } from 'react';
import { fetchProfileByClerkId, type AppUserProfile } from '../lib/authProfile';

export const useAppProfile = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [profile, setProfile] = useState<AppUserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!isLoaded) return;

      if (!isSignedIn || !user?.id) {
        setProfile(null);
        setLoadingProfile(false);
        return;
      }

      setLoadingProfile(true);
      setError(null);
      try {
        const data = await fetchProfileByClerkId(user.id);
        setProfile(data);
      } catch (err: any) {
        setError(err?.message || 'Error cargando perfil');
      } finally {
        setLoadingProfile(false);
      }
    };

    load();
  }, [isLoaded, isSignedIn, user?.id]);

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
