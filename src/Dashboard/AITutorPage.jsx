import React from "react";
import DashboardLayout from "../Layout/DashboardLayout";
import {
  RiSendPlane2Line,
  RiBookOpenLine,
  RiCheckLine,
} from "@remixicon/react";

function AITutorPage() {
  return (
    <DashboardLayout>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            AI Tutor & Quiz Generator
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Tanyakan materi yang sulit atau uji pemahamanmu dengan latihan soal
            otomatis.
          </p>
        </div>
        <button className="btn bg-orange-500 hover:bg-orange-600 text-white border-none shadow-md">
          <RiBookOpenLine size={20} /> Generate Quiz Baru
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Antarmuka Chat AI Tutor */}
        <div className="card bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-2xl flex flex-col h-[600px]">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 rounded-t-2xl">
            <h2 className="font-bold text-gray-900 dark:text-white">
              Tutor Assistant
            </h2>
            <span className="badge bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-none badge-sm">
              Online
            </span>
          </div>

          {/* Area Percakapan */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/50 dark:bg-gray-800">
            <div className="chat chat-start">
              <div className="chat-bubble bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm">
                Halo! Saya siap membantu. Ingin bahas materi apa hari ini?
              </div>
            </div>
            <div className="chat chat-end">
              <div className="chat-bubble bg-blue-600 text-white shadow-md">
                Tolong jelaskan secara singkat perbedaan Array dan Linked List.
              </div>
            </div>
            <div className="chat chat-start">
              <div className="chat-bubble bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm">
                Tentu! **Array** menyimpan data secara berurutan di memori,
                sehingga pencarian indeks lebih cepat, namun ukurannya tetap.
                Sedangkan **Linked List** menyimpan data dengan *pointer* yang
                menghubungkan setiap elemen, sehingga lebih fleksibel dalam
                menambah atau menghapus data, namun lebih lambat dalam pencarian
                indeks.
              </div>
            </div>
          </div>

          {/* Area Input Chat */}
          <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 rounded-b-2xl">
            <div className="flex gap-2 relative">
              <input
                type="text"
                placeholder="Tanyakan sesuatu..."
                className="input input-bordered w-full pr-12 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
              <button className="btn btn-square bg-blue-600 hover:bg-blue-700 text-white border-none absolute right-0 rounded-l-none">
                <RiSendPlane2Line size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Area Quiz Generator */}
        <div className="card bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-2xl flex flex-col h-[600px] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-lg text-gray-900 dark:text-white">
                Latihan Soal: Struktur Data
              </h2>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Skor: 0/3
              </span>
            </div>

            <div className="space-y-6">
              {/* Soal 1 */}
              <div className="p-5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                <p className="font-medium text-gray-800 dark:text-gray-200 mb-4">
                  1. Struktur data apa yang menggunakan prinsip LIFO (Last In
                  First Out)?
                </p>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <label className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
                    <input
                      type="radio"
                      name="q1"
                      className="radio radio-primary radio-sm"
                    />
                    <span>Queue</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg cursor-pointer transition-colors">
                    <input
                      type="radio"
                      name="q1"
                      className="radio radio-success radio-sm"
                      defaultChecked
                    />
                    <span className="text-green-800 dark:text-green-400 font-medium">
                      Stack
                    </span>
                    <RiCheckLine className="ml-auto text-green-600 dark:text-green-400" />
                  </label>
                </div>

                {/* Kotak Pembahasan */}
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 text-sm text-gray-700 dark:text-gray-300">
                  <strong>Pembahasan:</strong> Stack beroperasi seperti tumpukan
                  buku, data terakhir yang dimasukkan akan menjadi yang pertama
                  kali keluar.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AITutorPage;
