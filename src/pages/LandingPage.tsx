import React, { useState } from "react";

interface LandingPageProps {
  onGoLogin: () => void;
  onGoRegister: () => void;
}

export function LandingPage({ onGoLogin, onGoRegister }: LandingPageProps) {
  const [logoPesatOk, setLogoPesatOk] = useState(true);

  const fiturList = [
    { judul: "Kelola Tanaman", icon: "🌱" },
    { judul: "Catat Keuangan", icon: "📊" },
    { judul: "Pantau Panen", icon: "🧺" },
    { judul: "Pekarangan Produktif", icon: "🏡" },
  ];

  return (
    <div className="min-h-dvh w-full bg-stone-100 flex justify-center">
      <div
        className="min-h-dvh w-full max-w-md text-stone-900 px-3.5 py-3 flex flex-col justify-between gap-2.5 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/landing.jpg')` }}
      >
        {/* Bagian Tengah Proporsional & Pas di Tengah */}
        <section className="my-auto rounded-3xl border border-white/85 bg-white/90 backdrop-blur-md px-3.5 py-3.5 shadow-lg text-center space-y-2">
          <div className="mx-auto flex flex-col items-center">
            {logoPesatOk && (
              <img
                src="/logopesat.png"
                alt="Logo PESAT GO!"
                className="h-10 w-auto object-contain rounded-lg mb-1"
                onError={() => setLogoPesatOk(false)}
              />
            )}

            <h1 className="text-[42px] sm:text-[46px] font-black italic tracking-tighter leading-none select-none [text-shadow:0_2px_0_rgba(255,255,255,0.95)]">
              <span className="text-emerald-900 font-black">PESAT </span>
              <span className="text-amber-500 font-black">GO!</span>
            </h1>

            <div className="mt-1.5 h-1 w-40 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500" />
          </div>

          <p className="text-[11px] font-semibold leading-snug text-stone-700 px-1">
            Catat Tanam, Panen, dan Keuangan Pekarangan Lebih Rapi
          </p>

          <div className="grid grid-cols-2 gap-1.5">
            {fiturList.map((item) => (
              <div
                key={item.judul}
                className="flex items-center gap-1.5 rounded-2xl border border-emerald-100 bg-emerald-50/90 px-2.5 py-1.5 text-left"
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
        <div className="rounded-3xl border border-white/85 bg-white/92 backdrop-blur-md p-3 shadow-lg space-y-1.5">
          <button
            type="button"
            onClick={onGoLogin}
            className="w-full rounded-2xl bg-emerald-600 py-2.5 px-4 text-sm font-bold text-white shadow hover:bg-emerald-700 active:scale-[0.99] transition"
          >
            Masuk ke Akun
          </button>
          <button
            type="button"
            onClick={onGoRegister}
            className="w-full rounded-2xl border border-emerald-600 bg-white py-2 px-4 text-xs font-bold text-emerald-800 hover:bg-emerald-50 active:scale-[0.99] transition"
          >
            Daftar Akun Baru
          </button>
        </div>
      </div>
    </div>
  );
}