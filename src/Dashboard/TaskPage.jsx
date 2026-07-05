import React from "react";
import DashboardLayout from "../Layout/DashboardLayout";
import {
  RiEdit2Line,
  RiDeleteBinLine,
  RiCalendarEventLine,
  RiMagicLine,
} from "@remixicon/react";

function TaskPage() {
  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Task & Planner
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Kelola tugas akademik dan dapatkan rekomendasi jadwal belajar dari
            AI.
          </p>
        </div>
        {/* PERBAIKAN TOMBOL: Ditambahkan px-6, rounded-xl, font-bold, dan gap-2 */}
        <button className="btn bg-blue-600 hover:bg-blue-700 text-white border-none shadow-lg shadow-blue-600/30 px-6 rounded-xl font-bold flex items-center gap-2">
          <RiMagicLine size={20} /> Generate AI Planner
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kolom Kiri: AI Study Planner */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="card bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-2xl">
            <div className="card-body p-6">
              <div className="flex items-center gap-3 mb-4">
                <RiCalendarEventLine size={24} className="text-orange-500" />
                <h2 className="card-title text-xl text-gray-900 dark:text-white">
                  AI Study Planner
                </h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Rekomendasi jadwal belajar hari ini berdasarkan beban tugasmu.
              </p>

              <ul className="steps steps-vertical w-full">
                <li className="step step-primary text-sm font-medium text-gray-800 dark:text-gray-200">
                  <div className="text-left w-full pl-2">
                    <span className="block font-bold text-blue-600 dark:text-blue-400">
                      19:00 - 20:30
                    </span>
                    Mengerjakan Implementasi BST
                  </div>
                </li>
                <li className="step step-primary text-sm font-medium text-gray-800 dark:text-gray-200">
                  <div className="text-left w-full pl-2">
                    <span className="block font-bold text-blue-600 dark:text-blue-400">
                      20:45 - 21:30
                    </span>
                    Membaca Resume Jurnal LLM
                  </div>
                </li>
                <li className="step text-sm font-medium text-gray-500 dark:text-gray-500">
                  <div className="text-left w-full pl-2">
                    <span className="block font-bold">21:30 - 22:00</span>
                    Review Slice UI Dashboard
                  </div>
                </li>
              </ul>

              <div className="flex gap-3 mt-6">
                <button className="btn btn-outline btn-primary flex-1 rounded-xl font-bold">
                  Atur Ulang
                </button>
                <button className="btn bg-orange-500 hover:bg-orange-600 text-white border-none shadow-md shadow-orange-500/30 flex-1 rounded-xl font-bold">
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Task Management */}
        <div className="lg:col-span-2 card bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-2xl">
          <div className="card-body p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="card-title text-xl text-gray-900 dark:text-white">
                Daftar Tugas
              </h2>
              {/* PERBAIKAN TOMBOL MANUAL: Ditambahkan px-4, rounded-xl */}
              <button className="btn btn-sm btn-outline text-gray-600 dark:text-gray-300 px-4 rounded-xl font-medium">
                + Tambah Manual
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                    <th>Nama Tugas</th>
                    <th>Mata Kuliah</th>
                    <th>Deadline</th>
                    <th>Prioritas</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-50 dark:border-gray-700/50">
                    <td className="font-medium text-gray-800 dark:text-gray-200">
                      Implementasi BST
                    </td>
                    <td className="text-gray-600 dark:text-gray-400">
                      Struktur Data
                    </td>
                    <td className="text-red-500 dark:text-red-400 font-medium">
                      Hari ini
                    </td>
                    <td>
                      <span className="badge bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-none badge-sm font-medium px-3 py-2">
                        Tinggi
                      </span>
                    </td>
                    <td className="flex gap-2">
                      <button
                        className="text-blue-500 hover:text-blue-700 transition-colors tooltip"
                        data-tip="Edit"
                      >
                        <RiEdit2Line size={18} />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700 transition-colors tooltip"
                        data-tip="Hapus"
                      >
                        <RiDeleteBinLine size={18} />
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-50 dark:border-gray-700/50">
                    <td className="font-medium text-gray-800 dark:text-gray-200">
                      Slice UI Dashboard
                    </td>
                    <td className="text-gray-600 dark:text-gray-400">
                      Pemrograman Web
                    </td>
                    <td className="text-gray-600 dark:text-gray-400">Besok</td>
                    <td>
                      <span className="badge bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-none badge-sm font-medium px-3 py-2">
                        Sedang
                      </span>
                    </td>
                    <td className="flex gap-2">
                      <button
                        className="text-blue-500 hover:text-blue-700 transition-colors tooltip"
                        data-tip="Edit"
                      >
                        <RiEdit2Line size={18} />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700 transition-colors tooltip"
                        data-tip="Hapus"
                      >
                        <RiDeleteBinLine size={18} />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default TaskPage;
