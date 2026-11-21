import React, { useState } from "react";

interface LandingPageProps {
  onGoLogin: () => void;
  onGoRegister: () => void;
}

export function LandingPage({ onGoLogin, onGoRegister }: LandingPageProps) {
  const [logoPesatOk, setLogoPesatOk] = useState(true);

  const fiturList = [
    { judul: "Kelola Tanaman", icon: "🌱" },
    { judul: "Catat Keuangan", icon: "📈" },
    { judul: "Pantau Panen", icon: "🧺" },
    { judul: "Pekarangan Produktif", icon: "🥕" },
  ];

  return (
    <div className="min-h-dvh w-full bg-stone-900 flex justify-center">
      <div
        className="relative min-h-dvh w-full max-w-md text-stone-900 px-4 pt-9 pb-4 flex flex-col justify-between bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{ backgroundImage: `url('/landing.jpg')` }}
      >
        {/* Kartu Utama Atas */}
        <section className="relative mt-1 rounded-[28px] border-2 border-amber-300/70 bg-white/75 backdrop-blur-md px-4 pt-8 pb-4 shadow-[0_12px_30px_rgba(0,0,0,0.18)] text-center">
          {/* Logo Rumah & Daun di Puncak Kartu */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center justify-center">
            {logoPesatOk ? (
              <img
                src="/logopesat.png"
                alt="Logo PESAT GO!"
                className="h-12 w-auto object-contain drop-shadow"
                onError={() => setLogoPesatOk(false)}
              />
            ) : (
              <span className="text-4xl leading-none drop-shadow" aria-hidden="true">
                🏡🌿
              </span>
            )}
          </div>

          {/* Judul PESAT GO! */}
          <h1 className="text-[42px] sm:text-[46px] font-black italic tracking-tighter leading-none select-none [text-shadow:0_2px_0_rgba(255,255,255,0.95)]">
            <span className="text-emerald-900">PESAT </span>
            <span className="text-amber-500">GO!</span>
          </h1>

          {/* Garis Lengkung Oranye */}
          <div className="mx-auto mt-1 h-1.5 w-4/5 rounded-full bg-gradient-to-r from-amber-300 via-amber-500 to-orange-500 shadow-[0_2px_6px_rgba(245,158,11,0.45)]" />

          {/* Pembatas Daun & Subjudul */}
          <div className="mt-1.5 flex items-center justify-center gap-2 text-emerald-700/70">
            <span className="h-[1px] w-10 bg-emerald-700/35" />
            <span className="text-xs leading-none" aria-hidden="true">
              🍃
            </span>
            <span className="h-[1px] w-10 bg-emerald-700/35" />
          </div>

          <p className="mt-1 text-[11.5px] font-bold italic leading-snug text-stone-800">
            Catat Tanam, Panen, dan Keuangan Pekarangan Lebih Rapi
          </p>

          {/* Grid 2x2 Kapsul Fitur */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            {fiturList.map((item) => (
              <div
                key={item.judul}
                className="flex items-center justify-between gap-1.5 rounded-2xl border border-emerald-200/80 bg-gradient-to-b from-white/95 to-emerald-50/90 px-2.5 py-2 shadow-xs text-left"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-base leading-none shrink-0" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="text-[11px] font-bold leading-tight text-stone-800">
                    {item.judul}
                  </span>
                </div>
                <span
                  className="text-xs font-bold text-stone-500 shrink-0"
                  aria-hidden="true"
                >
                  &rsaquo;
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Tombol Aksi Kapsul di Bawah */}
        <div className="mt-auto space-y-2">
          <button
            type="button"
            onClick={onGoLogin}
            className="w-full flex items-center justify-between rounded-full border-2 border-amber-300/85 bg-gradient-to-b from-emerald-500 via-emerald-600 to-emerald-800 px-4 py-2.5 text-white shadow-[0_8px_18px_rgba(6,95,70,0.4)] hover:brightness-105 active:scale-[0.99] transition"
          >
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-sm"
              aria-hidden="true"
            >
              👤
            </span>
            <span className="text-sm font-extrabold tracking-wide drop-shadow-xs">
              Masuk ke Akun
            </span>
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-sm font-black text-emerald-800 shadow-xs"
              aria-hidden="true"
            >
              &rsaquo;
            </span>
          </button>

          <button
            type="button"
            onClick={onGoRegister}
            className="w-full flex items-center justify-center gap-2 rounded-full border-2 border-emerald-700/60 bg-gradient-to-b from-white to-stone-100 px-4 py-2 text-emerald-900 shadow-[0_6px_14px_rgba(0,0,0,0.18)] hover:bg-emerald-50 active:scale-[0.99] transition"
          >
            <span className="text-sm leading-none" aria-hidden="true">
              ➕
            </span>
            <span className="text-xs sm:text-sm font-extrabold">
              Daftar Akun Baru
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}