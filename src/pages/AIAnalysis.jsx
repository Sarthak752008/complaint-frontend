import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import API from "../utils/api";
import { PriorityBadge, SentimentBadge } from "../components/UI";
import { HiOutlineSparkles } from "react-icons/hi";

export default function AIAnalysis() {
  const [form, setForm] = useState({ title: "", description: "", category: "" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category) return toast.error("All fields are required");
    setLoading(true);
    setResult(null);
    try {
      const { data } = await API.post("/api/ai/analyze", form);
      setResult(data);
      setHistory((prev) => [{ ...data, title: form.title, time: new Date().toLocaleTimeString() }, ...prev.slice(0, 4)]);
      toast.success("Analysis complete!");
    } catch (err) {
      toast.error("Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-dark-100">🤖 AI Complaint Analyzer</h2>
        <p className="text-sm text-dark-500 mt-1">Get instant AI-powered insights — priority, department, sentiment & auto-reply</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Input Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-3 glass-card p-6">
          <form onSubmit={handleAnalyze} className="space-y-5">
            <div>
              <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2 block">Complaint Title</label>
              <input placeholder="e.g. Water pipe burst near market" className="glass-input"
                value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2 block">Category</label>
              <select className="glass-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="">Select category</option>
                <option>Water Supply</option><option>Electricity</option><option>Garbage</option><option>Road</option><option>Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-2 block">Description</label>
              <textarea rows={4} placeholder="Describe the complaint in detail for AI analysis..."
                className="glass-input resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <><HiOutlineSparkles className="w-4 h-4" /> Analyze with AI</>
              )}
            </button>
          </form>
        </motion.div>

        {/* History */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="lg:col-span-2 glass-card p-6">
          <h3 className="text-sm font-semibold text-dark-300 mb-4">📜 Recent Analyses</h3>
          {history.length === 0 ? (
            <p className="text-dark-500 text-sm text-center py-8">No analyses yet. Try one!</p>
          ) : (
            <div className="space-y-3">
              {history.map((h, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                  className="bg-dark-800/40 rounded-xl p-3 border border-dark-700/30">
                  <p className="text-xs font-medium text-dark-200 truncate mb-1">{h.title}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <PriorityBadge priority={h.priority} />
                    <span className="text-[10px] text-dark-500">{h.department}</span>
                  </div>
                  <p className="text-[10px] text-dark-600 mt-1">{h.time}</p>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Result Card */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card p-6 border-brand-500/20 shadow-xl shadow-brand-500/5">
            <h3 className="text-base font-bold text-dark-100 flex items-center gap-2 mb-6">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center text-white text-sm">✨</span>
              Analysis Result
            </h3>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {[
                { label: "Priority", content: <PriorityBadge priority={result.priority} /> },
                { label: "Department", content: <span className="text-sm font-semibold text-dark-200">🏢 {result.department}</span> },
                { label: "Urgency Level", content: (
                  <span className={`badge ${result.urgency === "Critical" ? "bg-red-500/15 text-red-400 border border-red-500/25" : result.urgency === "High" ? "bg-orange-500/15 text-orange-400 border border-orange-500/25" : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25"}`}>
                    ⚡ {result.urgency}
                  </span>
                )},
                { label: "Sentiment", content: <SentimentBadge sentiment={result.sentiment} /> },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
                  className="bg-dark-800/40 rounded-xl p-4 text-center">
                  <p className="text-[10px] text-dark-500 uppercase tracking-wider mb-3">{item.label}</p>
                  {item.content}
                </motion.div>
              ))}
            </div>

            <div className="space-y-3">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                className="bg-dark-800/30 rounded-xl p-4">
                <p className="text-[10px] text-brand-400 uppercase tracking-wider font-semibold mb-2">📋 AI Summary</p>
                <p className="text-sm text-dark-300 leading-relaxed">{result.summary}</p>
              </motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
                <p className="text-[10px] text-emerald-400 uppercase tracking-wider font-semibold mb-2">💬 Suggested Auto-Reply</p>
                <p className="text-sm text-dark-300 leading-relaxed">{result.autoResponse}</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
