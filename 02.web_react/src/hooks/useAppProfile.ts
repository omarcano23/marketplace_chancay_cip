import { useEffect, useState } from 'react';
import { type AppUserProfile } from '../lib/authProfile';
import { devStore } from '../lib/devStore';

export const useAppProfile = () => {
  const [profile, setProfileState] = useState<AppUserProfile | null>(devStore.getProfile());

  useEffect(() => {
    return devStore.subscribe(() => setProfileState(devStore.getProfile()));
  }, []);

  const setProfile = (nextProfile: AppUserProfile | null) => {
    devStore.setProfile(nextProfile);
    setProfileState(nextProfile);
  };

  return {
    isLoaded: true,
    isSignedIn: true as const,
    clerkUser: null,
    profile,
    loadingProfile: false,
    error: null,
    setProfile,
  };
};
