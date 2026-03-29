import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardPath } from '../lib/authProfile';
import { useAppProfile } from '../hooks/useAppProfile';

const PostAuthRedirect = () => {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn, loadingProfile, profile } = useAppProfile();

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      navigate('/login');
      return;
    }

    if (loadingProfile) return;

    if (!profile) {
      navigate('/registro');
      return;
    }

    navigate(getDashboardPath(profile.role));
  }, [isLoaded, isSignedIn, loadingProfile, profile, navigate]);

  return null;
};

export default PostAuthRedirect;
