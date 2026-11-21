import React, { useState } from "react";

interface LandingPageProps {
  onGoLogin: () => void;
  onGoRegister: () => void;
}

export function LandingPage({ onGoLogin, onGoRegister }: LandingPageProps) {
  const [logoPesatOk, setLogoPesatOk] = useState(true);
  const [logoLumajangOk, setLogoLumajangOk] = useState(true);
  const [logoPkkOk, setLogoPkkOk] = useState(true);

  const fiturList = [
    { judul: "Kelola Tanaman", icon: "🌱" },
    { judul: "Catat Keuangan", icon: "📊" },
    { judul: "Pantau Panen", icon: "🧺" },
    { judul: "Pekarangan Produktif", icon: "🏡" },
  ];

  return (
    <div className="min-h-screen w-full bg-stone-100 flex justify-center">
      <div
        className="min-h-screen w-full max-w-md text-stone-900 px-4 py-4 flex flex-col justify-between bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/landing.jpg')` }}
      >
        {/* Header Atas */}
        <header className="flex items-center justify-between gap-2 rounded-2xl border border-white/80 bg-white/88 backdrop-blur-md px-3 py-1.5 shadow-xs">
          <div className="flex items-center gap-1.5 min-w-0">
            {logoLumajangOk && (
              <img
                src="/logo_lumajang.png"
                alt="Logo Kabupaten Lumajang"
                className="h-5 w-auto object-contain shrink-0"
                onError={() => setLogoLumajangOk(false)}
              />
            )}
            {logoPkkOk && (
              <img
                src="/logo_pkk.png"
                alt="Logo PKK"
                className="h-5 w-auto object-contain shrink-0"
                onError={() => setLogoPkkOk(false)}
              />
            )}
            <span className="text-[11px] font-extrabold tracking-wide text-emerald-800 truncate">
              PESAT GO!
            </span>
          </div>
          <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
            gerbanglumajang.my.id
          </span>
        </header>

        {/* Bagian Tengah: Hero PESAT GO! + Ringkasan & Fitur */}
        <section className="my-auto rounded-3xl border border-white/85 bg-white/88 backdrop-blur-md px-4 py-4 shadow-lg text-center space-y-2.5">
          {logoPesatOk ? (
            <div className="mx-auto flex justify-center">
              <img
                src="/logopesat.png"
                alt="PESAT GO! Pekarangan Sehat, Produktif, dan Menguntungkan"
                className="max-h-36 w-auto object-contain rounded-2xl"
                onError={() => setLogoPesatOk(false)}
              />
            </div>
          ) : (
            <div className="mx-auto flex flex-col items-center py-1">
              <span className="text-3xl leading-none mb-1" aria-hidden="true">
                🏡🌿
              </span>
              <h1 className="text-[42px] sm:text-5xl font-black italic tracking-tight leading-none select-none">
                <span className="text-emerald-800">PESAT </span>
                <span className="text-amber-500">GO!</span>
              </h1>
              <div className="mt-2 h-1 w-44 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500" />
              <p className="mt-1.5 text-sm sm:text-base font-extrabold italic leading-snug text-stone-900">
                Pekarangan Sehat, Produktif, dan Menguntungkan
              </p>
            </div>
          )}

          <p className="text-xs font-semibold leading-relaxed text-stone-700 px-1">
            Catat Tanam, Panen, dan Keuangan Pekarangan Lebih Rapi
          </p>

          <div className="pt-1 grid grid-cols-2 gap-2">
            {fiturList.map((item) => (
              <div
                key={item.judul}
                className="flex items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50/90 px-2.5 py-2 text-left"
              >
                <span className="text-sm shrink-0" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="text-[11px] font-semibold text-emerald-950 leading-tight">
                  {item.judul}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Tombol Aksi Bawah */}
        <div className="rounded-3xl border border-white/85 bg-white/92 backdrop-blur-md p-3.5 shadow-lg space-y-2">
          <button
            type="button"
            onClick={onGoLogin}
            className="w-full rounded-2xl bg-emerald-600 py-3 px-4 text-sm font-bold text-white shadow hover:bg-emerald-700 active:scale-[0.99] transition"
          >
            Masuk ke Akun
          </button>
          <button
            type="button"
            onClick={onGoRegister}
            className="w-full rounded-2xl border border-emerald-600 bg-white py-2.5 px-4 text-xs font-bold text-emerald-800 hover:bg-emerald-50 active:scale-[0.99] transition"
          >
            Daftar Akun Baru
          </button>
        </div>
      </div>
    </div>
  );
}