import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import { useAuth } from "../context/AuthContext";

interface SummaryResponse {
  keuangan: {
    totalPemasukan: number;
    totalPengeluaran: number;
    saldoBersih: number;
  };
  tanaman: {
    DITANAM: number;
    BELUM_PANEN: number;
    SUDAH_PANEN: number;
  };
}

const formatRupiah = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

export function BerandaPage({
  onNavigate,
}: {
  onNavigate: (tab: "beranda" | "tanaman" | "keuangan") => void;
}) {
  const { user, logout } = useAuth();
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<SummaryResponse>("/api/keuangan/summary")
      .then(setSummary)
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <div className="p-4 space-y-4">
      <header className="flex items-center justify-between pt-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            PESAT GO!
          </p>
          <h1 className="text-lg font-bold text-stone-900">
            Halo, {user?.nama || "Pekarang"}!
          </h1>
        </div>
        <button
          type="button"
          onClick={logout}
          className="rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 hover:bg-stone-100"
        >
          Keluar
        </button>
      </header>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          {error}
        </div>
      )}

      <section className="grid grid-cols-3 gap-2.5">
        <div className="rounded-2xl bg-white p-3 border border-stone-200/80 text-center">
          <p className="text-xl font-bold text-emerald-700">
            {summary?.tanaman.DITANAM ?? 0}
          </p>
          <p className="text-[11px] text-stone-500 mt-0.5">Ditanam</p>
        </div>
        <div className="rounded-2xl bg-white p-3 border border-stone-200/80 text-center">
          <p className="text-xl font-bold text-amber-600">
            {summary?.tanaman.BELUM_PANEN ?? 0}
          </p>
          <p className="text-[11px] text-stone-500 mt-0.5">Belum Panen</p>
        </div>
        <div className="rounded-2xl bg-white p-3 border border-stone-200/80 text-center">
          <p className="text-xl font-bold text-sky-700">
            {summary?.tanaman.SUDAH_PANEN ?? 0}
          </p>
          <p className="text-[11px] text-stone-500 mt-0.5">Sudah Panen</p>
        </div>
      </section>

      <section className="rounded-2xl bg-emerald-700 p-4 text-white shadow-sm">
        <p className="text-xs text-emerald-100">Dompet Pekarangan · Saldo Bersih</p>
        <p className="text-2xl font-bold mt-1">
          {formatRupiah(summary?.keuangan.saldoBersih ?? 0)}
        </p>
        <div className="mt-3 flex gap-3 text-xs text-emerald-100">
          <span>Masuk: {formatRupiah(summary?.keuangan.totalPemasukan ?? 0)}</span>
          <span>•</span>
          <span>Keluar: {formatRupiah(summary?.keuangan.totalPengeluaran ?? 0)}</span>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-stone-800">Aksi Cepat</h2>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate("tanaman")}
            className="rounded-xl bg-emerald-600 py-3 px-4 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            + Kelola Tanaman
          </button>
          <button
            type="button"
            onClick={() => onNavigate("keuangan")}
            className="rounded-xl border border-emerald-600 bg-white py-3 px-4 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
          >
            + Catat Keuangan
          </button>
        </div>
      </section>
    </div>
  );
}