// components/UserProtectedRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';


import { decodeToken, getToken, isTokenValid } from '../../Utils/token';
import Loader from '../../Loader/Loader';

const UserProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const location = useLocation();
  const redirectUrlSet = useRef(false);


  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = getToken();

        // First check - token exists and valid
        const tokenValid = token && isTokenValid(token);
        if (!tokenValid) {
          setIsAuthorized(false);
          setLoading(false);
          return;
        }

        // Second check - Redux state matches token
        const decoded = decodeToken(token);
        const userValid =
          (user && user.id === decoded?.userId) || isAuthenticated;

        setIsAuthorized(userValid);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [user, isAuthenticated]);

  useEffect(() => {
    if (!loading && !isAuthorized && !redirectUrlSet.current) {
      localStorage.setItem('redirectUrl', location.pathname);
      redirectUrlSet.current = true;
    }

    if (isAuthorized) {
      redirectUrlSet.current = false;
    }
  }, [loading, isAuthorized, location.pathname]);

  if (loading) return <Loader variant="full" message="Checking user..." />;
  if (!isAuthorized) return <Navigate to="/login" replace />;
  return children;
};

export default UserProtectedRoute;
