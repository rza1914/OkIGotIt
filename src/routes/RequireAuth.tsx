import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RequireAuth: React.FC = () => {
  const { user, openAuthModal } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
      openAuthModal('login');
    }
  }, [user, navigate, openAuthModal]);

  if (!user) {
    return null;
  }

  return <Outlet />;
};

export default RequireAuth;