import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineHome, HiOutlineClipboardList, HiOutlinePlusCircle, HiOutlineSparkles, HiOutlineChartBar, HiOutlineLogout, HiOutlineMenu, HiOutlineX } from "react-icons/hi";

const navItems = [
  { to: "/dashboard", icon: HiOutlineHome, label: "Dashboard" },
  { to: "/complaints", icon: HiOutlineClipboardList, label: "Complaints" },
  { to: "/new-complaint", icon: HiOutlinePlusCircle, label: "New Complaint" },
  { to: "/ai-analysis", icon: HiOutlineSparkles, label: "AI Analysis" },
  { to: "/analytics", icon: HiOutlineChartBar, label: "Analytics" },
];

export default function Layout({ children }) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userName = localStorage.getItem("userName") || "User";
  const userRole = localStorage.getItem("userRole") || "user";

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-dark-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-brand-500/30">
            ⚡
          </div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-brand-400 to-brand-300 bg-clip-text text-transparent">SmartCMS</h1>
            <p className="text-[10px] text-dark-500 font-medium tracking-wider uppercase">Complaint System</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive ? "bg-brand-500/10 text-brand-400 shadow-sm" : "text-dark-400 hover:text-dark-100 hover:bg-dark-700/40"
              }`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-dark-700/50">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-dark-100 truncate">{userName}</p>
            <p className="text-xs text-dark-500 capitalize">{userRole}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all">
          <HiOutlineLogout className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-dark-950 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-dark-900/80 backdrop-blur-xl border-r border-dark-700/50 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-dark-900 border-r border-dark-700/50 z-50 lg:hidden">
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 flex items-center justify-between px-4 lg:px-8 bg-dark-900/60 backdrop-blur-xl border-b border-dark-700/50 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-dark-400 hover:text-dark-100 hover:bg-dark-700/50 rounded-xl transition-colors">
              <HiOutlineMenu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-lg font-bold text-dark-100">Welcome back, {userName} 👋</h2>
              <p className="text-xs text-dark-500">Manage and track your complaints</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`badge ${userRole === "admin" ? "bg-amber-500/15 text-amber-400 border border-amber-500/20" : "bg-brand-500/15 text-brand-400 border border-brand-500/20"}`}>
              {userRole === "admin" ? "👑 Admin" : "👤 User"}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
