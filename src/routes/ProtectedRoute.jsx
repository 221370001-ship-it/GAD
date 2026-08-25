import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoldSpinner } from '../components/common/Spinner';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-primary-bg">
        <GoldSpinner size={44} />
      </div>
    );
  }

  if (!user) return <Navigate to="/admin" replace />;
  return children;
}
