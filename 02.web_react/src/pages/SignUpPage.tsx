import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/registro', { replace: true });
  }, [navigate]);

  return null;
};

export default SignUpPage;
