import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RequireAuth: React.FC = () => {
  const { user, isLoading, openAuthModal } = useAuth();
  const navigate = useNavigate();

  // DEBUG: Add console logs to track the state
  console.log('RequireAuth render:', { user: !!user, isLoading, userDetails: user });

  useEffect(() => {
    console.log('RequireAuth useEffect:', { user: !!user, isLoading });
    if (!isLoading && !user) {
      console.log('RequireAuth: Redirecting to home and opening auth modal');
      navigate('/');
      openAuthModal('login');
    }
  }, [user, isLoading, navigate, openAuthModal]);

  if (isLoading) {
    console.log('RequireAuth: Showing loading spinner');
    return (
      <div className="min-h-screen bg-gray-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگیری...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('RequireAuth: No user, returning null');
    return null;
  }

  console.log('RequireAuth: User authenticated, rendering Dashboard');
  return <Outlet />;
};

export default RequireAuth;