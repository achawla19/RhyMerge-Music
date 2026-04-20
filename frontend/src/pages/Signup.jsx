import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

import hero from "../assets/hero.png"; // 🔥 your background image

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Signup failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user)); // 🔥 Store user data

      window.dispatchEvent(new Event("login")); // 🔥 Notify app of login
      window.dispatchEvent(new Event("UserUpdated"));
      navigate("/");
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="h-screen w-full flex bg-gradient-to-br from-[#0b0f17] via-[#0d1320] to-[#0a0f1c] text-white">
      {/* ================= LEFT SIDE ================= */}
      <div className="w-1/2 relative hidden lg:flex items-center justify-center">
        <img
          src={hero}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        {/* content */}
        <div className="relative z-10 text-center px-10">
          <h1 className="text-5xl font-bold tracking-tight">RhyMerge</h1>
          <p className="mt-4 text-gray-300 text-sm">
            Elevate Your Sound. Collaborate. Create. Conquer.
          </p>
        </div>
      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6">
        <form
          onSubmit={handleSignup}
          className="relative w-full max-w-md p-8 rounded-3xl
          bg-white/5 backdrop-blur-2xl border border-white/10
          shadow-[0_0_60px_rgba(139,92,246,0.25)]"
        >
          {/* glow border */}
          <div className="absolute inset-0 rounded-3xl border border-purple-500/20 blur-xl opacity-40 pointer-events-none -z-10"></div>

          {/* HEADER */}
          <h2 className="text-2xl font-semibold text-center">
            Signup to Collaborate
          </h2>

          <p className="text-sm text-gray-400 text-center mt-2">
            Join the ultimate music collaboration platform.
          </p>

          {/* INPUTS */}
          <div className="mt-6 space-y-4">
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-transparent
              border border-white/10
              focus:ring-2 focus:ring-purple-500/70
              focus:border-purple-500
              transition placeholder-gray-400"
            />

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
          </div>

          {/* ERROR */}
          {error && (
            <p className="text-red-400 text-sm mt-3 text-center">{error}</p>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3 rounded-xl font-medium
            bg-gradient-to-r from-purple-500 to-blue-500
            hover:opacity-90 transition flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Creating..." : "Join the Merge"}
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

          {/* LOGIN */}
          <p className="text-sm text-gray-400 mt-6 text-center">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-blue-400 cursor-pointer hover:underline"
            >
              Login
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

export default Signup;
