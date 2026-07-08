import React, { useState, useEffect, useRef, useCallback } from "react";
import DashboardLayout from "../Layout/DashboardLayout";
import {
  RiUploadCloud2Line,
  RiFileTextLine,
  RiFilePdf2Line,
  RiFileWord2Line,
  RiFileExcel2Line,
  RiFilePpt2Line,
  RiImage2Line,
  RiEdit2Line,
  RiDeleteBinLine,
  RiCloseLine,
  RiAddLine,
  RiInformationLine,
  RiCheckLine,
  RiErrorWarningLine,
  RiCheckboxCircleLine,
  RiSparkling2Line,
} from "@remixicon/react";

function MaterialPage() {
  const API_BASE_URL = "https://adapler-api.inidito.my.id";
  const token = localStorage.getItem("authToken");

  // ================= KONFIGURASI FILE YANG DIIZINKAN =================
  // Sinkron dengan whitelist di backend (allowedMimeTypes), termasuk
  // dukungan PPT/PPTX yang baru ditambahkan.
  const ALLOWED_TYPES = [
    { ext: "pdf", mime: "application/pdf", label: "PDF" },
    {
      ext: "docx",
      mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      label: "DOCX",
    },
    {
      ext: "xlsx",
      mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      label: "XLSX",
    },
    { ext: "xls", mime: "application/vnd.ms-excel", label: "XLS" },
    { ext: "csv", mime: "text/csv", label: "CSV" },
    { ext: "png", mime: "image/png", label: "PNG" },
    { ext: "jpg", mime: "image/jpeg", label: "JPG" },
    { ext: "jpeg", mime: "image/jpeg", label: "JPEG" },
    { ext: "webp", mime: "image/webp", label: "WEBP" },
    {
      ext: "pptx",
      mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      label: "PPTX",
    },
    { ext: "ppt", mime: "application/vnd.ms-powerpoint", label: "PPT" },
  ];

  const ALLOWED_EXT = ALLOWED_TYPES.map((t) => `.${t.ext}`);
  const ALLOWED_MIME = [...new Set(ALLOWED_TYPES.map((t) => t.mime))];
  const ACCEPT_ATTR = [...ALLOWED_EXT, ...ALLOWED_MIME].join(",");
  const MAX_SIZE_MB = 5;

  // Badge ringkas yang ditampilkan ke user di area dropzone
  const DISPLAY_BADGES = [
    "PDF",
    "DOCX",
    "XLSX",
    "CSV",
    "PPTX",
    "PNG",
    "JPG",
    "WEBP",
  ];

  // ================= STATE: LIST MATERI =================
  const [materials, setMaterials] = useState([]);
  const [isListLoading, setIsListLoading] = useState(true);

  // ================= STATE: DETAIL MATERI =================
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  // ================= STATE: UPLOAD =================
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // ================= STATE: EDIT MODAL =================
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    ringkasan: "",
    poin_penting: [],
    kata_kunci: [],
  });
  const [poinInput, setPoinInput] = useState("");
  const [kataInput, setKataInput] = useState("");

  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (token) fetchMaterials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Auto-dismiss notifikasi sukses agar UI terasa lebih hidup/modern
  useEffect(() => {
    if (message.text && message.type === "success") {
      const t = setTimeout(() => setMessage({ text: "", type: "" }), 4000);
      return () => clearTimeout(t);
    }
  }, [message]);

  // ================= HELPER: ICON BERDASARKAN EKSTENSI =================
  const getFileMeta = (filename = "") => {
    const ext = filename.split(".").pop()?.toLowerCase();
    if (ext === "pdf")
      return {
        Icon: RiFilePdf2Line,
        bg: "bg-red-100 dark:bg-red-900/30",
        color: "text-red-600 dark:text-red-400",
      };
    if (["doc", "docx"].includes(ext))
      return {
        Icon: RiFileWord2Line,
        bg: "bg-blue-100 dark:bg-blue-900/30",
        color: "text-blue-600 dark:text-blue-400",
      };
    if (["xls", "xlsx", "csv"].includes(ext))
      return {
        Icon: RiFileExcel2Line,
        bg: "bg-emerald-100 dark:bg-emerald-900/30",
        color: "text-emerald-600 dark:text-emerald-400",
      };
    if (["ppt", "pptx"].includes(ext))
      return {
        Icon: RiFilePpt2Line,
        bg: "bg-orange-100 dark:bg-orange-900/30",
        color: "text-orange-600 dark:text-orange-400",
      };
    if (["png", "jpg", "jpeg", "webp"].includes(ext))
      return {
        Icon: RiImage2Line,
        bg: "bg-purple-100 dark:bg-purple-900/30",
        color: "text-purple-600 dark:text-purple-400",
      };
    return {
      Icon: RiFileTextLine,
      bg: "bg-gray-100 dark:bg-gray-700",
      color: "text-gray-600 dark:text-gray-300",
    };
  };

  // ================= FUNGSI API: LIST =================
  const fetchMaterials = async () => {
    setIsListLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/material`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const result = await response.json();
        const list = Array.isArray(result?.data?.materials)
          ? result.data.materials
          : [];
        setMaterials(list);

        if (list.length > 0 && !selectedMaterial) {
          fetchMaterialDetail(list[0].id);
        }
      } else {
        setMaterials([]);
      }
    } catch (error) {
      console.error("Gagal mengambil daftar materi:", error);
    } finally {
      setIsListLoading(false);
    }
  };

  // ================= FUNGSI API: DETAIL =================
  const fetchMaterialDetail = async (id) => {
    setIsDetailLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/material/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const result = await response.json();
        setSelectedMaterial(result.data);
      }
    } catch (error) {
      console.error("Gagal mengambil detail materi:", error);
    } finally {
      setIsDetailLoading(false);
    }
  };

  // ================= FUNGSI API: UPLOAD =================
  const validateFile = (file) => {
    const ext = "." + (file.name.split(".").pop() || "").toLowerCase();
    const extOk = ALLOWED_EXT.includes(ext);
    const mimeOk = ALLOWED_MIME.includes(file.type);

    // Beberapa browser/OS melaporkan MIME generik (terutama untuk csv/xls),
    // jadi file dianggap valid jika salah satu dari ekstensi/MIME cocok.
    if (!extOk && !mimeOk) {
      setMessage({
        text: "Format file tidak didukung. Gunakan PDF, DOCX, XLSX, XLS, CSV, PPT/PPTX, PNG, JPG, atau WEBP.",
        type: "error",
      });
      return false;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setMessage({
        text: `Ukuran file melebihi batas maksimal ${MAX_SIZE_MB} MB.`,
        type: "error",
      });
      return false;
    }
    return true;
  };

  const uploadFile = async (file) => {
    if (!validateFile(file)) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setIsUploading(true);
    setMessage({ text: "", type: "" });

    const formData = new FormData();
    formData.append("document", file);

    try {
      const response = await fetch(`${API_BASE_URL}/material`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const resData = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(resData.message || "Gagal mengunggah materi.");
      }

      setMessage({
        text: "Materi berhasil diunggah dan diringkas oleh AI!",
        type: "success",
      });

      await fetchMaterials();
      if (resData?.data?.id) {
        fetchMaterialDetail(resData.data.id);
      }
    } catch (error) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      setIsUploading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  };

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) uploadFile(file);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  // ================= FUNGSI API: UPDATE =================
  const handleOpenEditModal = () => {
    if (!selectedMaterial) return;
    setEditForm({
      ringkasan: selectedMaterial.ringkasan || "",
      poin_penting: Array.isArray(selectedMaterial.poin_penting)
        ? [...selectedMaterial.poin_penting]
        : [],
      kata_kunci: Array.isArray(selectedMaterial.kata_kunci)
        ? [...selectedMaterial.kata_kunci]
        : [],
    });
    setPoinInput("");
    setKataInput("");
    setIsEditModalOpen(true);
  };

  const addPoin = () => {
    const val = poinInput.trim();
    if (!val) return;
    setEditForm({ ...editForm, poin_penting: [...editForm.poin_penting, val] });
    setPoinInput("");
  };

  const removePoin = (idx) => {
    setEditForm({
      ...editForm,
      poin_penting: editForm.poin_penting.filter((_, i) => i !== idx),
    });
  };

  const addKata = () => {
    const val = kataInput.trim();
    if (!val) return;
    setEditForm({ ...editForm, kata_kunci: [...editForm.kata_kunci, val] });
    setKataInput("");
  };

  const removeKata = (idx) => {
    setEditForm({
      ...editForm,
      kata_kunci: editForm.kata_kunci.filter((_, i) => i !== idx),
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMaterial) return;

    setIsSubmittingEdit(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch(
        `${API_BASE_URL}/material/${selectedMaterial.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editForm),
        },
      );

      const resData = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(resData.message || "Gagal memperbarui materi.");
      }

      setMessage({ text: "Materi berhasil diperbarui!", type: "success" });
      setIsEditModalOpen(false);

      await fetchMaterials();
      fetchMaterialDetail(selectedMaterial.id);
    } catch (error) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      setIsSubmittingEdit(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // ================= FUNGSI API: DELETE =================
  const handleDeleteMaterial = async () => {
    if (!selectedMaterial) return;
    if (!window.confirm("Yakin ingin menghapus materi ini?")) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/material/${selectedMaterial.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!response.ok) throw new Error("Gagal menghapus materi.");

      setMessage({ text: "Materi berhasil dihapus!", type: "success" });
      setSelectedMaterial(null);
      await fetchMaterials();
    } catch (error) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
          <RiSparkling2Line size={22} className="text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Material Summary
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-0.5 text-sm">
            Unggah dokumen atau gambar materi, AI akan merangkumnya dalam
            hitungan detik.
          </p>
        </div>
      </div>

      {message.text && (
        <div
          role="alert"
          className={`flex items-start gap-3 text-sm p-4 mb-6 rounded-xl border animate-[fadeIn_0.2s_ease-out] ${
            message.type === "error"
              ? "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-100 dark:border-red-900/40"
              : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40"
          }`}
        >
          {message.type === "error" ? (
            <RiErrorWarningLine size={20} className="shrink-0 mt-0.5" />
          ) : (
            <RiCheckboxCircleLine size={20} className="shrink-0 mt-0.5" />
          )}
          <span className="flex-1">{message.text}</span>
          <button
            onClick={() => setMessage({ text: "", type: "" })}
            className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
          >
            <RiCloseLine size={18} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ================= KOLOM KIRI: UPLOAD + RIWAYAT ================= */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept={ACCEPT_ATTR}
            onChange={handleFileInputChange}
          />

          <div
            onClick={() => !isUploading && fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`relative overflow-hidden border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer min-h-[280px] ${
              isDragging
                ? "border-blue-500 bg-blue-100/60 dark:bg-blue-900/30 scale-[1.01]"
                : "border-blue-300 dark:border-blue-700/50 bg-blue-50/50 dark:bg-gray-800 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700/50"
            }`}
          >
            {isUploading ? (
              <>
                <span className="loading loading-spinner loading-lg text-blue-500 mb-4"></span>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                  Mengunggah &amp; meringkas...
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Mohon tunggu sebentar
                </p>
              </>
            ) : (
              <>
                <div
                  className={`w-16 h-16 rounded-2xl bg-white dark:bg-gray-900 shadow-sm flex items-center justify-center mb-4 transition-transform duration-200 ${
                    isDragging ? "scale-110" : ""
                  }`}
                >
                  <RiUploadCloud2Line size={30} className="text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  Tarik file ke sini
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Maksimal kapasitas {MAX_SIZE_MB} MB
                </p>
                <div className="flex flex-wrap justify-center gap-1.5 mb-6 max-w-xs">
                  {DISPLAY_BADGES.map((label) => (
                    <span
                      key={label}
                      className="text-[11px] font-semibold tracking-wide px-2 py-1 rounded-md bg-white/70 dark:bg-gray-900/60 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700"
                    >
                      {label}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="btn bg-blue-600 hover:bg-blue-700 text-white border-none shadow-md shadow-blue-500/20"
                >
                  Pilih Dokumen
                </button>
              </>
            )}
          </div>

          <div className="card bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-2xl">
            <div className="card-body p-5">
              <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                Riwayat Materi
              </h2>

              {isListLoading ? (
                <div className="flex justify-center py-6">
                  <span className="loading loading-spinner text-blue-500"></span>
                </div>
              ) : materials.length === 0 ? (
                <div className="text-center py-6 text-gray-500 flex flex-col items-center">
                  <RiInformationLine size={28} className="mb-2 opacity-50" />
                  <p className="text-sm">Belum ada materi yang diunggah.</p>
                </div>
              ) : (
                <ul className="flex flex-col gap-2 max-h-[380px] overflow-y-auto pr-1">
                  {materials.map((item) => {
                    const isActive = selectedMaterial?.id === item.id;
                    const { Icon, bg, color } = getFileMeta(item.judul);
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => fetchMaterialDetail(item.id)}
                          className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-150 ${
                            isActive
                              ? "bg-blue-50 dark:bg-blue-900/30 ring-1 ring-blue-200 dark:ring-blue-800"
                              : "hover:bg-slate-50 dark:hover:bg-gray-700/50"
                          }`}
                        >
                          <div
                            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                              isActive
                                ? "bg-blue-600 text-white"
                                : `${bg} ${color}`
                            }`}
                          >
                            <Icon size={18} />
                          </div>
                          <div className="flex flex-col truncate">
                            <span
                              className={`text-sm truncate ${isActive ? "font-bold text-blue-700 dark:text-blue-400" : "font-medium text-gray-800 dark:text-gray-200"}`}
                            >
                              {item.judul}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {item.uploaded}
                            </span>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* ================= KOLOM KANAN: DETAIL MATERI ================= */}
        <div className="lg:col-span-2 card bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-2xl">
          <div className="card-body p-6">
            {isDetailLoading ? (
              <div className="flex justify-center py-20">
                <span className="loading loading-spinner loading-lg text-blue-500"></span>
              </div>
            ) : !selectedMaterial ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <RiFileTextLine size={40} className="mb-3 opacity-40" />
                <p className="text-sm">
                  Unggah atau pilih materi untuk melihat ringkasannya di sini.
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-3 overflow-hidden">
                    {(() => {
                      const { Icon, bg, color } = getFileMeta(
                        selectedMaterial.judul,
                      );
                      return (
                        <div
                          className={`p-3 rounded-xl shrink-0 ${bg} ${color}`}
                        >
                          <Icon size={24} />
                        </div>
                      );
                    })()}
                    <div className="truncate">
                      <h2 className="card-title text-lg text-gray-900 dark:text-white truncate">
                        {selectedMaterial.judul}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Diunggah {selectedMaterial.uploaded}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleOpenEditModal}
                      title="Edit Ringkasan"
                      className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 transition-all duration-200 hover:scale-105"
                    >
                      <RiEdit2Line size={17} />
                    </button>
                    <button
                      onClick={handleDeleteMaterial}
                      title="Hapus Materi"
                      className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 transition-all duration-200 hover:scale-105"
                    >
                      <RiDeleteBinLine size={17} />
                    </button>
                  </div>
                </div>

                <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                  <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-2">
                    Ringkasan
                  </h3>
                  <p className="whitespace-pre-line">
                    {selectedMaterial.ringkasan || "-"}
                  </p>

                  {Array.isArray(selectedMaterial.poin_penting) &&
                    selectedMaterial.poin_penting.length > 0 && (
                      <>
                        <h3 className="text-gray-900 dark:text-white font-bold text-lg mt-6 mb-2">
                          Poin Penting
                        </h3>
                        <ul className="list-disc pl-5 space-y-2">
                          {selectedMaterial.poin_penting.map((poin, idx) => (
                            <li key={idx}>{poin}</li>
                          ))}
                        </ul>
                      </>
                    )}

                  {Array.isArray(selectedMaterial.kata_kunci) &&
                    selectedMaterial.kata_kunci.length > 0 && (
                      <>
                        <h3 className="text-gray-900 dark:text-white font-bold text-lg mt-6 mb-2">
                          Kata Kunci Utama
                        </h3>
                        <div className="flex gap-2 flex-wrap mt-2">
                          {selectedMaterial.kata_kunci.map((kata, idx) => (
                            <span
                              key={idx}
                              className="badge badge-outline text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600"
                            >
                              {kata}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ================= MODAL EDIT MATERI ================= */}
      {isEditModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box bg-white dark:bg-gray-800 rounded-2xl relative max-w-2xl">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
            >
              <RiCloseLine size={20} />
            </button>
            <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-6">
              Edit Ringkasan Materi
            </h3>

            <form onSubmit={handleEditSubmit} className="flex flex-col gap-5">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Ringkasan</span>
                </label>
                <textarea
                  rows={5}
                  value={editForm.ringkasan}
                  onChange={(e) =>
                    setEditForm({ ...editForm, ringkasan: e.target.value })
                  }
                  className="textarea textarea-bordered w-full dark:bg-gray-900 dark:text-white"
                />
              </div>

              {/* Poin Penting */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Poin Penting</span>
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={poinInput}
                    onChange={(e) => setPoinInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addPoin();
                      }
                    }}
                    placeholder="Tulis poin lalu tekan Enter"
                    className="input input-bordered w-full dark:bg-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={addPoin}
                    className="btn btn-square bg-blue-600 hover:bg-blue-700 text-white border-none"
                  >
                    <RiAddLine size={20} />
                  </button>
                </div>
                <ul className="flex flex-col gap-2">
                  {editForm.poin_penting.map((poin, idx) => (
                    <li
                      key={idx}
                      className="flex items-center justify-between bg-slate-50 dark:bg-gray-900 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300"
                    >
                      <span className="truncate pr-2">{poin}</span>
                      <button
                        type="button"
                        onClick={() => removePoin(idx)}
                        className="text-gray-400 hover:text-red-500 shrink-0"
                      >
                        <RiCloseLine size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Kata Kunci */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Kata Kunci</span>
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={kataInput}
                    onChange={(e) => setKataInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addKata();
                      }
                    }}
                    placeholder="Tulis kata kunci lalu tekan Enter"
                    className="input input-bordered w-full dark:bg-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={addKata}
                    className="btn btn-square bg-blue-600 hover:bg-blue-700 text-white border-none"
                  >
                    <RiAddLine size={20} />
                  </button>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {editForm.kata_kunci.map((kata, idx) => (
                    <span
                      key={idx}
                      className="badge badge-outline text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600 gap-1 py-3"
                    >
                      {kata}
                      <button
                        type="button"
                        onClick={() => removeKata(idx)}
                        className="hover:text-red-500"
                      >
                        <RiCloseLine size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="modal-action mt-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="btn btn-ghost"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingEdit}
                  className="btn bg-blue-600 hover:bg-blue-700 text-white border-none px-6"
                >
                  {isSubmittingEdit ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <>
                      <RiCheckLine size={18} /> Simpan Perubahan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          <div
            className="modal-backdrop bg-black/40 backdrop-blur-sm"
            onClick={() => setIsEditModalOpen(false)}
          ></div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default MaterialPage;
