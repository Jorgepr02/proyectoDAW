import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedAdminRoute = ({ children }) => {
  const checkAdminAccess = () => {
    try {
      const userString = localStorage.getItem('user');
      if (!userString) {
        console.log('No user found in localStorage');
        return false;
      }
      
      const user = JSON.parse(userString);
      console.log('User from localStorage:', user);
      
      if (!user.roles || !Array.isArray(user.roles)) {
        console.log('No roles found or roles is not an array:', user.roles);
        return false;
      }
      
      const hasAdminRole = user.roles.includes('ROLE_ADMIN');
      console.log('User roles:', user.roles);
      console.log('Has admin role:', hasAdminRole);
      
      return hasAdminRole;
    } catch (error) {
      console.error('Error checking admin access:', error);
      return false;
    }
  };

  const isAdmin = checkAdminAccess();

  if (!isAdmin) {
    return <Navigate to="/login?message=admin_required" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;