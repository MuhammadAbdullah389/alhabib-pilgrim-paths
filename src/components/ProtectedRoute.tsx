import { Navigate } from 'react-router-dom';
import { useAuth } from '@/lib/authContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  allowedRoles?: Array<'admin' | 'support' | 'visa_officer'>;
}

export function ProtectedRoute({ children, requireAdmin = false, allowedRoles }: ProtectedRouteProps) {
  const { user, profile, isLoading } = useAuth();
  const role = profile?.role ?? 'user';
  const enforcedRoles = allowedRoles ?? (requireAdmin ? ['admin'] : null);

  // Only block while loading if we don't have a session yet.
  // This avoids full-page loader flashes on token refresh/tab focus.
  if (isLoading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  // For admin routes, deny access if profile is missing or not admin
  if (enforcedRoles) {
    if (!profile && isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen px-4">
          <p className="text-sm text-muted-foreground text-center">
            Verifying admin access...
          </p>
        </div>
      );
    }

    if (!profile || !enforcedRoles.includes(role as 'admin' | 'support' | 'visa_officer')) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
}
