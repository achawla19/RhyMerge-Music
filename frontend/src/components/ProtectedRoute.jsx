import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API = import.meta.env.VITE_API_URL;

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const res = await fetch(`${API}/api/auth/me`, {
          credentials: "include",
        });

        if (!res.ok) {
          setAuthorized(false);
        } else {
          const data = await res.json();
          // Always hydrate AuthContext with the full server response.
          // Some endpoints (like login) only return a slim user object
          // (_id, username, email, role, avatar) — without this, forms
          // that depend on fields like `name` or `createdAt` could end up
          // reading stale/incomplete data even though the session is valid.
          login(data);
          setAuthorized(true);
        }
      } catch (err) {
        console.error(err);
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div
        className="h-screen flex items-center justify-center"
        style={{ background: "var(--rm-bg)", color: "var(--rm-text-primary)" }}
      >
        <span
          style={{
            fontFamily: "var(--rm-font-mono)",
            fontSize: 13,
            color: "var(--rm-text-muted)",
          }}
        >
          loading...
        </span>
      </div>
    );
  }

  if (!authorized) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
