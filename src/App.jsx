// src/App.jsx
import './App.css';
import Scene from "./components/scene/Scene.jsx";
import CustomizationContextProvider from "./context/CustomizationContex.jsx";
import CustomizationInterface from "./components/CustomizationInterface.jsx";
import MobileCustomizationInterface from "./components/MobileCustomizationInterface.jsx";
import Media from "react-media";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import AdminDashboard from './admin/Dashboard';
import AdminLogin from './admin/Login';

// Komponen Halaman Utama Kustomisasi Sepatu Lu
function ShoeCustomizer() {
  return (
    <CustomizationContextProvider>
      <div className="App">
        <Scene />
        <Media queries={{ small: "(max-width: 599px)" }}>
          {(matches) => (
            matches.small ? <MobileCustomizationInterface /> : <CustomizationInterface />
          )}
        </Media>
      </div>
    </CustomizationContextProvider>
  );
}

// SATU-SATUNYA Komponen Utama App
export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Ambil status login saat ini pas web pertama dimuat
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // 2. Pantau kalau ada perubahan status (log out / log in)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return null; 

  return (
    <Router>
      <Routes>
        {/* Jalur Utama: Alat kustomisasi sepatu SoleCraft */}
        <Route path="/" element={<ShoeCustomizer />} />

        {/* Jalur Login Admin */}
        <Route path="/login" element={<AdminLogin />} />

        {/* Jalur Dashboard Admin (Diproteksi Satpam Auth) */}
        <Route 
          path="/admin" 
          element={session ? <AdminDashboard /> : <Navigate to="/login" replace />} 
        />
      </Routes>
    </Router>
  );
}