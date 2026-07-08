import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiGoogleFill, RiEyeLine, RiEyeOffLine } from "@remixicon/react";
import { useTheme } from "../Component/ThemeContext"; // Sesuaikan path ini

function Register() {
  const { isDarkMode } = useTheme(); // Panggil context tema
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Tambahkan confirmPassword ke state
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Tambahkan confirmPassword ke state error
  const [errors, setErrors] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // State untuk toggle visibilitas password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [otpCode, setOtpCode] = useState("");

  // URL API dari tim Backend
  const API_BASE_URL = "https://adapler-api.inidito.my.id";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateRegister = () => {
    let isValid = true;
    let newErrors = {
      fullname: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!formData.fullname.trim()) {
      newErrors.fullname = "Nama lengkap tidak boleh kosong.";
      isValid = false;
    } else if (formData.fullname.trim().length < 3) {
      newErrors.fullname = "Nama lengkap minimal 3 karakter.";
      isValid = false;
    }

    if (!formData.username.trim()) {
      newErrors.username = "Username tidak boleh kosong.";
      isValid = false;
    } else if (/\s/.test(formData.username)) {
      newErrors.username = "Username tidak boleh mengandung spasi.";
      isValid = false;
    } else if (formData.username.trim().length < 4) {
      newErrors.username = "Username minimal 4 karakter.";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email tidak boleh kosong.";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Format email tidak valid (contoh: nama@kampus.ac.id).";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password tidak boleh kosong.";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password harus memiliki minimal 8 karakter.";
      isValid = false;
    }

    // Validasi Confirm Password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi password tidak boleh kosong.";
      isValid = false;
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Password tidak cocok.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // 1. Integrasi API Registrasi (POST /users)
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateRegister()) return;

    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname: formData.fullname,
          username: formData.username,
          email: formData.email,
          password: formData.password, // Confirm password tidak perlu dikirim ke backend
        }),
      });

      // Menangani response dari backend
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            "Gagal mendaftar. Pastikan email atau username belum terpakai.",
        );
      }

      setMessage({
        text: "Pendaftaran berhasil! Kode OTP telah dikirim ke emailmu.",
        type: "success",
      });
      setStep(2); // Pindah ke tahap verifikasi OTP
    } catch (error) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Integrasi API Verifikasi OTP (POST /users/verify-otp)
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch(`${API_BASE_URL}/users/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          code: otpCode,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Kode OTP salah atau telah kedaluwarsa.",
        );
      }

      setMessage({
        text: "Verifikasi sukses! Mengalihkan ke halaman login...",
        type: "success",
      });
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Integrasi API Resend OTP (POST /users/resend-otp)
  const handleResendOTP = async () => {
    setMessage({ text: "Mengirim ulang OTP...", type: "info" });

    try {
      const response = await fetch(`${API_BASE_URL}/users/resend-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Gagal mengirim ulang kode OTP.");
      }

      setMessage({
        text: "OTP baru telah dikirim ke emailmu.",
        type: "success",
      });
    } catch (error) {
      setMessage({ text: error.message, type: "error" });
    }
  };

  const handleGoogleRegister = () => {
    alert(
      "Untuk login dengan Google, silakan integrasikan @react-oauth/google untuk mengambil idToken.",
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 transition-colors duration-300 flex items-center justify-center p-4 font-sans text-gray-800 dark:text-gray-200">
      <div className="card w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl shadow-blue-900/10 dark:shadow-none border border-blue-50 dark:border-gray-700 transition-colors duration-300">
        <div className="card-body">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-black italic tracking-tight text-blue-600 dark:text-blue-400">
              Adapler<span className="text-gray-800 dark:text-white">AI</span>
            </h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">
              {step === 1
                ? "Buat akun baru untuk mulai belajar."
                : "Verifikasi Email"}
            </p>
          </div>

          {message.text && (
            <div
              className={`alert ${
                message.type === "error"
                  ? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800"
                  : message.type === "info"
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800"
                    : "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-100 dark:border-green-800"
              } text-sm p-3 mb-4 rounded-lg`}
            >
              <span>{message.text}</span>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleRegister}>
              {/* NAMA LENGKAP */}
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700 dark:text-gray-300">
                    Nama Lengkap
                  </span>
                </label>
                <input
                  type="text"
                  name="fullname"
                  placeholder="John Doe"
                  className={`input input-bordered w-full bg-white dark:bg-gray-900 text-gray-800 dark:text-white border-gray-200 dark:border-gray-700 transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${errors.fullname ? "input-error" : ""}`}
                  value={formData.fullname}
                  onChange={handleInputChange}
                />
                {errors.fullname && (
                  <div className="text-left mt-1.5 px-1">
                    <span className="text-error text-sm font-medium block">
                      {errors.fullname}
                    </span>
                  </div>
                )}
              </div>

              {/* USERNAME */}
              <div className="form-control w-full mt-2">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700 dark:text-gray-300">
                    Username
                  </span>
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="johndoe123"
                  className={`input input-bordered w-full bg-white dark:bg-gray-900 text-gray-800 dark:text-white border-gray-200 dark:border-gray-700 transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${errors.username ? "input-error" : ""}`}
                  value={formData.username}
                  onChange={handleInputChange}
                />
                {errors.username && (
                  <div className="text-left mt-1.5 px-1">
                    <span className="text-error text-sm font-medium block">
                      {errors.username}
                    </span>
                  </div>
                )}
              </div>

              {/* EMAIL */}
              <div className="form-control w-full mt-2">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700 dark:text-gray-300">
                    Email
                  </span>
                </label>
                <input
                  type="text"
                  name="email"
                  placeholder="email@kampus.ac.id"
                  className={`input input-bordered w-full bg-white dark:bg-gray-900 text-gray-800 dark:text-white border-gray-200 dark:border-gray-700 transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${errors.email ? "input-error" : ""}`}
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && (
                  <div className="text-left mt-1.5 px-1">
                    <span className="text-error text-sm font-medium block">
                      {errors.email}
                    </span>
                  </div>
                )}
              </div>

              {/* PASSWORD */}
              <div className="form-control w-full mt-2 relative">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700 dark:text-gray-300">
                    Password
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    className={`input input-bordered w-full pr-10 bg-white dark:bg-gray-900 text-gray-800 dark:text-white border-gray-200 dark:border-gray-700 transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${errors.password ? "input-error" : ""}`}
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <RiEyeOffLine size={20} />
                    ) : (
                      <RiEyeLine size={20} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <div className="text-left mt-1.5 px-1">
                    <span className="text-error text-sm font-medium block">
                      {errors.password}
                    </span>
                  </div>
                )}
              </div>

              {/* TULIS ULANG PASSWORD */}
              <div className="form-control w-full mt-2 relative">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700 dark:text-gray-300">
                    Tulis Ulang Password
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="••••••••"
                    className={`input input-bordered w-full pr-10 bg-white dark:bg-gray-900 text-gray-800 dark:text-white border-gray-200 dark:border-gray-700 transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${errors.confirmPassword ? "input-error" : ""}`}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <RiEyeOffLine size={20} />
                    ) : (
                      <RiEyeLine size={20} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="text-left mt-1.5 px-1">
                    <span className="text-error text-sm font-medium block">
                      {errors.confirmPassword}
                    </span>
                  </div>
                )}
              </div>

              <div className="form-control mt-6">
                <button
                  type="submit"
                  className="btn bg-orange-500 hover:bg-orange-600 text-white border-none w-full text-base font-bold shadow-md shadow-orange-500/30"
                  disabled={isLoading}
                >
                  {isLoading ? "Memproses..." : "Daftar Sekarang"}
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOTP}>
              <p className="text-sm text-center mb-4 text-gray-500 dark:text-gray-400">
                Masukkan kode yang telah kami kirimkan ke{" "}
                <strong className="text-gray-800 dark:text-gray-200">
                  {formData.email}
                </strong>
              </p>
              <div className="form-control">
                <input
                  type="text"
                  placeholder="Kode OTP"
                  className="input input-bordered text-center text-2xl tracking-widest bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  required
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                />
              </div>
              <div className="form-control mt-6 gap-2">
                <button
                  type="submit"
                  className="btn bg-orange-500 hover:bg-orange-600 text-white border-none w-full text-base font-bold shadow-md shadow-orange-500/30"
                  disabled={isLoading || !otpCode}
                >
                  {isLoading ? "Memverifikasi..." : "Verifikasi OTP"}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm w-full text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700"
                  onClick={handleResendOTP}
                  disabled={isLoading}
                >
                  Kirim Ulang Kode
                </button>
              </div>
            </form>
          )}

          {step === 1 && (
            <>
              <div className="divider my-4 text-gray-400 dark:text-gray-600 text-sm">
                ATAU
              </div>

              {/* <div className="form-control mb-4">
                <button
                  type="button"
                  className="btn bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 w-full text-base font-bold flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm transition-colors"
                  onClick={handleGoogleRegister}
                >
                  <RiGoogleFill className="text-red-500" size={24} />
                  Daftar dengan Google
                </button>
              </div> */}

              <div className="text-center">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Sudah punya akun?
                </p>
                <Link
                  to="/login"
                  className="btn btn-ghost mt-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700"
                >
                  Masuk di sini
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Register;
