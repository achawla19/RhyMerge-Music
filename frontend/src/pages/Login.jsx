import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import hero from "../assets/hero.png";

const API = import.meta.env.VITE_API_URL;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // If a valid session already exists, skip the login form entirely
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API}/api/auth/refresh`, {
          method: "POST",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          login(data.user);
          navigate("/");
          return;
        }
      } catch (err) {
        console.error(err);
      }
      setCheckingAuth(false);
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Invalid credentials");
        setLoading(false);
        return;
      }

      // login() already persists to localStorage — no need to duplicate it here
      login(data.user);
      setSuccess(true);
      setLoading(false);

      // Let the success state actually be visible before navigating,
      // instead of navigating immediately and again a second later.
      setTimeout(() => navigate("/"), 700);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof TypeError
          ? "Can't reach the server. Is the backend running?"
          : "Something went wrong. Please try again.",
      );
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div
        className="h-screen flex items-center justify-center"
        style={{ background: "#0B0814" }}
      >
        <Loader2 className="animate-spin w-6 h-6" color="#C084FC" />
      </div>
    );
  }

  return (
    <div
      className="h-screen w-full flex text-white"
      style={{ background: "#0B0814" }}
    >
      {/* LEFT */}
      <div className="w-1/2 relative hidden lg:flex items-center justify-center">
        <img
          src={hero}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.55 }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(11,8,20,0.6) 0%, rgba(11,8,20,0.95) 100%)",
          }}
        />
        <div className="relative z-10 text-center px-10">
          <h1 className="text-5xl font-bold">
            <span style={{ color: "#C084FC" }}>Rhy</span>Merge
          </h1>
          <p className="mt-4 text-sm" style={{ color: "#C4B5FD" }}>
            Elevate Your Sound. Collaborate. Create. Conquer.
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6">
        <form
          onSubmit={handleLogin}
          className="relative w-full max-w-md p-8 rounded-3xl"
          style={{
            background: "rgba(124,58,237,0.04)",
            backdropFilter: "blur(20px)",
            border: "1px solid var(--rm-purple-border, rgba(124,58,237,0.25))",
            boxShadow: "0 0 60px rgba(139,92,246,0.15)",
          }}
        >
          <h2 className="text-2xl font-semibold text-center text-white">
            Welcome Back
          </h2>
          <p className="text-sm text-center mt-2" style={{ color: "#9CA3AF" }}>
            Access your collaboration dashboard.
          </p>

          <div className="mt-6 space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-transparent outline-none transition-all"
              style={{
                border: "1px solid rgba(124,58,237,0.3)",
                color: "white",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#7C3AED")}
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "rgba(124,58,237,0.3)")
              }
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-transparent outline-none transition-all"
              style={{
                border: "1px solid rgba(124,58,237,0.3)",
                color: "white",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#7C3AED")}
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "rgba(124,58,237,0.3)")
              }
            />
          </div>

          {error && (
            <p
              className="text-sm mt-3 text-center"
              style={{ color: "#F87171" }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || success}
            className="w-full mt-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
            style={{
              background: success ? "#10B981" : "#7C3AED",
              color: "#fff",
            }}
          >
            {success && <Check size={16} />}
            {loading && <Loader2 size={16} className="animate-spin" />}
            {success
              ? "Logged In"
              : loading
                ? "Logging in..."
                : "Join the Merge"}
          </button>

          <p className="text-sm mt-6 text-center" style={{ color: "#9CA3AF" }}>
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="cursor-pointer"
              style={{ color: "#C084FC" }}
            >
              Signup
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
