import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * GuestRoute – the inverse of ProtectedRoute.
 * If the user is already logged in, redirect them to their dashboard.
 * Only unauthenticated (guest) users can access the wrapped page.
 */
function GuestRoute({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(`/${user.username}`, { replace: true });
    }
  }, [user, navigate]);

  if (user) return null;

  return children;
}

export default GuestRoute;
