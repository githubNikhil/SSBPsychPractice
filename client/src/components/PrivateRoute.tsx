import { ReactNode } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContext';

interface PrivateRouteProps {
  children: ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    setLocation('/admin-login');
    return null;
  }

  return <>{children}</>;
}
