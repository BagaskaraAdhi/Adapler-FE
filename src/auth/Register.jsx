import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
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
  const [otpCode, setOtpCode] = useState("");

  const API_BASE_URL = "http://localhost:3000";

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok)
        throw new Error("Gagal mendaftar, pastikan data benar.");

      setMessage({
        text: "Kode OTP telah dikirim ke emailmu!",
        type: "success",
      });
      setStep(2);
    } catch (error) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch(`${API_BASE_URL}/users/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, code: otpCode }),
      });

      if (!response.ok) throw new Error("Kode OTP salah atau kedaluwarsa.");

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

  const handleResendOTP = async () => {
    setMessage({ text: "Mengirim ulang OTP...", type: "info" });
    try {
      const response = await fetch(`${API_BASE_URL}/users/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      if (!response.ok) throw new Error("Gagal mengirim ulang OTP.");
      setMessage({
        text: "OTP baru telah dikirim ke emailmu.",
        type: "success",
      });
    } catch (error) {
      setMessage({ text: error.message, type: "error" });
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-md shadow-2xl bg-base-100">
        <div className="card-body">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-black text-primary italic">
              Adapler<span className="text-base-content">AI</span>
            </h1>
            <p className="mt-2 opacity-70">
              {step === 1
                ? "Buat akun baru untuk mulai belajar."
                : "Verifikasi Email"}
            </p>
          </div>

          {message.text && (
            <div
              className={`alert ${message.type === "error" ? "alert-error" : "alert-success"} text-sm p-3 mb-4`}
            >
              <span>{message.text}</span>
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleRegister}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold mb-2">
                    Nama Lengkap
                  </span>
                </label>
                <input
                  type="text"
                  name="fullname"
                  placeholder="John Doe"
                  className="input input-bordered w-full"
                  required
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-control mt-2">
                <label className="label">
                  <span className="label-text font-semibold mb-2">
                    Username
                  </span>
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="johndoe123"
                  className="input input-bordered w-full"
                  required
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-control mt-2">
                <label className="label">
                  <span className="label-text font-semibold mb-2">Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="email@kampus.ac.id"
                  className="input input-bordered w-full"
                  required
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-control mt-2">
                <label className="label">
                  <span className="label-text font-semibold mb-2">
                    Password
                  </span>
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  className="input input-bordered w-full"
                  required
                  minLength="6"
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-control mt-6">
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Memproses..." : "Daftar"}
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOTP}>
              <p className="text-sm text-center mb-4 opacity-80">
                Masukkan kode 6 digit yang telah kami kirimkan ke{" "}
                <strong>{formData.email}</strong>
              </p>
              <div className="form-control">
                <input
                  type="text"
                  placeholder="Kode OTP"
                  className="input input-bordered text-center text-2xl tracking-widest"
                  required
                  maxLength="6"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                />
              </div>
              <div className="form-control mt-6">
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Memproses..." : "Daftar"}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={handleResendOTP}
                >
                  Kirim Ulang Kode
                </button>
              </div>
            </form>
          )}

          {step === 1 && (
            <>
              <div className="divider my-4">ATAU</div>
              <div className="text-center">
                <p className="opacity-70 text-sm">Sudah punya akun?</p>
                <Link to="/login" className="btn btn-ghost mt-2">
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
