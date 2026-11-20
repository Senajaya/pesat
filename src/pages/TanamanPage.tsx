import React, { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../api/client";

export type StatusTanaman = "DITANAM" | "BELUM_PANEN" | "SUDAH_PANEN";

export interface PanenItem {
  id: string;
  tanamanId: string;
  tanggalPanen: string;
  jumlahHasil: string;
  hasilPenjualan: string | number;
  catatan?: string | null;
}

export interface TanamanItem {
  id: string;
  namaTanaman: string;
  varietas?: string | null;
  tanggalTanam: string;
  jumlahBibit: string;
  modalAwal: string | number;
  lokasiTanam?: string | null;
  status: StatusTanaman;
  panen: PanenItem[];
}

type FilterTab = "SEMUA" | StatusTanaman;

const STATUS_BADGE: Record<
  StatusTanaman,
  { label: string; badgeClass: string }
> = {
  DITANAM: {
    label: "Ditanam",
    badgeClass: "bg-emerald-100 text-emerald-800",
  },
  BELUM_PANEN: {
    label: "Belum Panen",
    badgeClass: "bg-amber-100 text-amber-800",
  },
  SUDAH_PANEN: {
    label: "Sudah Panen",
    badgeClass: "bg-sky-100 text-sky-800",
  },
};

const formatTanggal = (iso: string) =>
  new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));

const formatRupiah = (val: string | number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(val) || 0);

const todayInputValue = () => new Date().toISOString().slice(0, 10);

