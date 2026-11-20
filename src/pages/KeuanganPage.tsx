import React, { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../api/client";

export type JenisTransaksi = "PEMASUKAN" | "PENGELUARAN";

export interface TransaksiItem {
  id: string;
  jenis: JenisTransaksi;
  kategori: string;
  nominal: string | number;
  tanggal: string;
  keterangan?: string | null;
}

interface SummaryResponse {
  keuangan: {
    totalPemasukan: number;
    totalPengeluaran: number;
    saldoBersih: number;
  };
}

type FilterJenis = "SEMUA" | JenisTransaksi;

const formatRupiah = (val: string | number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(val) || 0);

const formatTanggal = (iso: string) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));

const todayInputValue = () => new Date().toISOString().slice(0, 10);

export function KeuanganPage() {
  const [transaksi, setTransaksi] = useState<TransaksiItem[]>([]);
  const [summary, setSummary] = useState<SummaryResponse["keuangan"]>({
    totalPemasukan: 0,
    totalPengeluaran: 0,
    saldoBersih: 0,
  });
  const [filterJenis, setFilterJenis] = useState<FilterJenis>("SEMUA");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Form tambah transaksi
  const [showForm, setShowForm] = useState(false);
  const [jenis, setJenis] = useState<JenisTransaksi>("PEMASUKAN");
  const [kategori, setKategori] = useState("");
  const [nominal, setNominal] = useState("");
  const [tanggal, setTanggal] = useState(todayInputValue);
  const [keterangan, setKeterangan] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadData = useCallback(async (filter: FilterJenis) => {
    setLoading(true);
    setError(null);
    try {
      const query = filter === "SEMUA" ? "" : `?jenis=${filter}`;
      const [listRes, sumRes] = await Promise.all([
        apiFetch<{ data: TransaksiItem[] }>(`/api/keuangan${query}`),
        apiFetch<SummaryResponse>("/api/keuangan/summary"),
      ]);
      setTransaksi(listRes.data || []);
      if (sumRes.keuangan) {
        setSummary(sumRes.keuangan);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal memuat data keuangan."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(filterJenis);
  }, [filterJenis, loadData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFeedback(null);

    const parsedNominal = Number(nominal);
    if (!kategori.trim() || !parsedNominal || parsedNominal <= 0) {
      setError("Kategori dan nominal (lebih dari 0) wajib diisi.");
      return;
    }

    setSubmitting(true);
    try {
      await apiFetch("/api/keuangan", {
        method: "POST",
        body: JSON.stringify({
          jenis,
          kategori: kategori.trim(),
          nominal: parsedNominal,
          tanggal,
          keterangan: keterangan.trim() || null,
        }),
      });

      setKategori("");
      setNominal("");
      setTanggal(todayInputValue());
      setKeterangan("");
      setShowForm(false);
      setFeedback("Transaksi berhasil dicatat.");
      await loadData(filterJenis);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal menyimpan transaksi."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (item: TransaksiItem) => {
    setError(null);
    setFeedback(null);
    try {
      await apiFetch(`/api/keuangan/${item.id}`, { method: "DELETE" });
      setFeedback("Transaksi dihapus.");
      await loadData(filterJenis);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal menghapus transaksi."
      );
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <header className="flex items-center justify-between pt-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            PESAT GO!
          </p>
          <h1 className="text-lg font-bold text-stone-900">
            Keuangan Pekarangan
          </h1>
        </div>
        <button
          type="button"
          onClick={() => {
            setShowForm((prev) => !prev);
            setError(null);
          }}
          className="rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
        >
          {showForm ? "Tutup Form" : "+ Catat Kas"}
        </button>
      </header>

      {/* Kartu Ringkasan Saldo */}
      <section className="rounded-2xl bg-emerald-700 p-4 text-white shadow-xs space-y-3">
        <div>
          <p className="text-xs text-emerald-100">Saldo Bersih</p>
          <p className="text-2xl font-bold mt-0.5">
            {formatRupiah(summary.saldoBersih)}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-600/80 text-xs">
          <div>
            <p className="text-emerald-200">Total Pemasukan</p>
            <p className="font-semibold text-white mt-0.5">
              {formatRupiah(summary.totalPemasukan)}
            </p>
          </div>
          <div>
            <p className="text-emerald-200">Total Pengeluaran</p>
            <p className="font-semibold text-white mt-0.5">
              {formatRupiah(summary.totalPengeluaran)}
            </p>
          </div>
        </div>
      </section>

      {feedback && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-medium text-emerald-800">
          {feedback}
        </div>
      )}
      {error && (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-3 text-xs text-red-700"
        >
          {error}
        </div>
      )}

      {/* Form Tambah Transaksi */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-stone-200 bg-white p-4 space-y-3 shadow-xs"
        >
          <h2 className="text-sm font-bold text-stone-900">
            Tambah Transaksi
          </h2>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setJenis("PEMASUKAN")}
              className={`rounded-xl py-2 text-xs font-semibold border transition ${
                jenis === "PEMASUKAN"
                  ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                  : "border-stone-200 bg-white text-stone-600"
              }`}
            >
              Pemasukan (+)
            </button>
            <button
              type="button"
              onClick={() => setJenis("PENGELUARAN")}
              className={`rounded-xl py-2 text-xs font-semibold border transition ${
                jenis === "PENGELUARAN"
                  ? "border-rose-600 bg-rose-50 text-rose-800"
                  : "border-stone-200 bg-white text-stone-600"
              }`}
            >
              Pengeluaran (-)
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Kategori *
              </label>
              <input
                type="text"
                required
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                placeholder={
                  jenis === "PEMASUKAN"
                    ? "Penjualan Panen"
                    : "Pupuk / Bibit"
                }
                className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Nominal (Rp) *
              </label>
              <input
                type="number"
                required
                min={1}
                step="any"
                value={nominal}
                onChange={(e) => setNominal(e.target.value)}
                placeholder="50000"
                className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Tanggal *
              </label>
              <input
                type="date"
                required
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Keterangan
              </label>
              <input
                type="text"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Opsional"
                className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {submitting ? "Menyimpan..." : "Simpan Transaksi"}
          </button>
        </form>
      )}

      {/* Filter Jenis */}
      <div className="flex gap-1.5">
        {(
          [
            { key: "SEMUA", label: "Semua" },
            { key: "PEMASUKAN", label: "Pemasukan" },
            { key: "PENGELUARAN", label: "Pengeluaran" },
          ] as { key: FilterJenis; label: string }[]
        ).map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilterJenis(tab.key)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              filterJenis === tab.key
                ? "bg-emerald-700 text-white"
                : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Riwayat Transaksi */}
      {loading ? (
        <div className="rounded-2xl bg-white p-6 text-center text-xs text-stone-500 border border-stone-200/80">
          Memuat riwayat transaksi...
        </div>
      ) : transaksi.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 text-center border border-stone-200/80 space-y-1">
          <p className="text-sm font-semibold text-stone-800">
            Belum ada transaksi
          </p>
          <p className="text-xs text-stone-500">
            Catat pemasukan atau pengeluaran pekarangan melalui tombol "+ Catat Kas".
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {transaksi.map((item) => {
            const isMasuk = item.jenis === "PEMASUKAN";
            return (
              <div
                key={item.id}
                className="rounded-2xl border border-stone-200/80 bg-white p-3.5 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-stone-900 truncate">
                    {item.kategori}
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {formatTanggal(item.tanggal)}
                    {item.keterangan ? ` · ${item.keterangan}` : ""}
                  </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <span
                    className={`text-sm font-bold ${
                      isMasuk ? "text-emerald-700" : "text-rose-600"
                    }`}
                  >
                    {isMasuk ? "+" : "-"}
                    {formatRupiah(item.nominal)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDelete(item)}
                    className="rounded-lg border border-stone-200 px-2 py-1 text-[11px] font-medium text-stone-500 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}