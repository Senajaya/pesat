import React, { useState } from "react";

interface LandingPageProps {
  onGoLogin: () => void;
  onGoRegister: () => void;
}

export function LandingPage({ onGoLogin, onGoRegister }: LandingPageProps) {
  const [logoLumajangOk, setLogoLumajangOk] = useState(true);
  const [logoPkkOk, setLogoPkkOk] = useState(true);

  const fiturList = [
    { judul: "Kelola Tanaman", icon: "🌱" },
    { judul: "Catat Keuangan", icon: "📊" },
    { judul: "Pantau Panen", icon: "🧺" },
    { judul: "Pekarangan Produktif", icon: "🏡" },
  ];

  return (
    <div
      className="min-h-screen w-full bg-emerald-950/10 text-stone-900 p-5 flex flex-col justify-between bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('/landing.jpg')` }}
    >
      {/* Kartu Atas: Header, Judul, dan Ringkasan Fitur */}
      <div className="rounded-3xl border border-white/80 bg-white/90 backdrop-blur-md p-5 shadow-xl space-y-4">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {logoLumajangOk && (
              <img
                src="/logo_lumajang.png"
                alt="Logo Kabupaten Lumajang"
                className="h-7 w-auto object-contain"
                onError={() => setLogoLumajangOk(false)}
              />
            )}
            {logoPkkOk && (
              <img
                src="/logo_pkk.png"
                alt="Logo PKK"
                className="h-7 w-auto object-contain"
                onError={() => setLogoPkkOk(false)}
              />
            )}
            <span className="text-xs font-extrabold tracking-wide text-emerald-800">
              PESAT GO!
            </span>
          </div>
          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold text-emerald-800">
            gerbanglumajang.my.id
          </span>
        </header>

        <div className="space-y-1.5">
          <h1 className="text-xl font-extrabold leading-snug text-emerald-950">
            Catat Tanam, Panen, dan Keuangan Pekarangan Lebih Rapi
          </h1>
          <p className="text-xs leading-relaxed text-stone-600">
            Pantau status tanaman, jadwal panen, modal bibit, hingga hasil
            penjualan pekarangan langsung dari ponsel Anda dengan aman.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {fiturList.map((item) => (
            <div
              key={item.judul}
              className="flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50/90 px-3 py-2"
            >
              <span className="text-base" aria-hidden="true">
                {item.icon}
              </span>
              <span className="text-[11px] font-semibold text-emerald-950 leading-tight">
                {item.judul}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Kartu Bawah: Tombol Aksi */}
      <div className="rounded-3xl border border-white/80 bg-white/92 backdrop-blur-md p-4 shadow-xl space-y-2.5">
        <button
          type="button"
          onClick={onGoLogin}
          className="w-full rounded-2xl bg-emerald-600 py-3.5 px-4 text-sm font-bold text-white shadow hover:bg-emerald-700 active:scale-[0.99] transition"
        >
          Masuk ke Akun
        </button>
        <button
          type="button"
          onClick={onGoRegister}
          className="w-full rounded-2xl border border-emerald-600 bg-white/95 py-3 px-4 text-xs font-bold text-emerald-800 hover:bg-emerald-50 active:scale-[0.99] transition"
        >
          Daftar Akun Baru
        </button>
      </div>
    </div>
  );
}