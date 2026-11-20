import React, { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { MobileShell } from "./components/MobileShell";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { BerandaPage } from "./pages/BerandaPage";
import { TanamanPage } from "./pages/TanamanPage";
import { KeuanganPage } from "./pages/KeuanganPage";

function AppContent() {
  const { user, loading } = useAuth();
  const [publicView, setPublicView] = useState("landing");
  const [activeTab, setActiveTab] = useState("beranda");

  useEffect(() => {
    if (user) {
      setActiveTab("beranda");
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <p className="text-xs font-medium text-stone-500">
          Memuat sesi PESAT GO!...
        </p>
      </div>
    );
  }

  if (!user) {
    if (publicView === "login") {
      return (
        <LoginPage
          onBackLanding={() => setPublicView("landing")}
          onGoRegister={() => setPublicView("register")}
          onSuccess={() => setActiveTab("beranda")}
        />
      );
    }

    if (publicView === "register") {
      return (
        <RegisterPage
          onBackLanding={() => setPublicView("landing")}
          onGoLogin={() => setPublicView("login")}
          onSuccess={() => setActiveTab("beranda")}
        />
      );
    }

    return (
      <LandingPage
        onGoLogin={() => setPublicView("login")}
        onGoRegister={() => setPublicView("register")}
      />
    );
  }

  return (
    <MobileShell activeTab={activeTab} onSelectTab={setActiveTab} showBottomNav>
      {activeTab === "beranda" && <BerandaPage onNavigate={setActiveTab} />}
      {activeTab === "tanaman" && <TanamanPage />}
      {activeTab === "keuangan" && <KeuanganPage />}
    </MobileShell>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}