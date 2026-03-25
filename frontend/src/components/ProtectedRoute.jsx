import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

function ProtectedRoute({ children, language }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast.info(
        language === 'hi' ? "कृपया सेवाओं का उपयोग करने के लिए लॉग इन करें" : "Please login to access this service",
        { toastId: 'auth-required' }
      );
      navigate('/login', { replace: true });
    }
  }, [user, navigate, language]);

  if (!user) return null;

  return children;
}

export default ProtectedRoute;
