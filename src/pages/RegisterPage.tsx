import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

interface RegisterPageProps {
  onBackLanding: () => void;
  onGoLogin: () => void;
  onSuccess: () => void;
}

export function RegisterPage({
  onBackLanding,
  onGoLogin,
  onSuccess,
}: RegisterPageProps) {
  const { register } = useAuth();
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (nama.trim().length < 2) {
      setError("Nama lengkap minimal 2 karakter.");
      return;
    }
    if (password.length < 8) {
      setError("Kata sandi minimal 8 karakter.");
      return;
    }
    if (password !== konfirmasiPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setSubmitting(true);
    try {
      await register(nama.trim(), email.trim(), password);
      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Pendaftaran gagal. Silakan coba lagi."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-sky-100 text-stone-900 p-5 flex flex-col justify-between bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('/register.jpg')` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={onBackLanding}
          className="rounded-xl border border-white/80 bg-white/90 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-stone-700 shadow-xs hover:bg-white"
        >
          ← Kembali
        </button>
        <span className="rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-extrabold text-emerald-800 shadow-xs">
          PESAT GO!
        </span>
      </div>

      {/* Card Form Daftar */}
      <div className="my-auto rounded-3xl border border-white/80 bg-white/92 backdrop-blur-md p-5 shadow-xl space-y-3.5">
        <div className="text-center space-y-1">
          <h1 className="text-xl font-extrabold text-emerald-950">Buat Akun Baru</h1>
          <p className="text-xs text-stone-600">
            Mulai kelola tanaman dan keuangan pekarangan Anda di PESAT GO!.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-3 text-xs text-red-700"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label
              htmlFor="reg-nama"
              className="block text-xs font-semibold text-stone-700 mb-1"
            >
              Nama Lengkap
            </label>
            <input
              id="reg-nama"
              type="text"
              autoComplete="name"
              required
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Nama lengkap Anda"
              className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
            />
          </div>

          <div>
            <label
              htmlFor="reg-email"
              className="block text-xs font-semibold text-stone-700 mb-1"
            >
              Email
            </label>
            <input
              id="reg-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
            />
          </div>

          <div>
            <label
              htmlFor="reg-password"
              className="block text-xs font-semibold text-stone-700 mb-1"
            >
              Kata Sandi
            </label>
            <input
              id="reg-password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
              className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
            />
          </div>

          <div>
            <label
              htmlFor="reg-konfirmasi"
              className="block text-xs font-semibold text-stone-700 mb-1"
            >
              Konfirmasi Kata Sandi
            </label>
            <input
              id="reg-konfirmasi"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={konfirmasiPassword}
              onChange={(e) => setKonfirmasiPassword(e.target.value)}
              placeholder="Ulangi kata sandi"
              className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-emerald-600 py-3.5 px-4 text-sm font-bold text-white shadow hover:bg-emerald-700 disabled:opacity-60 transition mt-1"
          >
            {submitting ? "Mendaftarkan..." : "Daftar Sekarang"}
          </button>
        </form>

        <p className="pt-1 text-center text-xs text-stone-600">
          Sudah punya akun?{" "}
          <button
            type="button"
            onClick={onGoLogin}
            className="font-bold text-emerald-700 hover:underline"
          >
            Masuk di sini
          </button>
        </p>
      </div>

      <div className="h-4" />
    </div>
  );
}