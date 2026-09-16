import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/**
 * This guard only controls navigation/UX — it hides the admin UI from
 * non-admins so they don't hit a wall of RLS errors. It is NOT the
 * security boundary. Every admin write still goes through Postgres RLS
 * policies keyed on is_admin(), so even if this check were bypassed,
 * the database itself rejects unauthorized writes.
 */
export default function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return null;
  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
}
