import React, { useState } from "react";
import { Link } from "react-router-dom";
// 1. Import useTheme
import { useTheme } from "../Component/ThemeContext";

function Login() {
  // 2. Gunakan context untuk mengambil status tema
  const { isDarkMode } = useTheme();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

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
      newErrors.email = "Format email tidak valid (contoh: user@gmail.com).";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password tidak boleh kosong.";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password harus memiliki minimal 8 karakter.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        alert("Validasi sukses! Siap kirim data ke API: " + formData.email);
      }, 1000);
    }
  };

  return (
    // 3. Tambahkan class transition agar perubahan warna halus
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 transition-colors duration-300 flex items-center justify-center p-4 font-sans text-gray-800 dark:text-gray-200">
      {/* 4. Update class card dengan dark:bg-gray-800 dan border yang sesuai */}
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

          <form onSubmit={handleSubmit}>
            {/* Input Email */}
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

            {/* Input Password */}
            <div className="form-control w-full mt-4">
              <label className="label">
                <span className="label-text font-semibold text-gray-700 dark:text-gray-300">
                  Password
                </span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className={`input input-bordered w-full bg-white dark:bg-gray-900 text-gray-800 dark:text-white transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${
                  errors.password
                    ? "border-error border-2 bg-red-50/5 focus:ring-error"
                    : "border-gray-200 dark:border-gray-700"
                }`}
              />

              <div className="flex flex-col items-start w-full mt-1.5 px-1 gap-1">
                {errors.password && (
                  <span className="text-error text-sm font-medium block">
                    {errors.password}
                  </span>
                )}

                <a
                  href="#"
                  className="text-sm link link-hover text-blue-600 dark:text-blue-400 font-medium mt-1"
                >
                  Lupa password?
                </a>
              </div>
            </div>

            {/* Tombol Submit */}
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

          <div className="divider my-6 text-gray-400 dark:text-gray-600 text-sm">
            ATAU
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
