import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import API from "../utils/api";
import { PriorityBadge, SentimentBadge } from "../components/UI";
import { HiOutlineUpload, HiOutlineX, HiOutlineSparkles } from "react-icons/hi";

export default function NewComplaint() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", title: "", description: "", category: "", location: "" });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    if (files.length + selected.length > 5) return toast.error("Max 5 files allowed");
    setFiles([...files, ...selected]);
  };

  const removeFile = (i) => setFiles(files.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, title, description, category, location } = form;
    if (!name || !email || !title || !description || !category || !location) return toast.error("All fields are required");
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      files.forEach((f) => formData.append("attachments", f));
      const { data } = await API.post("/api/complaints", formData, { headers: { "Content-Type": "multipart/form-data" } });
      setAiResult(data.aiAnalysis);
      toast.success("Complaint submitted successfully!");
      setForm({ name: "", email: "", title: "", description: "", category: "", location: "" });
      setFiles([]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-dark-100">📝 Submit New Complaint</h2>
        <p className="text-sm text-dark-500 mt-1">Fill in the details and our AI will auto-analyze your complaint</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2 block">Your Name</label>
              <input name="name" placeholder="Full name" className="glass-input" value={form.name} onChange={handleChange} />
            </div>
            <div>
              <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2 block">Email</label>
              <input name="email" type="email" placeholder="your@email.com" className="glass-input" value={form.email} onChange={handleChange} />
            </div>
            <div>
              <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2 block">Complaint Title</label>
              <input name="title" placeholder="Brief title of the issue" className="glass-input" value={form.title} onChange={handleChange} />
            </div>
            <div>
              <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2 block">Category</label>
              <select name="category" className="glass-select" value={form.category} onChange={handleChange}>
                <option value="">Select category</option>
                <option>Water Supply</option><option>Electricity</option><option>Garbage</option><option>Road</option><option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2 block">Location</label>
              <input name="location" placeholder="Area / Address" className="glass-input" value={form.location} onChange={handleChange} />
            </div>
            <div>
              <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2 block">Attachments</label>
              <label className="glass-input flex items-center gap-3 cursor-pointer hover:border-brand-500/50 transition">
                <HiOutlineUpload className="w-5 h-5 text-dark-500" />
                <span className="text-dark-500 text-sm">{files.length > 0 ? `${files.length} file(s) selected` : "Upload files (max 5)"}</span>
                <input type="file" multiple className="hidden" onChange={handleFileChange} accept="image/*,.pdf,.doc,.docx" />
              </label>
            </div>
          </div>

          {/* Uploaded files preview */}
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {files.map((f, i) => (
                <span key={i} className="flex items-center gap-2 bg-dark-800/60 border border-dark-700/40 text-xs text-dark-300 px-3 py-1.5 rounded-lg">
                  📎 {f.name.length > 20 ? f.name.slice(0, 20) + "..." : f.name}
                  <button type="button" onClick={() => removeFile(i)} className="text-dark-500 hover:text-rose-400"><HiOutlineX className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2 block">Description</label>
            <textarea name="description" rows={4} placeholder="Describe the issue in detail..."
              className="glass-input resize-none" value={form.description} onChange={handleChange} />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <HiOutlineSparkles className="w-4 h-4" />}
              Submit & Analyze
            </button>
          </div>
        </form>
      </motion.div>

      {/* AI Analysis Result */}
      <AnimatePresence>
        {aiResult && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10 }}
            className="glass-card p-6 border-brand-500/20">
            <h3 className="text-base font-bold text-dark-100 flex items-center gap-2 mb-5">
              <span className="w-8 h-8 rounded-lg bg-brand-500/15 flex items-center justify-center text-brand-400">🤖</span>
              AI Analysis Result
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
              <div className="bg-dark-800/40 rounded-xl p-4">
                <p className="text-[10px] text-dark-500 uppercase tracking-wider mb-2">Priority</p>
                <PriorityBadge priority={aiResult.priority} />
              </div>
              <div className="bg-dark-800/40 rounded-xl p-4">
                <p className="text-[10px] text-dark-500 uppercase tracking-wider mb-2">Department</p>
                <p className="text-sm font-semibold text-dark-200">🏢 {aiResult.department}</p>
              </div>
              <div className="bg-dark-800/40 rounded-xl p-4">
                <p className="text-[10px] text-dark-500 uppercase tracking-wider mb-2">Urgency</p>
                <span className={`badge ${aiResult.urgency === "Critical" ? "bg-red-500/15 text-red-400 border border-red-500/25" : aiResult.urgency === "High" ? "bg-orange-500/15 text-orange-400 border border-orange-500/25" : "bg-slate-500/15 text-slate-400 border border-slate-500/25"}`}>
                  ⚡ {aiResult.urgency}
                </span>
              </div>
              <div className="bg-dark-800/40 rounded-xl p-4">
                <p className="text-[10px] text-dark-500 uppercase tracking-wider mb-2">Sentiment</p>
                <SentimentBadge sentiment={aiResult.sentiment} />
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-dark-800/30 rounded-xl p-4">
                <p className="text-[10px] text-dark-500 uppercase tracking-wider mb-1">Summary</p>
                <p className="text-sm text-dark-300">{aiResult.summary}</p>
              </div>
              <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
                <p className="text-[10px] text-emerald-400 uppercase tracking-wider mb-1">💬 Auto-Reply Suggestion</p>
                <p className="text-sm text-dark-300">{aiResult.autoResponse}</p>
              </div>
            </div>
            <button onClick={() => navigate("/complaints")} className="mt-4 btn-ghost border border-dark-700/50 text-sm">
              View All Complaints →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
