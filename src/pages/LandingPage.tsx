import React, { useState } from "react";

interface LandingPageProps {
  onGoLogin: () => void;
  onGoRegister: () => void;
}

export function LandingPage({ onGoLogin, onGoRegister }: LandingPageProps) {
  const [heroImgOk, setHeroImgOk] = useState(true);
  const [logoLumajangOk, setLogoLumajangOk] = useState(true);
  const [logoPkkOk, setLogoPkkOk] = useState(true);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col justify-between p-5">
      <div className="space-y-5">
        {/* Header & Logo */}
        <header className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            {logoLumajangOk && (
              <img
                src="/logo_lumajang.png"
                alt="Logo Kabupaten Lumajang"
                className="h-8 w-auto object-contain"
                onError={() => setLogoLumajangOk(false)}
              />
            )}
            {logoPkkOk && (
              <img
                src="/logo_pkk.png"
                alt="Logo PKK"
                className="h-8 w-auto object-contain"
                onError={() => setLogoPkkOk(false)}
              />
            )}
            <span className="text-sm font-bold tracking-tight text-emerald-800">
              PESAT GO!
            </span>
          </div>
          <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
            gerbanglumajang.my.id
          </span>
        </header>

        {/* Banner / Hero */}
        <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-xs">
          {heroImgOk ? (
            <img
              src="/landing.jpg"
              alt="Pekarangan produktif PESAT GO!"
              className="h-44 w-full object-cover"
              onError={() => setHeroImgOk(false)}
            />
          ) : (
            <div className="h-36 w-full bg-gradient-to-br from-emerald-700 to-emerald-500 p-5 flex items-end">
              <p className="text-xs font-medium text-emerald-50">
                Pekarangan Lestari · Pencatatan Digital
              </p>
            </div>
          )}

          <div className="p-5 space-y-2.5">
            <h1 className="text-xl font-bold leading-snug text-stone-900">
              Catat Tanam, Panen, dan Keuangan Pekarangan Lebih Rapi
            </h1>
            <p className="text-xs leading-relaxed text-stone-600">
              Pantau status tanaman, jadwal panen, modal bibit, hingga hasil
              penjualan pekarangan langsung dari ponsel Anda dengan aman.
            </p>
          </div>
        </section>

        {/* Keunggulan Singkat */}
        <section className="grid grid-cols-1 gap-2.5">
          <div className="rounded-2xl border border-stone-200/80 bg-white p-3.5">
            <p className="text-xs font-semibold text-emerald-800">
              1. Status Tanaman Terpantau
            </p>
            <p className="text-xs text-stone-600 mt-0.5">
              Kelompokkan tanaman berstatus Ditanam, Belum Panen, dan Sudah Panen.
            </p>
          </div>
          <div className="rounded-2xl border border-stone-200/80 bg-white p-3.5">
            <p className="text-xs font-semibold text-emerald-800">
              2. Dompet Pekarangan Otomatis
            </p>
            <p className="text-xs text-stone-600 mt-0.5">
              Hitung pemasukan, pengeluaran, dan saldo bersih secara transparan.
            </p>
          </div>
        </section>
      </div>

      {/* Tombol Aksi */}
      <div className="pt-6 space-y-2.5">
        <button
          type="button"
          onClick={onGoLogin}
          className="w-full rounded-2xl bg-emerald-600 py-3.5 px-4 text-sm font-semibold text-white shadow-xs hover:bg-emerald-700 active:scale-[0.99] transition"
        >
          Masuk ke Akun
        </button>
        <button
          type="button"
          onClick={onGoRegister}
          className="w-full rounded-2xl border border-emerald-600 bg-white py-3.5 px-4 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 active:scale-[0.99] transition"
        >
          Daftar Akun Baru
        </button>
      </div>
    </div>
  );
}