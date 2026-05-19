import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import { StatsCard, StatusBadge, PriorityBadge, CardSkeleton } from "../components/UI";

const COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#f43f5e", "#ec4899"];

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/api/stats").then((r) => { setStats(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <CardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  if (!stats) return <div className="text-center py-20 text-dark-500">Failed to load dashboard</div>;

  const categoryData = (stats.categoryStats || []).map((c, i) => ({ name: c._id || "Other", value: c.count, fill: COLORS[i % COLORS.length] }));
  const priorityData = (stats.priorityStats || []).map((p) => {
    const colors = { Critical: "#ef4444", High: "#f97316", Medium: "#f59e0b", Low: "#10b981" };
    return { name: p._id, value: p.count, fill: colors[p._id] || "#6366f1" };
  });
  const trendData = (stats.monthlyTrend || []).map((t) => ({ month: t._id, complaints: t.count }));

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard icon="📊" label="Total Complaints" value={stats.total} color="brand" delay={0} />
        <StatsCard icon="⏳" label="Pending" value={stats.pending} color="amber" delay={1} />
        <StatsCard icon="🔄" label="In Progress" value={stats.inProgress} color="blue" delay={2} />
        <StatsCard icon="✅" label="Resolved" value={stats.resolved} color="green" delay={3} />
        <StatsCard icon="📈" label="Resolution Rate" value={`${stats.resolutionRate}%`} color="purple" delay={4} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Monthly Trend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="lg:col-span-2 glass-card p-6">
          <h3 className="text-sm font-semibold text-dark-300 mb-4">📈 Monthly Complaint Trend</h3>
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorComplaints" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, color: "#f1f5f9" }} />
                <Area type="monotone" dataKey="complaints" stroke="#6366f1" strokeWidth={2} fill="url(#colorComplaints)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : <p className="text-dark-500 text-sm text-center py-10">No trend data yet</p>}
        </motion.div>

        {/* Category Pie */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="glass-card p-6">
          <h3 className="text-sm font-semibold text-dark-300 mb-4">📂 By Category</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {categoryData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, color: "#f1f5f9" }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-dark-500 text-sm text-center py-10">No data</p>}
          <div className="flex flex-wrap gap-2 mt-2">
            {categoryData.map((c, i) => (
              <span key={i} className="flex items-center gap-1.5 text-[11px] text-dark-400">
                <span className="w-2 h-2 rounded-full" style={{ background: c.fill }} /> {c.name}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Priority Distribution + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Priority Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="glass-card p-6">
          <h3 className="text-sm font-semibold text-dark-300 mb-4">🎯 Priority Distribution</h3>
          {priorityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={priorityData} layout="vertical">
                <XAxis type="number" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} width={60} />
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, color: "#f1f5f9" }} />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={24}>
                  {priorityData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-dark-500 text-sm text-center py-10">No data</p>}
        </motion.div>

        {/* Recent Complaints */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-dark-300">🕐 Recent Complaints</h3>
            <button onClick={() => navigate("/complaints")} className="text-xs text-brand-400 hover:text-brand-300 font-medium">View All →</button>
          </div>
          <div className="space-y-3">
            {(stats.recent || []).map((c, i) => (
              <motion.div key={c._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }}
                className="flex items-center justify-between p-3 bg-dark-800/30 rounded-xl hover:bg-dark-700/30 transition-colors">
                <div className="flex-1 min-w-0 mr-3">
                  <p className="text-sm font-medium text-dark-200 truncate">{c.title}</p>
                  <p className="text-xs text-dark-500 mt-0.5">{c.category} • {new Date(c.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <PriorityBadge priority={c.priority} />
                  <StatusBadge status={c.status} />
                </div>
              </motion.div>
            ))}
            {(!stats.recent || stats.recent.length === 0) && <p className="text-dark-500 text-sm text-center py-6">No complaints yet</p>}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
