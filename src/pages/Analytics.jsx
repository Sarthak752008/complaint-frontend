import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, RadialBarChart, RadialBar } from "recharts";
import API from "../utils/api";
import { StatsCard, CardSkeleton } from "../components/UI";

const COLORS = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#f43f5e"];

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/api/stats").then((r) => { setStats(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1,2,3,4].map(i => <CardSkeleton key={i} />)}
    </div>
  );

  if (!stats) return <div className="text-center py-20 text-dark-500">Failed to load analytics</div>;

  const categoryData = (stats.categoryStats || []).map((c, i) => ({ name: c._id || "Other", value: c.count, fill: COLORS[i % COLORS.length] }));
  const priorityData = (stats.priorityStats || []).map((p) => {
    const c = { Critical: "#ef4444", High: "#f97316", Medium: "#f59e0b", Low: "#10b981" };
    return { name: p._id, value: p.count, fill: c[p._id] || "#6366f1" };
  });
  const trendData = (stats.monthlyTrend || []).map((t) => ({ month: t._id, count: t.count }));
  const sentimentData = (stats.sentimentStats || []).map((s) => {
    const c = { Negative: "#f43f5e", Positive: "#10b981", Neutral: "#64748b" };
    return { name: s._id || "Unknown", value: s.count, fill: c[s._id] || "#6366f1" };
  });
  const resolutionData = [{ name: "Rate", value: parseFloat(stats.resolutionRate), fill: "#10b981" }];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-dark-100">📊 Complaint Analytics</h2>
        <p className="text-sm text-dark-500 mt-1">Detailed insights and statistics</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatsCard icon="📊" label="Total" value={stats.total} color="brand" delay={0} />
        <StatsCard icon="⏳" label="Pending" value={stats.pending} color="amber" delay={1} />
        <StatsCard icon="🔄" label="In Progress" value={stats.inProgress} color="blue" delay={2} />
        <StatsCard icon="✅" label="Resolved" value={stats.resolved} color="green" delay={3} />
        <StatsCard icon="❌" label="Rejected" value={stats.rejected} color="red" delay={4} />
        <StatsCard icon="📈" label="Resolution %" value={`${stats.resolutionRate}%`} color="purple" delay={5} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Trend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass-card p-6">
          <h3 className="text-sm font-semibold text-dark-300 mb-4">📈 Monthly Trend</h3>
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, color: "#f1f5f9" }} />
                <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : <p className="text-dark-500 text-sm text-center py-10">No data yet</p>}
        </motion.div>

        {/* Category */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="glass-card p-6">
          <h3 className="text-sm font-semibold text-dark-300 mb-4">📂 Category Distribution</h3>
          {categoryData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                    {categoryData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, color: "#f1f5f9" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 mt-2 justify-center">
                {categoryData.map((c, i) => (
                  <span key={i} className="flex items-center gap-1.5 text-[11px] text-dark-400">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: c.fill }} /> {c.name} ({c.value})
                  </span>
                ))}
              </div>
            </>
          ) : <p className="text-dark-500 text-sm text-center py-10">No data</p>}
        </motion.div>

        {/* Priority */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="glass-card p-6">
          <h3 className="text-sm font-semibold text-dark-300 mb-4">🎯 Priority Breakdown</h3>
          {priorityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={priorityData}>
                <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, color: "#f1f5f9" }} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40}>
                  {priorityData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-dark-500 text-sm text-center py-10">No data</p>}
        </motion.div>

        {/* Sentiment */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="glass-card p-6">
          <h3 className="text-sm font-semibold text-dark-300 mb-4">💭 Sentiment Analysis</h3>
          {sentimentData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={sentimentData} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                    {sentimentData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 12, color: "#f1f5f9" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 mt-2 justify-center">
                {sentimentData.map((s, i) => (
                  <span key={i} className="flex items-center gap-1.5 text-[11px] text-dark-400">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: s.fill }} />
                    {s.name === "Negative" ? "😟" : s.name === "Positive" ? "😊" : "😐"} {s.name} ({s.value})
                  </span>
                ))}
              </div>
            </>
          ) : <p className="text-dark-500 text-sm text-center py-10">No data</p>}
        </motion.div>
      </div>
    </div>
  );
}
