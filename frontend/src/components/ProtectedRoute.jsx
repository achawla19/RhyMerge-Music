import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setAuthorized(false);
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          setAuthorized(false);
          setLoading(false);
          return;
        }

        setAuthorized(true);
      } catch (err) {
        console.error(err);
        setAuthorized(false);
      }

      setLoading(false);
    };

    verifyUser();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0B1220] text-white">
        Loading...
      </div>
    );
  }

  if (!authorized) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
