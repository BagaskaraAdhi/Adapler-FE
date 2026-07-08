import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiEyeLine, RiEyeOffLine, RiArrowLeftLine } from "@remixicon/react";
import { useTheme } from "../Component/ThemeContext";

function ForgotPassword() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  // State Manajemen
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [errors, setErrors] = useState({});

  // State Data Input
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State untuk menyimpan token
  const [resetToken, setResetToken] = useState("");

  // State Visibilitas Password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // URL API Backend
  const API_BASE_URL = "https://adapler-api.inidito.my.id";

  // ==========================================
  // STEP 1: Kirim Email (POST /forgot-password)
  // ==========================================
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setErrors({});

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setErrors({ email: "Email tidak boleh kosong." });
      return;
    } else if (!emailRegex.test(email)) {
      setErrors({ email: "Format email tidak valid." });
      return;
    }

    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch(`${API_BASE_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Gagal mengirim OTP. Pastikan email terdaftar.",
        );
      }

      setMessage({
        text: "Kode OTP telah dikirim ke emailmu.",
        type: "success",
      });
      setStep(2);
    } catch (error) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // STEP 2: Verifikasi OTP (POST /forgot-password/verify-otp)
  // ==========================================
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otpCode) return;

    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch(
        `${API_BASE_URL}/forgot-password/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code: otpCode }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Kode OTP salah atau kedaluwarsa.",
        );
      }

      // PERBAIKAN DI SINI: Coba ambil data JSON jika ada
      const data = await response.json().catch(() => ({}));

      // Cari token dengan berbagai kemungkinan key dari BE (token, data.token)
      const tokenFromBE = data.token || (data.data && data.data.token);

      if (tokenFromBE) {
        setResetToken(tokenFromBE); // Gunakan token rahasia dari backend
      } else {
        setResetToken(otpCode); // Fallback: Gunakan kode OTP sebagai token
      }

      setMessage({
        text: "Verifikasi berhasil! Silakan buat password baru.",
        type: "success",
      });
      setStep(3);
    } catch (error) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // STEP 3: Reset Password (POST /forgot-password/reset-password)
  // ==========================================
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrors({});

    let newErrors = {};
    let isValid = true;

    if (!newPassword) {
      newErrors.newPassword = "Password baru tidak boleh kosong.";
      isValid = false;
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Password minimal 8 karakter.";
      isValid = false;
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Password tidak cocok.";
      isValid = false;
    }

    if (!isValid) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch(
        `${API_BASE_URL}/forgot-password/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: resetToken, // Kini token dijamin tidak kosong
            newPassword: newPassword,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Gagal mengubah password.");
      }

      setMessage({
        text: "Password berhasil diubah! Mengalihkan ke login...",
        type: "success",
      });

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 transition-colors duration-300 flex items-center justify-center p-4 font-sans text-gray-800 dark:text-gray-200">
      <div className="card w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl shadow-blue-900/10 dark:shadow-none border border-blue-50 dark:border-gray-700 transition-colors duration-300 relative overflow-hidden">
        {step === 1 && (
          <Link
            to="/login"
            className="absolute top-4 left-4 btn btn-circle btn-ghost btn-sm text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
          >
            <RiArrowLeftLine size={20} />
          </Link>
        )}

        <div className="card-body mt-2">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">
              {step === 1
                ? "Lupa Password?"
                : step === 2
                  ? "Verifikasi OTP"
                  : "Buat Password Baru"}
            </h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">
              {step === 1
                ? "Masukkan email yang terdaftar untuk mengatur ulang passwordmu."
                : step === 2
                  ? `Masukkan kode 6 digit yang dikirim ke ${email}`
                  : "Silakan masukkan password baru untuk akunmu."}
            </p>
          </div>

          {message.text && (
            <div
              className={`alert ${
                message.type === "error"
                  ? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800"
                  : "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-100 dark:border-green-800"
              } text-sm p-3 mb-4 rounded-lg`}
            >
              <span>{message.text}</span>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleSendOTP}>
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700 dark:text-gray-300">
                    Email Terdaftar
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="email@kampus.ac.id"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({});
                  }}
                  className={`input input-bordered w-full bg-white dark:bg-gray-900 text-gray-800 dark:text-white transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${
                    errors.email
                      ? "border-error border-2 bg-red-50/5 focus:ring-error"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
                />
                {errors.email && (
                  <span className="text-error text-sm font-medium mt-1 block px-1">
                    {errors.email}
                  </span>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="btn bg-orange-500 hover:bg-orange-600 text-white border-none w-full mt-6 shadow-md shadow-orange-500/30 font-bold"
              >
                {isLoading ? "Mengirim..." : "Kirim Kode OTP"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOTP}>
              <div className="form-control">
                <input
                  type="text"
                  placeholder="Kode OTP"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  required
                  className="input input-bordered text-center text-2xl tracking-widest bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="flex flex-col gap-2 mt-6">
                <button
                  type="submit"
                  disabled={isLoading || !otpCode}
                  className="btn bg-orange-500 hover:bg-orange-600 text-white border-none w-full font-bold shadow-md shadow-orange-500/30"
                >
                  {isLoading ? "Memverifikasi..." : "Verifikasi OTP"}
                </button>
                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={isLoading}
                  className="btn btn-ghost btn-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700"
                >
                  Kirim Ulang Kode
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleResetPassword}>
              <div className="form-control w-full relative">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700 dark:text-gray-300">
                    Password Baru
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setErrors({});
                    }}
                    className={`input input-bordered w-full pr-10 bg-white dark:bg-gray-900 text-gray-800 dark:text-white border-gray-200 dark:border-gray-700 transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${errors.newPassword ? "input-error" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    {showPassword ? (
                      <RiEyeOffLine size={20} />
                    ) : (
                      <RiEyeLine size={20} />
                    )}
                  </button>
                </div>
                {errors.newPassword && (
                  <span className="text-error text-sm font-medium mt-1 block px-1">
                    {errors.newPassword}
                  </span>
                )}
              </div>

              <div className="form-control w-full mt-3 relative">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700 dark:text-gray-300">
                    Konfirmasi Password
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setErrors({});
                    }}
                    className={`input input-bordered w-full pr-10 bg-white dark:bg-gray-900 text-gray-800 dark:text-white border-gray-200 dark:border-gray-700 transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${errors.confirmPassword ? "input-error" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    {showConfirmPassword ? (
                      <RiEyeOffLine size={20} />
                    ) : (
                      <RiEyeLine size={20} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="text-error text-sm font-medium mt-1 block px-1">
                    {errors.confirmPassword}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn bg-orange-500 hover:bg-orange-600 text-white border-none w-full mt-6 shadow-md shadow-orange-500/30 font-bold"
              >
                {isLoading ? "Menyimpan..." : "Ubah Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
