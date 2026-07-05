import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiGoogleFill } from "@remixicon/react";
import { useTheme } from "../Component/ThemeContext"; // Sesuaikan path ini

function Register() {
  const { isDarkMode } = useTheme(); // Panggil context tema
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });

  const [otpCode, setOtpCode] = useState("");
  const API_BASE_URL = "http://localhost:3000";

  // ... [Fungsi handleInputChange, validateRegister, handleRegister, dll tetap sama] ...
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateRegister = () => {
    let isValid = true;
    let newErrors = { fullname: "", username: "", email: "", password: "" };

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

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateRegister()) return;
    setIsLoading(true);
    setMessage({ text: "", type: "" });
    // Simulasi API
    setTimeout(() => {
      setIsLoading(false);
      setMessage({
        text: "Kode OTP telah dikirim ke emailmu!",
        type: "success",
      });
      setStep(2);
    }, 1000);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setMessage({ text: "Verifikasi sukses!", type: "success" });
      setTimeout(() => navigate("/login"), 2000);
    }, 1000);
  };

  const handleResendOTP = () =>
    setMessage({ text: "OTP baru telah dikirim.", type: "success" });
  const handleGoogleRegister = () => alert("Mengarahkan ke Google...");

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
              className={`alert ${message.type === "error" ? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800" : "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-100 dark:border-green-800"} text-sm p-3 mb-4 rounded-lg`}
            >
              <span>{message.text}</span>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleRegister}>
              {/* Input Nama, Username, Email, Password diupdate dengan dark:bg-gray-900 dan border-gray-700 */}
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
              </div>

              {/* Ulangi pola di atas untuk Input Username, Email, Password */}
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
                  className={`input input-bordered w-full bg-white dark:bg-gray-900 text-gray-800 dark:text-white border-gray-200 dark:border-gray-700 transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20`}
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>

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
                  className={`input input-bordered w-full bg-white dark:bg-gray-900 text-gray-800 dark:text-white border-gray-200 dark:border-gray-700 transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20`}
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-control w-full mt-2">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700 dark:text-gray-300">
                    Password
                  </span>
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className={`input input-bordered w-full bg-white dark:bg-gray-900 text-gray-800 dark:text-white border-gray-200 dark:border-gray-700 transition-all focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20`}
                  value={formData.password}
                  onChange={handleInputChange}
                />
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

          {/* Bagian OTP dan Google Register juga berikan class dark: untuk teks dan background-nya */}
          <div className="divider my-4 text-gray-400 dark:text-gray-600 text-sm">
            ATAU
          </div>

          <div className="form-control mb-4">
            <button
              type="button"
              className="btn bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 w-full text-base font-bold flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 shadow-sm transition-colors"
              onClick={handleGoogleRegister}
            >
              <RiGoogleFill className="text-red-500" size={24} />
              Daftar dengan Google
            </button>
          </div>

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
        </div>
      </div>
    </div>
  );
}

export default Register;
