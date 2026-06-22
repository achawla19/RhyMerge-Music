import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

import hero from "../assets/hero.png";
import { ROLES } from "../constants/profileOptions";

const API = import.meta.env.VITE_API_URL;

const inputStyle = {
  border: "1px solid rgba(124,58,237,0.3)",
  color: "white",
};

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Signup failed");
        setLoading(false);
        return;
      }

      // login() already persists to localStorage — no need to duplicate it here
      login(data.user);
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(
        err instanceof TypeError
          ? "Can't reach the server. Is the backend running?"
          : "Something went wrong. Please try again.",
      );
    }

    setLoading(false);
  };

  return (
    <div
      className="h-screen w-full flex text-white overflow-y-auto"
      style={{ background: "#0B0814" }}
    >
      {/* LEFT */}
      <div className="w-1/2 relative hidden lg:flex items-center justify-center flex-shrink-0">
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
          <h1 className="text-5xl font-bold tracking-tight">
            <span style={{ color: "#C084FC" }}>Rhy</span>Merge
          </h1>
          <p className="mt-4 text-sm" style={{ color: "#C4B5FD" }}>
            Elevate Your Sound. Collaborate. Create. Conquer.
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 py-12">
        <form
          onSubmit={handleSignup}
          className="relative w-full max-w-md p-8 rounded-3xl"
          style={{
            background: "rgba(124,58,237,0.04)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(124,58,237,0.25)",
            boxShadow: "0 0 60px rgba(139,92,246,0.1)",
          }}
        >
          <h2 className="text-2xl font-semibold text-center text-white">
            Signup to Collaborate
          </h2>
          <p className="text-sm text-center mt-2" style={{ color: "#9CA3AF" }}>
            Join the ultimate music collaboration platform.
          </p>

          <div className="mt-6 space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-transparent outline-none transition-all"
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#7C3AED")}
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "rgba(124,58,237,0.3)")
              }
            />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-transparent outline-none transition-all"
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#7C3AED")}
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "rgba(124,58,237,0.3)")
              }
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-transparent outline-none transition-all"
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#7C3AED")}
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "rgba(124,58,237,0.3)")
              }
            />

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl outline-none transition-all"
              style={{ ...inputStyle, background: "#150A24" }}
            >
              <option value="">Select Your Role</option>
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-transparent outline-none transition-all"
              style={inputStyle}
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
            disabled={loading}
            className="w-full mt-6 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            style={{ background: "#7C3AED", color: "#fff" }}
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Creating..." : "Join the Merge"}
          </button>

          <div className="flex items-center gap-4 my-6">
            <div
              className="flex-1 h-px"
              style={{ background: "rgba(124,58,237,0.2)" }}
            />
            <span className="text-sm" style={{ color: "#6B7280" }}>
              Or continue with
            </span>
            <div
              className="flex-1 h-px"
              style={{ background: "rgba(124,58,237,0.2)" }}
            />
          </div>

          {/* Not implemented — no OAuth backend exists. Disabled rather than
              silently doing nothing when clicked. */}
          <button
            type="button"
            disabled
            title="Google sign-in isn't available yet"
            className="w-full py-3 rounded-xl transition-all flex items-center justify-center gap-2 opacity-40 cursor-not-allowed"
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt=""
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          <p className="text-sm mt-6 text-center" style={{ color: "#9CA3AF" }}>
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="cursor-pointer hover:underline"
              style={{ color: "#C084FC" }}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
