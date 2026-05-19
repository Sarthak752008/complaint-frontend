import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Complaints from "./pages/Complaints";
import NewComplaint from "./pages/NewComplaint";
import AIAnalysis from "./pages/AIAnalysis";
import Analytics from "./pages/Analytics";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const token = localStorage.getItem("token");
  return (
    <Routes>
      <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
      <Route path="/complaints" element={<ProtectedRoute><Layout><Complaints /></Layout></ProtectedRoute>} />
      <Route path="/new-complaint" element={<ProtectedRoute><Layout><NewComplaint /></Layout></ProtectedRoute>} />
      <Route path="/ai-analysis" element={<ProtectedRoute><Layout><AIAnalysis /></Layout></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><Layout><Analytics /></Layout></ProtectedRoute>} />
    </Routes>
  );
}
