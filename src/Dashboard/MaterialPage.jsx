import React from "react";
import DashboardLayout from "../Layout/DashboardLayout";
import {
  RiUploadCloud2Line,
  RiFileTextLine,
  RiDownloadCloud2Line,
} from "@remixicon/react";

function MaterialPage() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Material Summary
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Unggah dokumen PDF, PPT, atau DOCX. AI akan merangkumnya dalam
          hitungan detik.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Area Upload Drag-and-Drop */}
        <div className="lg:col-span-1">
          <div className="border-2 border-dashed border-blue-300 dark:border-blue-700/50 bg-blue-50/50 dark:bg-gray-800 rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-colors hover:bg-blue-50 dark:hover:bg-gray-700/50 cursor-pointer h-full min-h-[300px]">
            <RiUploadCloud2Line size={48} className="text-blue-500 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              Tarik file ke sini
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Mendukung file .pdf, .docx, .ppt
              <br />
              (Maksimal kapasitas: 10 MB)
            </p>
            <button className="btn bg-blue-600 hover:bg-blue-700 text-white border-none shadow-md">
              Pilih Dokumen
            </button>
          </div>
        </div>

        {/* Hasil Ringkasan */}
        <div className="lg:col-span-2 card bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-2xl">
          <div className="card-body p-6">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl text-red-600 dark:text-red-400">
                  <RiFileTextLine size={24} />
                </div>
                <div>
                  <h2 className="card-title text-lg text-gray-900 dark:text-white">
                    Jurnal_LLM_Architecture.pdf
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Berhasil diringkas • 3 menit yang lalu
                  </p>
                </div>
              </div>
              <button
                className="btn btn-sm btn-ghost text-blue-600 dark:text-blue-400"
                title="Unduh format Teks"
              >
                <RiDownloadCloud2Line size={20} />
              </button>
            </div>

            <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
              <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-2">
                Poin Penting:
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  LLM menggunakan arsitektur Transformer yang mengandalkan
                  mekanisme *self-attention*.
                </li>
                <li>
                  Proses pelatihan melibatkan *Pre-training* pada data skala
                  besar, lalu dilanjutkan dengan *Fine-tuning*.
                </li>
                <li>
                  Tantangan utama saat ini adalah mengurangi halusinasi AI dan
                  meningkatkan efisiensi komputasi.
                </li>
              </ul>

              <h3 className="text-gray-900 dark:text-white font-bold text-lg mt-6 mb-2">
                Kata Kunci Utama:
              </h3>
              <div className="flex gap-2 flex-wrap mt-2">
                <span className="badge badge-outline text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600">
                  Transformer
                </span>
                <span className="badge badge-outline text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600">
                  Self-Attention
                </span>
                <span className="badge badge-outline text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600">
                  Fine-Tuning
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default MaterialPage;
