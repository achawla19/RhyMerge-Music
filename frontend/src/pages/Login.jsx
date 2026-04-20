import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import hero from "../assets/hero.png";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false); // ✅ FIXED
  const [checkingAuth, setCheckingAuth] = useState(true); // ✅ NEW

  // 🔐 Auto login check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        });

        if (res.ok) {
          navigate("/");
          return;
        }
      } catch (err) {
        console.log("Not logged in");
      }

      setCheckingAuth(false); // allow UI to render
    };

    checkAuth();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Invalid credentials");
        setLoading(false);
        return;
      }

      window.dispatchEvent(new Event("login")); // 🔥 Notify app of login

      // ✅ success animation
      setSuccess(true);
      setLoading(false);

      const { login } = useAuth();
      login(data.user);

      window.dispatchEvent(new Event("UserUpdated"));
      setTimeout(() => {
        navigate("/");
      }, 1200);
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError("Server error");
      setLoading(false);
    }
  };

  // 🔥 Prevent UI flash
  if (checkingAuth) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0b0f17] text-white">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex bg-gradient-to-br from-[#0b0f17] via-[#0d1320] to-[#0a0f1c] text-white">
      {/* LEFT */}
      <div className="w-1/2 relative hidden lg:flex items-center justify-center">
        <img
          src={hero}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-none" />

        <div className="relative z-10 text-center px-10">
          <h1 className="text-5xl font-bold tracking-tight">RhyMerge</h1>
          <p className="mt-4 text-gray-300 text-sm">
            Elevate Your Sound. Collaborate. Create. Conquer.
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6">
        <form
          onSubmit={handleLogin}
          className="relative z-10 w-full max-w-md p-8 rounded-3xl
          bg-white/5 backdrop-blur-2xl border border-white/10
          shadow-[0_0_60px_rgba(139,92,246,0.25)]"
        >
          {/* glow */}
          <div className="absolute inset-0 rounded-3xl border border-purple-500/20 blur-xl opacity-40 pointer-events-none -z-10"></div>

          <h2 className="text-2xl font-semibold text-center">Welcome Back</h2>

          <p className="text-sm text-gray-400 text-center mt-2">
            Access your collaboration dashboard.
          </p>

          {/* INPUTS */}
          <div className="mt-6 space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-transparent
              border border-blue-400/30
              focus:ring-2 focus:ring-blue-500/70
              focus:border-blue-500
              transition placeholder-gray-400"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-transparent
              border border-white/10
              focus:ring-2 focus:ring-purple-500/70
              focus:border-purple-500
              transition placeholder-gray-400"
            />

            <div className="text-right">
              <span className="text-sm text-blue-400 cursor-pointer hover:underline">
                Forgot Password?
              </span>
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <p className="text-red-400 text-sm mt-3 text-center">{error}</p>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading || success}
            className={`w-full mt-6 py-3 rounded-xl font-medium
            transition-all duration-300 flex items-center justify-center gap-2
            ${
              success
                ? "bg-green-500 scale-95 shadow-[0_0_30px_rgba(34,197,94,0.5)]"
                : "bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90"
            }`}
          >
            {success ? (
              <span className="flex items-center gap-2">✓ Logged In</span>
            ) : loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Join the Merge"
            )}
          </button>

          {/* DIVIDER */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-sm text-gray-400">Or continue with</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          {/* GOOGLE */}
          <button
            type="button"
            className="w-full py-3 rounded-xl border border-white/10
            hover:bg-white/10 transition flex items-center justify-center gap-2"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          {/* SIGNUP */}
          <p className="text-sm text-gray-400 mt-6 text-center">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-blue-400 cursor-pointer hover:underline"
            >
              Signup
            </span>
          </p>

          {/* FOOTER */}
          <div className="flex justify-center gap-6 mt-6 text-xs text-gray-400">
            <span className="hover:underline cursor-pointer">
              Terms of Service
            </span>
            <span className="hover:underline cursor-pointer">
              Privacy Policy
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
