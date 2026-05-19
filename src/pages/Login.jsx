import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import API from "../utils/api";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error("All fields are required");
    setLoading(true);
    try {
      const { data } = await API.post("/api/login", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.user.name);
      localStorage.setItem("userRole", data.user.role);
      toast.success("Welcome back!");
      setTimeout(() => (window.location.href = "/dashboard"), 600);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-dark-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: "1.5s" }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md">
        <div className="glass-card p-8 lg:p-10 shadow-2xl shadow-black/20">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-brand-500/30 mb-4">
              ⚡
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-400 to-brand-300 bg-clip-text text-transparent">Welcome Back</h1>
            <p className="text-dark-500 text-sm mt-1">Sign in to Smart Complaint System</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2 block">Email</label>
              <input type="email" placeholder="you@example.com" className="glass-input"
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2 block">Password</label>
              <input type="password" placeholder="••••••••" className="glass-input"
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Sign In"}
            </button>
          </form>

          <p className="text-center text-dark-500 text-sm mt-6">
            Don't have an account? <Link to="/register" className="text-brand-400 font-semibold hover:text-brand-300 transition">Create one</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
