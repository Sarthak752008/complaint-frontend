import React from "react";
import { motion } from "framer-motion";

// ======== Stats Card ========
export function StatsCard({ icon, label, value, trend, color = "brand", delay = 0 }) {
  const colors = {
    brand: "from-brand-500/15 to-brand-600/5 border-brand-500/20 text-brand-400",
    green: "from-emerald-500/15 to-emerald-600/5 border-emerald-500/20 text-emerald-400",
    amber: "from-amber-500/15 to-amber-600/5 border-amber-500/20 text-amber-400",
    red: "from-rose-500/15 to-rose-600/5 border-rose-500/20 text-rose-400",
    blue: "from-sky-500/15 to-sky-600/5 border-sky-500/20 text-sky-400",
    purple: "from-purple-500/15 to-purple-600/5 border-purple-500/20 text-purple-400",
  };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: delay * 0.1, duration: 0.4 }}
      className={`bg-gradient-to-br ${colors[color]} border rounded-2xl p-5 hover:scale-[1.02] transition-transform duration-300`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        {trend && <span className={`text-xs font-bold ${trend > 0 ? "text-emerald-400" : "text-rose-400"}`}>{trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%</span>}
      </div>
      <p className="text-2xl font-bold text-dark-100">{value}</p>
      <p className="text-xs text-dark-500 mt-1">{label}</p>
    </motion.div>
  );
}

// ======== Priority Badge ========
export function PriorityBadge({ priority }) {
  const styles = {
    Critical: "bg-red-500/15 text-red-400 border border-red-500/25",
    High: "bg-orange-500/15 text-orange-400 border border-orange-500/25",
    Medium: "bg-amber-500/15 text-amber-400 border border-amber-500/25",
    Low: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
  };
  return <span className={`badge ${styles[priority] || styles.Low}`}>{priority}</span>;
}

// ======== Status Badge ========
export function StatusBadge({ status }) {
  const styles = {
    Pending: "bg-amber-500/15 text-amber-400 border border-amber-500/25",
    "In Progress": "bg-sky-500/15 text-sky-400 border border-sky-500/25",
    Resolved: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
    Rejected: "bg-rose-500/15 text-rose-400 border border-rose-500/25",
  };
  return <span className={`badge ${styles[status] || styles.Pending}`}>{status}</span>;
}

// ======== Skeleton Loader ========
export function Skeleton({ className = "" }) {
  return <div className={`skeleton ${className}`}>&nbsp;</div>;
}

export function CardSkeleton() {
  return (
    <div className="glass-card p-5 space-y-3">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-20" />
        </div>
      ))}
    </div>
  );
}

// ======== Pagination ========
export function Pagination({ page, pages, onPageChange }) {
  if (pages <= 1) return null;
  const range = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(pages, page + 2);
  for (let i = start; i <= end; i++) range.push(i);

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button onClick={() => onPageChange(page - 1)} disabled={page <= 1}
        className="px-3 py-2 text-sm text-dark-400 hover:text-dark-100 hover:bg-dark-700/50 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed">
        ← Prev
      </button>
      {range.map((p) => (
        <button key={p} onClick={() => onPageChange(p)}
          className={`w-9 h-9 text-sm rounded-lg transition-all duration-200 ${
            p === page ? "bg-brand-500 text-white font-bold shadow-lg shadow-brand-500/30" : "text-dark-400 hover:bg-dark-700/50"
          }`}>
          {p}
        </button>
      ))}
      <button onClick={() => onPageChange(page + 1)} disabled={page >= pages}
        className="px-3 py-2 text-sm text-dark-400 hover:text-dark-100 hover:bg-dark-700/50 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed">
        Next →
      </button>
    </div>
  );
}

// ======== Empty State ========
export function EmptyState({ icon = "📭", title = "No data found", subtitle = "" }) {
  return (
    <div className="text-center py-16">
      <div className="text-5xl mb-4 opacity-50">{icon}</div>
      <p className="text-dark-400 font-medium">{title}</p>
      {subtitle && <p className="text-dark-500 text-sm mt-1">{subtitle}</p>}
    </div>
  );
}

// ======== Sentiment Badge ========
export function SentimentBadge({ sentiment }) {
  const styles = {
    Negative: "bg-rose-500/15 text-rose-400 border border-rose-500/25",
    Positive: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25",
    Neutral: "bg-slate-500/15 text-slate-400 border border-slate-500/25",
  };
  const icons = { Negative: "😟", Positive: "😊", Neutral: "😐" };
  return <span className={`badge ${styles[sentiment] || styles.Neutral}`}>{icons[sentiment]} {sentiment}</span>;
}

// ======== Timeline ========
export function Timeline({ items = [] }) {
  return (
    <div className="relative pl-6 space-y-6">
      <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-dark-700/50" />
      {items.map((item, i) => (
        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
          className="relative">
          <div className={`absolute left-[-17px] top-1.5 w-3 h-3 rounded-full border-2 ${
            item.status === "Resolved" ? "bg-emerald-500 border-emerald-400" :
            item.status === "In Progress" ? "bg-sky-500 border-sky-400" :
            item.status === "Rejected" ? "bg-rose-500 border-rose-400" :
            "bg-amber-500 border-amber-400"
          }`} />
          <div className="bg-dark-800/50 border border-dark-700/30 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1">
              <StatusBadge status={item.status} />
              <span className="text-[11px] text-dark-500">{new Date(item.date).toLocaleString()}</span>
            </div>
            <p className="text-sm text-dark-300">{item.note}</p>
            <p className="text-xs text-dark-500 mt-1">by {item.updatedBy}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
