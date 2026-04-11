import { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuthHook/useAuth';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate('/404?unauth=true', { replace: true });
    }
  }, [isAuthenticated, navigate]);


  return isAuthenticated ? <Outlet /> : null;
};

export default ProtectedRoute;