export function TanamanPage() {
  const [items, setItems] = useState<TanamanItem[]>([]);
  const [filterTab, setFilterTab] = useState<FilterTab>("SEMUA");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // State form tambah tanaman
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [namaTanaman, setNamaTanaman] = useState("");
  const [varietas, setVarietas] = useState("");
  const [tanggalTanam, setTanggalTanam] = useState(todayInputValue);
  const [jumlahBibit, setJumlahBibit] = useState("");
  const [modalAwal, setModalAwal] = useState("0");
  const [lokasiTanam, setLokasiTanam] = useState("");
  const [submittingCreate, setSubmittingCreate] = useState(false);

  // State modal/form catat panen
  const [panenTarget, setPanenTarget] = useState<TanamanItem | null>(null);
  const [tanggalPanen, setTanggalPanen] = useState(todayInputValue);
  const [jumlahHasil, setJumlahHasil] = useState("");
  const [hasilPenjualan, setHasilPenjualan] = useState("0");
  const [catatanPanen, setCatatanPanen] = useState("");
  const [tandaiSudahPanen, setTandaiSudahPanen] = useState(true);
  const [submittingPanen, setSubmittingPanen] = useState(false);

  const loadTanaman = useCallback(async (tab: FilterTab) => {
    setLoading(true);
    setError(null);
    try {
      const query = tab === "SEMUA" ? "" : `?status=${tab}`;
      const res = await apiFetch<{ data: TanamanItem[] }>(`/api/tanaman${query}`);
      setItems(res.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal memuat data tanaman."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTanaman(filterTab);
  }, [filterTab, loadTanaman]);

  const handleCreateTanaman = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFeedback(null);

    if (!namaTanaman.trim() || !jumlahBibit.trim()) {
      setError("Nama tanaman dan jumlah bibit wajib diisi.");
      return;
    }

    setSubmittingCreate(true);
    try {
      await apiFetch("/api/tanaman", {
        method: "POST",
        body: JSON.stringify({
          namaTanaman: namaTanaman.trim(),
          varietas: varietas.trim() || null,
          tanggalTanam,
          jumlahBibit: jumlahBibit.trim(),
          modalAwal: Number(modalAwal) || 0,
          lokasiTanam: lokasiTanam.trim() || null,
        }),
      });

      setNamaTanaman("");
      setVarietas("");
      setTanggalTanam(todayInputValue());
      setJumlahBibit("");
      setModalAwal("0");
      setLokasiTanam("");
      setShowCreateForm(false);
      setFeedback("Tanaman baru berhasil dicatat.");
      await loadTanaman(filterTab);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal menyimpan data tanaman."
      );
    } finally {
      setSubmittingCreate(false);
    }
  };

  const handleStatusChange = async (id: string, nextStatus: StatusTanaman) => {
    setError(null);
    setFeedback(null);
    try {
      await apiFetch(`/api/tanaman/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });
      setFeedback("Status tanaman diperbarui.");
      await loadTanaman(filterTab);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal memperbarui status tanaman."
      );
    }
  };

  const openPanenModal = (tanaman: TanamanItem) => {
    setPanenTarget(tanaman);
    setTanggalPanen(todayInputValue());
    setJumlahHasil("");
    setHasilPenjualan("0");
    setCatatanPanen("");
    setTandaiSudahPanen(true);
    setError(null);
  };

  const handleCatatPanen = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!panenTarget) return;
    if (!jumlahHasil.trim()) {
      setError("Jumlah hasil panen wajib diisi.");
      return;
    }

    setSubmittingPanen(true);
    setError(null);
    setFeedback(null);
    try {
      await apiFetch(`/api/tanaman/${panenTarget.id}/panen`, {
        method: "POST",
        body: JSON.stringify({
          tanggalPanen,
          jumlahHasil: jumlahHasil.trim(),
          hasilPenjualan: Number(hasilPenjualan) || 0,
          catatan: catatanPanen.trim() || null,
          tandaiSudahPanen,
        }),
      });

      setPanenTarget(null);
      setFeedback(`Panen ${panenTarget.namaTanaman} berhasil dicatat.`);
      await loadTanaman(filterTab);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal mencatat hasil panen."
      );
    } finally {
      setSubmittingPanen(false);
    }
  };

  const handleDeleteTanaman = async (tanaman: TanamanItem) => {
    setError(null);
    setFeedback(null);
    try {
      await apiFetch(`/api/tanaman/${tanaman.id}`, { method: "DELETE" });
      setFeedback(`Tanaman "${tanaman.namaTanaman}" dihapus.`);
      await loadTanaman(filterTab);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal menghapus data tanaman."
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
          <h1 className="text-lg font-bold text-stone-900">Tanaman Saya</h1>
        </div>
        <button
          type="button"
          onClick={() => {
            setShowCreateForm((prev) => !prev);
            setError(null);
          }}
          className="rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
        >
          {showCreateForm ? "Tutup Form" : "+ Tambah Tanam"}
        </button>
      </header>

      {/* Notifikasi */}
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

      {/* Form Tambah Tanaman */}
      {showCreateForm && (
        <form
          onSubmit={handleCreateTanaman}
          className="rounded-2xl border border-stone-200 bg-white p-4 space-y-3 shadow-xs"
        >
          <h2 className="text-sm font-bold text-stone-900">
            Catat Tanaman Baru
          </h2>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Nama Tanaman *
            </label>
            <input
              type="text"
              required
              value={namaTanaman}
              onChange={(e) => setNamaTanaman(e.target.value)}
              placeholder="Contoh: Cabai Rawit, Sawi, Terong"
              className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Tanggal Tanam *
              </label>
              <input
                type="date"
                required
                value={tanggalTanam}
                onChange={(e) => setTanggalTanam(e.target.value)}
                className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Jumlah Bibit *
              </label>
              <input
                type="text"
                required
                value={jumlahBibit}
                onChange={(e) => setJumlahBibit(e.target.value)}
                placeholder="Contoh: 25 polybag"
                className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Varietas
              </label>
              <input
                type="text"
                value={varietas}
                onChange={(e) => setVarietas(e.target.value)}
                placeholder="Opsional"
                className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Lokasi Tanam
              </label>
              <input
                type="text"
                value={lokasiTanam}
                onChange={(e) => setLokasiTanam(e.target.value)}
                placeholder="Contoh: Samping rumah"
                className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Modal Awal / Bibit (Rp)
            </label>
            <input
              type="number"
              min={0}
              step="any"
              value={modalAwal}
              onChange={(e) => setModalAwal(e.target.value)}
              placeholder="0"
              className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
            />
            <p className="text-[11px] text-stone-500 mt-1">
              Jika lebih dari 0, otomatis tercatat sebagai pengeluaran Modal Awal.
            </p>
          </div>

          <button
            type="submit"
            disabled={submittingCreate}
            className="w-full rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {submittingCreate ? "Menyimpan..." : "Simpan Tanaman"}
          </button>
        </form>
      )}

      {/* Filter Tab Status */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {(
          [
            { key: "SEMUA", label: "Semua" },
            { key: "DITANAM", label: "Ditanam" },
            { key: "BELUM_PANEN", label: "Belum Panen" },
            { key: "SUDAH_PANEN", label: "Sudah Panen" },
          ] as { key: FilterTab; label: string }[]
        ).map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilterTab(tab.key)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              filterTab === tab.key
                ? "bg-emerald-700 text-white"
                : "bg-white text-stone-600 border border-stone-200 hover:bg-stone-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Daftar Tanaman */}
      {loading ? (
        <div className="rounded-2xl bg-white p-6 text-center text-xs text-stone-500 border border-stone-200/80">
          Memuat data tanaman...
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl bg-white p-6 text-center border border-stone-200/80 space-y-2">
          <p className="text-sm font-semibold text-stone-800">
            Belum ada data tanaman
          </p>
          <p className="text-xs text-stone-500">
            Klik tombol "+ Tambah Tanam" untuk mulai mencatat tanaman pekarangan.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const badge = STATUS_BADGE[item.status];
            const panenTerakhir = item.panen?.[0];

            return (
              <article
                key={item.id}
                className="rounded-2xl border border-stone-200/80 bg-white p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-bold text-stone-900">
                      {item.namaTanaman}
                      {item.varietas ? (
                        <span className="font-normal text-stone-500">
                          {" "}
                          · {item.varietas}
                        </span>
                      ) : null}
                    </h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Tanam: {formatTanggal(item.tanggalTanam)} ·{" "}
                      {item.jumlahBibit}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${badge.badgeClass}`}
                  >
                    {badge.label}
                  </span>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-600">
                  <span>Modal: {formatRupiah(item.modalAwal)}</span>
                  {item.lokasiTanam && <span>Lokasi: {item.lokasiTanam}</span>}
                </div>

                {panenTerakhir && (
                  <div className="rounded-xl bg-stone-50 border border-stone-200/70 p-2.5 text-xs text-stone-700">
                    <p className="font-semibold text-emerald-800">
                      Panen terakhir: {formatTanggal(panenTerakhir.tanggalPanen)}{" "}
                      ({panenTerakhir.jumlahHasil})
                    </p>
                    {Number(panenTerakhir.hasilPenjualan) > 0 && (
                      <p className="text-[11px] text-stone-600 mt-0.5">
                        Hasil jual: {formatRupiah(panenTerakhir.hasilPenjualan)}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-100">
                  <select
                    aria-label={`Ubah status ${item.namaTanaman}`}
                    value={item.status}
                    onChange={(e) =>
                      handleStatusChange(item.id, e.target.value as StatusTanaman)
                    }
                    className="rounded-xl border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-xs font-medium text-stone-700 focus:border-emerald-600 focus:outline-none"
                  >
                    <option value="DITANAM">Ditanam</option>
                    <option value="BELUM_PANEN">Belum Panen</option>
                    <option value="SUDAH_PANEN">Sudah Panen</option>
                  </select>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openPanenModal(item)}
                      className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                    >
                      Catat Panen
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTanaman(item)}
                      className="rounded-xl border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Modal / Panel Catat Panen */}
      {panenTarget && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4"
        >
          <form
            onSubmit={handleCatatPanen}
            className="w-full max-w-md rounded-3xl bg-white p-5 space-y-3 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-stone-900">
                Catat Panen · {panenTarget.namaTanaman}
              </h2>
              <button
                type="button"
                onClick={() => setPanenTarget(null)}
                className="rounded-lg px-2 py-1 text-xs font-semibold text-stone-500 hover:bg-stone-100"
              >
                Tutup
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Tanggal Panen *
                </label>
                <input
                  type="date"
                  required
                  value={tanggalPanen}
                  onChange={(e) => setTanggalPanen(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Jumlah Hasil *
                </label>
                <input
                  type="text"
                  required
                  value={jumlahHasil}
                  onChange={(e) => setJumlahHasil(e.target.value)}
                  placeholder="Contoh: 3,5 kg"
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Hasil Penjualan (Rp)
              </label>
              <input
                type="number"
                min={0}
                step="any"
                value={hasilPenjualan}
                onChange={(e) => setHasilPenjualan(e.target.value)}
                placeholder="0 jika dikonsumsi sendiri"
                className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Catatan
              </label>
              <input
                type="text"
                value={catatanPanen}
                onChange={(e) => setCatatanPanen(e.target.value)}
                placeholder="Opsional"
                className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <label className="flex items-center gap-2 text-xs text-stone-700 pt-1">
              <input
                type="checkbox"
                checked={tandaiSudahPanen}
                onChange={(e) => setTandaiSudahPanen(e.target.checked)}
                className="rounded border-stone-300 text-emerald-600 focus:ring-emerald-600"
              />
              Ubah status tanaman menjadi Sudah Panen
            </label>

            <button
              type="submit"
              disabled={submittingPanen}
              className="w-full rounded-2xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {submittingPanen ? "Menyimpan..." : "Simpan Hasil Panen"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}