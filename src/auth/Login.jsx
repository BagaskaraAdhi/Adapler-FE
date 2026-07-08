import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiEyeLine, RiEyeOffLine, RiGoogleFill } from "@remixicon/react";
import { useTheme } from "../Component/ThemeContext";

function Login() {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showPassword, setShowPassword] = useState(false);

  const API_BASE_URL = "https://adapler-api.inidito.my.id";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    let isValid = true;
    let newErrors = { email: "", password: "" };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email tidak boleh kosong.";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Format email tidak valid (contoh: user@kampus.ac.id).";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password tidak boleh kosong.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // 1. Implementasi API Login Standar (POST /auth)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch(`${API_BASE_URL}/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            "Login gagal. Pastikan email dan password benar.",
        );
      }

      const responseData = await response.json();

      // PERBAIKAN: Sesuaikan dengan struktur JSON dari Backend
      const tokenFromBE = responseData.data && responseData.data.accessToken;

      if (tokenFromBE) {
        localStorage.setItem("authToken", tokenFromBE);
        setMessage({ text: "Login berhasil!", type: "success" });
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        throw new Error("Token tidak ditemukan dari respons server.");
      }
    } catch (error) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Implementasi API Login Google (POST /auth/google-login)
  const handleGoogleLogin = async (idToken) => {
    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch(`${API_BASE_URL}/auth/google-login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idToken: idToken,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Gagal login dengan Google.");
      }

      const responseData = await response.json();

      // PERBAIKAN: Sesuaikan dengan struktur JSON dari Backend
      const tokenFromBE = responseData.data && responseData.data.accessToken;

      if (tokenFromBE) {
        localStorage.setItem("authToken", tokenFromBE);
        setMessage({
          text: "Login Google berhasil! Mengalihkan...",
          type: "success",
        });
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        throw new Error("Token tidak ditemukan dari respons server.");
      }
    } catch (error) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // Simulasi klik tombol Google
  const onGoogleButtonClick = () => {
    // Di aplikasi nyata, kamu akan menggunakan package seperti @react-oauth/google di sini
    // untuk memunculkan popup Google dan mendapatkan idToken.
    // Setelah mendapatkan tokennya, kamu memanggil: handleGoogleLogin(tokenYangDidapat)

    alert(
      "Pasang @react-oauth/google di sini untuk mendapatkan idToken, lalu jalankan fungsi handleGoogleLogin(idToken).",
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 transition-colors duration-300 flex items-center justify-center p-4 font-sans text-gray-800 dark:text-gray-200">
      <div className="card w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl shadow-blue-900/10 dark:shadow-none border border-blue-50 dark:border-gray-700 transition-colors duration-300">
        <div className="card-body">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-black italic tracking-tight text-blue-600 dark:text-blue-400">
              Adapler<span className="text-gray-800 dark:text-white">AI</span>
            </h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400 text-sm">
              Selamat datang kembali! Silakan login.
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

          <form onSubmit={handleSubmit}>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold text-gray-700 dark:text-gray-300">
                  Email
                </span>
              </label>
              <input
                type="text"
                name="email"
                placeholder="email@kampus.ac.id"
                value={formData.email}
                onChange={handleChange}
                className={`input input-bordered w-full bg-white dark:bg-gray-900 text-gray-800 dark:text-white transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${
                  errors.email
                    ? "border-error border-2 bg-red-50/5 focus:ring-error"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              />
              {errors.email && (
                <div className="text-left mt-1.5 px-1">
                  <span className="text-error text-sm font-medium block">
                    {errors.email}
                  </span>
                </div>
              )}
            </div>

            <div className="form-control w-full mt-4 relative">
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
                  value={formData.password}
                  onChange={handleChange}
                  className={`input input-bordered w-full pr-10 bg-white dark:bg-gray-900 text-gray-800 dark:text-white transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${
                    errors.password
                      ? "border-error border-2 bg-red-50/5 focus:ring-error"
                      : "border-gray-200 dark:border-gray-700"
                  }`}
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

              <div className="flex flex-col items-start w-full mt-1.5 px-1 gap-1">
                {errors.password && (
                  <span className="text-error text-sm font-medium block">
                    {errors.password}
                  </span>
                )}
                <Link
                  to="/forgot-password"
                  className="text-sm link link-hover text-blue-600 dark:text-blue-400 font-medium mt-1"
                >
                  Lupa password?
                </Link>
              </div>
            </div>

            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn bg-orange-500 hover:bg-orange-600 text-white border-none w-full text-base font-bold shadow-md shadow-orange-500/30"
                disabled={isLoading}
              >
                {isLoading ? "Memproses..." : "Login"}
              </button>
            </div>
          </form>

          <div className="divider my-4 text-gray-400 dark:text-gray-600 text-sm">
            ATAU
          </div>

          {/* Tombol Login Google Ditambahkan Di Sini */}
          <div className="form-control mb-4">
            <button
              type="button"
              className="btn bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 w-full text-base font-bold flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm transition-colors"
              onClick={onGoogleButtonClick}
              disabled={isLoading}
            >
              <RiGoogleFill className="text-red-500" size={24} />
              Masuk dengan Google
            </button>
          </div>

          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Belum punya akun?
            </p>
            <Link
              to="/register"
              className="btn btn-ghost mt-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700"
            >
              Buat Akun Baru
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
