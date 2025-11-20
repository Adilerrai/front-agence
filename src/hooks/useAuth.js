import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authService } from '@/services/authService';
import { setUser, setToken } from '@/store/api/auth/authSlice';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const checkAuth = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (!accessToken && !refreshToken) {
        throw new Error('No tokens found');
      }

      if (!accessToken && refreshToken) {
        // Try to refresh the token
        const response = await authService.refreshToken(refreshToken);
        
        if (response.access_token) {
          localStorage.setItem('accessToken', response.access_token);
          localStorage.setItem('refreshToken', response.refresh_token);
          
          // Update Redux store
          dispatch(setToken(response.access_token));
          const userInfo = JSON.parse(localStorage.getItem('userInfo'));
          if (userInfo) {
            dispatch(setUser(userInfo));
          }
          
          setIsAuthenticated(true);
        } else {
          throw new Error('Token refresh failed');
        }
      } else {
        // We have an access token, verify if user info exists
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
          dispatch(setUser(userInfo));
          dispatch(setToken(accessToken));
          setIsAuthenticated(true);
        } else {
          throw new Error('User info not found');
        }
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
      // Clear everything and redirect to login
      authService.logout();
      setIsAuthenticated(false);
      navigate('/', { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return { isAuthenticated, isLoading, checkAuth };
};