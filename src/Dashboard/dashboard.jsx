import React from "react";
import {
  RiRobot2Line,
  RiCheckDoubleLine,
  RiTimeLine,
  RiFireLine,
} from "@remixicon/react";
import DashboardLayout from "../Layout/DashboardLayout";

function Dashboard() {
  return (
    <DashboardLayout>
      {/* ================= HEADER HALAMAN ================= */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Halo, Bagaskara! 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium text-sm md:text-base">
            Sabtu, 4 Juli 2026
          </p>
        </div>

        <button className="btn bg-orange-500 hover:bg-orange-600 text-white border-none shadow-lg shadow-orange-500/40 px-6 rounded-xl font-bold">
          + Tambah Tugas Baru
        </button>
      </div>

      {/* ================= STAT CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all rounded-2xl">
          <div className="card-body p-6 flex flex-row items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <RiCheckDoubleLine size={28} />
            </div>
            <div>
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Tugas Selesai
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                12 / 15
              </p>
            </div>
          </div>
        </div>

        <div className="card bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all rounded-2xl">
          <div className="card-body p-6 flex flex-row items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-500 dark:text-orange-400">
              <RiTimeLine size={28} />
            </div>
            <div>
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Jam Belajar
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                14 Jam
              </p>
            </div>
          </div>
        </div>

        <div className="card bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all rounded-2xl">
          <div className="card-body p-6 flex flex-row items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-500 dark:text-green-400">
              <RiFireLine size={28} />
            </div>
            <div>
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Konsistensi
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                5 Hari Streak
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= TABEL TUGAS + AI INSIGHT ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-2xl transition-colors">
          <div className="card-body p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="card-title text-xl text-gray-900 dark:text-white">
                Tugas Mendatang
              </h2>
              <a
                href="#"
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700"
              >
                Lihat Semua
              </a>
            </div>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                    <th>Mata Kuliah</th>
                    <th>Tugas</th>
                    <th>Deadline</th>
                    <th>Prioritas</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-50 dark:border-gray-700/50">
                    <td className="font-medium text-gray-800 dark:text-gray-200">
                      Struktur Data
                    </td>
                    <td className="text-gray-600 dark:text-gray-400">
                      Implementasi BST
                    </td>
                    <td className="text-red-500 dark:text-red-400 font-medium">
                      Hari ini
                    </td>
                    <td>
                      <span className="badge bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-none badge-sm font-medium">
                        Tinggi
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-50 dark:border-gray-700/50">
                    <td className="font-medium text-gray-800 dark:text-gray-200">
                      Pemrograman Web
                    </td>
                    <td className="text-gray-600 dark:text-gray-400">
                      Slice UI Dashboard
                    </td>
                    <td className="text-gray-600 dark:text-gray-400">Besok</td>
                    <td>
                      <span className="badge bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-none badge-sm font-medium">
                        Sedang
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="font-medium text-gray-800 dark:text-gray-200">
                      Kecerdasan Buatan
                    </td>
                    <td className="text-gray-600 dark:text-gray-400">
                      Resume Jurnal LLM
                    </td>
                    <td className="text-gray-600 dark:text-gray-400">
                      3 Hari lagi
                    </td>
                    <td>
                      <span className="badge bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-none badge-sm font-medium">
                        Rendah
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-blue-700 to-blue-500 dark:from-blue-900 dark:to-blue-700 text-white shadow-lg shadow-blue-900/20 border-none rounded-2xl">
          <div className="card-body p-6">
            <div className="flex items-center gap-3 mb-4">
              <RiRobot2Line size={24} className="text-orange-400" />
              <h2 className="card-title text-xl font-bold">AI Insight</h2>
            </div>
            <p className="text-blue-50 dark:text-gray-200 leading-relaxed mb-6 font-medium text-sm lg:text-base">
              "Kamu memiliki tugas{" "}
              <strong className="text-white">Struktur Data</strong> yang harus
              dikumpulkan hari ini. Prioritaskan tugas tersebut, dan biarkan
              saya membuat rangkuman untuk materi Kecerdasan Buatan agar kamu
              lebih hemat waktu."
            </p>
            <button className="btn bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-blue-600 dark:text-blue-400 border-none w-full shadow-md font-bold rounded-xl mt-auto transition-colors">
              Buatkan Jadwal
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
