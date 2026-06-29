import React from "react";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-md shadow-2xl bg-base-100">
        <div className="card-body">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-black text-primary italic">
              Adapler<span className="text-base-content">AI</span>
            </h1>
            <p className="mt-2 opacity-70">
              Selamat datang kembali! Silakan login.
            </p>
          </div>

          <form>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold mb-2">Email</span>
              </label>
              <input
                type="email"
                placeholder="email@kampus.ac.id"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text font-semibold mb-2">Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered w-full"
                required
              />
              <label className="label mt-1">
                <a
                  href="#"
                  className="label-text-alt link link-hover text-primary"
                >
                  Lupa password?
                </a>
              </label>
            </div>

            <div className="form-control mt-6">
              <button className="btn btn-primary w-full">Login</button>
            </div>
          </form>

          <div className="divider my-6">ATAU</div>

          <div className="text-center">
            <p className="opacity-70 text-sm">Belum punya akun?</p>
            <Link to="/register" className="btn btn-ghost mt-2">
              Buat Akun Baru
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
