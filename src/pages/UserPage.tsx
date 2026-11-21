import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/client";
import { useAuth } from "../context/AuthContext";

interface ProfilUser {
  id: string;
  nama: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

const formatTanggal = (iso?: string) => {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d);
};

export function UserPage() {
  const auth = useAuth() as {
    user?: ProfilUser | null;
    logout: () => void;
    setUser?: (u: ProfilUser) => void;
    refreshUser?: () => Promise<void>;
  };

  const { user, logout } = auth;
  const [profil, setProfil] = useState<ProfilUser | null>(user ?? null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // State edit nama profil
  const [editingNama, setEditingNama] = useState(false);
  const [namaInput, setNamaInput] = useState(user?.nama ?? "");
  const [savingNama, setSavingNama] = useState(false);

  // State ganti password
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    let active = true;

    apiFetch<{ user: ProfilUser }>("/api/auth/me")
      .then((res) => {
        if (!active || !res.user) return;
        setProfil(res.user);
        setNamaInput(res.user.nama);
        auth.setUser?.(res.user);
      })
      .catch((err: Error) => {
        if (!active) return;
        setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleUpdateNama = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFeedback(null);

    const trimmed = namaInput.trim();
    if (trimmed.length < 2) {
      setError("Nama lengkap minimal 2 karakter.");
      return;
    }

    setSavingNama(true);
    try {
      const res = await apiFetch<{ user: ProfilUser; message?: string }>(
        "/api/auth/me",
        {
          method: "PATCH",
          body: JSON.stringify({ nama: trimmed }),
        }
      );

      if (res.user) {
        setProfil(res.user);
        setNamaInput(res.user.nama);
        auth.setUser?.(res.user);
      }
      await auth.refreshUser?.();

      setEditingNama(false);
      setFeedback(res.message || "Nama profil berhasil diperbarui.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal memperbarui nama profil."
      );
    } finally {
      setSavingNama(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFeedback(null);

    if (!currentPassword) {
      setError("Password lama wajib diisi.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password baru minimal 8 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Konfirmasi password baru tidak cocok.");
      return;
    }

    setSavingPassword(true);
    try {
      const res = await apiFetch<{ message?: string }>("/api/auth/password", {
        method: "PATCH",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false);
      setFeedback(res.message || "Password berhasil diperbarui.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal memperbarui password."
      );
    } finally {
      setSavingPassword(false);
    }
  };

  const displayName = profil?.nama || user?.nama || "Pekarang";
  const displayEmail = profil?.email || user?.email || "-";

  return (
    <div className="p-4 space-y-4">
      <header className="pt-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
          PESAT GO!
        </p>
        <h1 className="text-lg font-bold text-stone-900">Profil Pengguna</h1>
      </header>

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

      {/* Kartu Info Akun */}
      <section className="rounded-2xl border border-stone-200/80 bg-white p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-base flex items-center justify-center shrink-0">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-stone-900 truncate">
                {displayName}
              </h2>
              <p className="text-xs text-stone-500 truncate">{displayEmail}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingNama((prev) => !prev);
              setNamaInput(displayName);
              setError(null);
            }}
            className="shrink-0 rounded-xl border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100"
          >
            {editingNama ? "Batal" : "Edit Nama"}
          </button>
        </div>

        {editingNama && (
          <form
            onSubmit={handleUpdateNama}
            className="pt-3 border-t border-stone-100 space-y-2.5"
          >
            <div>
              <label
                htmlFor="profil-nama"
                className="block text-xs font-semibold text-stone-700 mb-1"
              >
                Nama Lengkap Baru
              </label>
              <input
                id="profil-nama"
                type="text"
                required
                minLength={2}
                maxLength={100}
                value={namaInput}
                onChange={(e) => setNamaInput(e.target.value)}
                className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-emerald-600 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={savingNama}
              className="w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {savingNama ? "Menyimpan..." : "Simpan Nama"}
            </button>
          </form>
        )}

        <div className="pt-3 border-t border-stone-100 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-stone-500">Status Akun</span>
            <span className="font-semibold text-emerald-700">Aktif</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Terdaftar Sejak</span>
            <span className="font-medium text-stone-800">
              {loading ? "Memuat..." : formatTanggal(profil?.createdAt)}
            </span>
          </div>
        </div>
      </section>

      {/* Panel Ganti Password */}
      <section className="rounded-2xl border border-stone-200/80 bg-white p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-stone-900">Keamanan Akun</h3>
            <p className="text-xs text-stone-500">
              Perbarui kata sandi secara berkala.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowPasswordForm((prev) => !prev);
              setError(null);
            }}
            className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-100"
          >
            {showPasswordForm ? "Tutup" : "Ganti Sandi"}
          </button>
        </div>

        {showPasswordForm && (
          <form
            onSubmit={handleUpdatePassword}
            className="pt-2 border-t border-stone-100 space-y-2.5"
          >
            <div>
              <label
                htmlFor="current-password"
                className="block text-xs font-semibold text-stone-700 mb-1"
              >
                Password Lama *
              </label>
              <input
                id="current-password"
                type="password"
                autoComplete="current-password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="new-password"
                className="block text-xs font-semibold text-stone-700 mb-1"
              >
                Password Baru (min. 8 karakter) *
              </label>
              <input
                id="new-password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="block text-xs font-semibold text-stone-700 mb-1"
              >
                Konfirmasi Password Baru *
              </label>
              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={savingPassword}
              className="w-full rounded-xl bg-emerald-600 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {savingPassword ? "Memperbarui..." : "Simpan Password Baru"}
            </button>
          </form>
        )}
      </section>

      {/* Tombol Keluar */}
      <section className="pt-1">
        <button
          type="button"
          onClick={logout}
          className="w-full rounded-2xl border border-red-200 bg-red-50 py-3 px-4 text-sm font-semibold text-red-700 hover:bg-red-100 transition"
        >
          Keluar dari Akun
        </button>
      </section>
    </div>
  );
}