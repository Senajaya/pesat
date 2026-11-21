import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

interface LoginPageProps {
  onBackLanding: () => void;
  onGoRegister: () => void;
  onSuccess: () => void;
}

export function LoginPage({
  onBackLanding,
  onGoRegister,
  onSuccess,
}: LoginPageProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Email dan kata sandi wajib diisi.");
      return;
    }

    setSubmitting(true);
    try {
      await login(email.trim(), password);
      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Gagal masuk. Periksa kembali akun Anda."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-sky-100 text-stone-900 p-5 flex flex-col justify-between bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('/login.jpg')` }}
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

      {/* Card Form Masuk */}
      <div className="my-auto rounded-3xl border border-white/80 bg-white/92 backdrop-blur-md p-5 shadow-xl space-y-4">
        <div className="text-center space-y-1">
          <h1 className="text-xl font-extrabold text-emerald-950">Selamat Datang!</h1>
          <p className="text-xs text-stone-600">
            Akses data tanaman, panen, dan keuangan pekarangan Anda.
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

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label
              htmlFor="login-email"
              className="block text-xs font-semibold text-stone-700 mb-1"
            >
              Email
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="block text-xs font-semibold text-stone-700 mb-1"
            >
              Kata Sandi
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi"
                className="w-full rounded-xl border border-stone-300 bg-white py-2.5 pl-3.5 pr-16 text-sm text-stone-900 placeholder:text-stone-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-50"
              >
                {showPassword ? "Sembunyi" : "Lihat"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-emerald-600 py-3.5 px-4 text-sm font-bold text-white shadow hover:bg-emerald-700 disabled:opacity-60 transition mt-1"
          >
            {submitting ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className="pt-1 text-center text-xs text-stone-600">
          Belum punya akun?{" "}
          <button
            type="button"
            onClick={onGoRegister}
            className="font-bold text-emerald-700 hover:underline"
          >
            Daftar di sini
          </button>
        </p>
      </div>

      <div className="h-4" />
    </div>
  );
}