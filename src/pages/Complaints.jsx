import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import API from "../utils/api";
import { StatusBadge, PriorityBadge, SentimentBadge, Pagination, EmptyState, TableSkeleton, Timeline } from "../components/UI";
import { HiOutlineSearch, HiOutlineFilter, HiOutlineTrash, HiOutlineEye, HiOutlineX } from "react-icons/hi";

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [sort, setSort] = useState("-createdAt");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 8, sort };
      if (search) params.search = search;
      if (category) params.category = category;
      if (status) params.status = status;
      if (priority) params.priority = priority;
      const { data } = await API.get("/api/complaints", { params });
      setComplaints(data.complaints);
      setPages(data.pages);
      setTotal(data.total);
    } catch (err) {
      toast.error("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  }, [page, search, category, status, priority, sort]);

  useEffect(() => { fetchComplaints(); }, [fetchComplaints]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await API.put(`/api/complaints/${id}`, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      fetchComplaints();
      if (selectedComplaint?._id === id) {
        const { data } = await API.get(`/api/complaints/${id}`);
        setSelectedComplaint(data);
      }
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this complaint?")) return;
    try {
      await API.delete(`/api/complaints/${id}`);
      toast.success("Complaint deleted");
      fetchComplaints();
      if (selectedComplaint?._id === id) setSelectedComplaint(null);
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const openDetail = async (id) => {
    try {
      const { data } = await API.get(`/api/complaints/${id}`);
      setSelectedComplaint(data);
    } catch (err) {
      toast.error("Failed to load details");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-dark-100">All Complaints</h2>
          <p className="text-sm text-dark-500">Total: <span className="text-brand-400 font-semibold">{total}</span> complaints</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowFilters(!showFilters)}
            className={`btn-ghost flex items-center gap-2 text-sm border border-dark-700/50 ${showFilters ? "text-brand-400 border-brand-500/30" : ""}`}>
            <HiOutlineFilter className="w-4 h-4" /> Filters
          </button>
          <select value={sort} onChange={(e) => setSort(e.target.value)}
            className="glass-select text-sm py-2 !rounded-lg">
            <option value="-createdAt">Newest First</option>
            <option value="createdAt">Oldest First</option>
            <option value="-priority">Priority ↓</option>
            <option value="title">Title A-Z</option>
          </select>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="glass-card p-4 space-y-3">
        <div className="relative">
          <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500 w-4 h-4" />
          <input placeholder="Search by title, name, or description..." className="glass-input pl-11 text-sm"
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3 overflow-hidden">
              <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className="glass-select text-sm py-2.5">
                <option value="">All Categories</option>
                <option>Water Supply</option><option>Electricity</option><option>Garbage</option><option>Road</option><option>Other</option>
              </select>
              <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="glass-select text-sm py-2.5">
                <option value="">All Status</option>
                <option>Pending</option><option>In Progress</option><option>Resolved</option><option>Rejected</option>
              </select>
              <select value={priority} onChange={(e) => { setPriority(e.target.value); setPage(1); }} className="glass-select text-sm py-2.5">
                <option value="">All Priority</option>
                <option>Critical</option><option>High</option><option>Medium</option><option>Low</option>
              </select>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Complaint Cards */}
      {loading ? <TableSkeleton rows={4} /> : complaints.length === 0 ? <EmptyState title="No complaints found" subtitle="Try adjusting your filters" /> : (
        <div className="space-y-3">
          {complaints.map((c, i) => (
            <motion.div key={c._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="glass-card p-4 lg:p-5 hover:border-dark-600/50 transition-all duration-300 group">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-sm font-semibold text-dark-100 truncate">{c.title}</h3>
                    <PriorityBadge priority={c.priority} />
                    <StatusBadge status={c.status} />
                  </div>
                  <p className="text-xs text-dark-500 line-clamp-1 mb-2">{c.description}</p>
                  <div className="flex items-center gap-4 text-xs text-dark-500">
                    <span>👤 {c.name}</span>
                    <span>📂 {c.category}</span>
                    <span>📍 {c.location}</span>
                    <span>📅 {new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <select defaultValue="" onChange={(e) => { if (e.target.value) handleStatusUpdate(c._id, e.target.value); e.target.value = ""; }}
                    className="glass-select text-xs py-1.5 px-3 !rounded-lg">
                    <option value="" disabled>Update</option>
                    <option>Pending</option><option>In Progress</option><option>Resolved</option><option>Rejected</option>
                  </select>
                  <button onClick={() => openDetail(c._id)} className="p-2 text-dark-400 hover:text-brand-400 hover:bg-brand-500/10 rounded-lg transition">
                    <HiOutlineEye className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(c._id)} className="p-2 text-dark-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition">
                    <HiOutlineTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {/* AI Insights Mini */}
              {c.aiDepartment && (
                <div className="mt-3 pt-3 border-t border-dark-700/30 flex flex-wrap gap-3 text-xs">
                  <span className="text-dark-500">🤖 AI: </span>
                  <span className="text-brand-400">🏢 {c.aiDepartment}</span>
                  {c.aiSentiment && <SentimentBadge sentiment={c.aiSentiment} />}
                  {c.aiUrgency && <span className={`badge ${c.aiUrgency === "Critical" ? "bg-red-500/15 text-red-400" : c.aiUrgency === "High" ? "bg-orange-500/15 text-orange-400" : "bg-slate-500/15 text-slate-400"}`}>⚡ {c.aiUrgency}</span>}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <Pagination page={page} pages={pages} onPageChange={setPage} />

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedComplaint && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedComplaint(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-dark-100">Complaint Details</h3>
                <button onClick={() => setSelectedComplaint(null)} className="p-2 text-dark-400 hover:text-dark-100 hover:bg-dark-700/50 rounded-xl transition">
                  <HiOutlineX className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-semibold text-dark-100 mb-1">{selectedComplaint.title}</h4>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <PriorityBadge priority={selectedComplaint.priority} />
                    <StatusBadge status={selectedComplaint.status} />
                    {selectedComplaint.aiSentiment && <SentimentBadge sentiment={selectedComplaint.aiSentiment} />}
                  </div>
                  <p className="text-sm text-dark-400 leading-relaxed">{selectedComplaint.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[["👤 Name", selectedComplaint.name], ["📧 Email", selectedComplaint.email],
                    ["📂 Category", selectedComplaint.category], ["📍 Location", selectedComplaint.location],
                    ["🏢 Department", selectedComplaint.aiDepartment], ["⚡ Urgency", selectedComplaint.aiUrgency]
                  ].map(([label, val]) => val && (
                    <div key={label} className="bg-dark-800/40 rounded-xl p-3">
                      <p className="text-[10px] text-dark-500 uppercase tracking-wider mb-1">{label}</p>
                      <p className="text-sm text-dark-200">{val}</p>
                    </div>
                  ))}
                </div>

                {selectedComplaint.aiSummary && (
                  <div className="bg-brand-500/5 border border-brand-500/15 rounded-xl p-4">
                    <p className="text-[10px] text-brand-400 uppercase tracking-wider font-semibold mb-2">🤖 AI Summary</p>
                    <p className="text-sm text-dark-300">{selectedComplaint.aiSummary}</p>
                    {selectedComplaint.aiAutoReply && (
                      <div className="mt-3 pt-3 border-t border-brand-500/10">
                        <p className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold mb-1">💬 Auto-Reply Suggestion</p>
                        <p className="text-sm text-dark-400">{selectedComplaint.aiAutoReply}</p>
                      </div>
                    )}
                  </div>
                )}

                {selectedComplaint.timeline?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-dark-300 mb-3">📋 Status Timeline</h4>
                    <Timeline items={selectedComplaint.timeline} />
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
