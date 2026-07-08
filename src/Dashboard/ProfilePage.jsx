import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "../Layout/DashboardLayout";
import { RiCameraLensLine, RiSave3Line } from "@remixicon/react";

function ProfilePage() {
  const API_BASE_URL = "https://adapler-api.inidito.my.id";
  const token = localStorage.getItem("authToken");

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [message, setMessage] = useState({ text: "", type: "" });

  // State untuk menyimpan foto preview
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  // State untuk data form
  const [formData, setFormData] = useState({
    full_name: "",
    birth_date: "",
    bio: "",
    jenjang_pendidikan: "",
    jurusan: "",
    target_akademik: "",
    jam_belajar_harian: 0,
    profile_image: null,
  });

  useEffect(() => {
    fetchProfileData();
    fetchProfilePhoto();
  }, []);

  // GET /profiles
  const fetchProfileData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/profiles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const result = await response.json();
        const data = result.data;

        let formattedDate = "";
        if (data.birthDate) {
          formattedDate = new Date(data.birthDate).toISOString().split("T")[0];
        }

        setFormData((prev) => ({
          ...prev,
          full_name: data.fullname || "",
          birth_date: formattedDate,
          bio: data.bio || "",
          jenjang_pendidikan: data.jenjangPendidikan || "",
          jurusan: data.jurusan || "",
          target_akademik: data.targetAkademik || "",
          jam_belajar_harian: data.jamBelajarHarian || 0,
        }));
      }
    } catch (error) {
      console.error("Gagal mengambil data profil:", error);
    } finally {
      setIsFetching(false);
    }
  };

  // GET /profiles/photo-profile
  const fetchProfilePhoto = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/profiles/photo-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const blob = await response.blob();
        setPhotoPreview(URL.createObjectURL(blob));
      }
    } catch (error) {
      console.error("Gagal mengambil foto profil:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profile_image: file });
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // PUT /profiles
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const submitData = new FormData();
      submitData.append("full_name", formData.full_name);
      submitData.append("birth_date", formData.birth_date);
      submitData.append("bio", formData.bio);
      submitData.append("jenjang_pendidikan", formData.jenjang_pendidikan);
      submitData.append("jurusan", formData.jurusan);
      submitData.append("target_akademik", formData.target_akademik);
      submitData.append(
        "jam_belajar_harian",
        Number(formData.jam_belajar_harian),
      );

      if (formData.profile_image) {
        submitData.append("profile_image", formData.profile_image);
      }

      const response = await fetch(`${API_BASE_URL}/profiles`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: submitData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Gagal memperbarui profil.");
      }

      setMessage({ text: "Profil berhasil diperbarui!", type: "success" });
    } catch (error) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      setIsLoading(false);
      window.scrollTo(0, 0);
    }
  };

  if (isFetching) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg text-blue-500"></span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Profil Pengguna
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Kelola informasi personal dan preferensi akademikmu di sini.
        </p>
      </div>

      {message.text && (
        <div
          className={`alert ${message.type === "error" ? "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 border border-red-100 dark:border-red-800" : "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400 border border-green-100 dark:border-green-800"} p-3 mb-6 rounded-xl`}
        >
          {message.text}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* === KOLOM KIRI: FOTO PROFIL & BIO === */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="card bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-2xl">
            <div className="card-body p-6 flex flex-col items-center">
              <div
                className="relative group cursor-pointer"
                onClick={() => fileInputRef.current.click()}
              >
                <div className="avatar">
                  <div className="w-32 h-32 rounded-full ring ring-blue-500 ring-offset-base-100 ring-offset-2 overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Profile"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-4xl font-bold text-gray-400 dark:text-gray-500">
                        {formData.full_name
                          ? formData.full_name.charAt(0).toUpperCase()
                          : "U"}
                      </span>
                    )}
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/50 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <RiCameraLensLine size={28} className="text-white" />
                  <span className="text-white text-xs mt-1 font-medium">
                    Ubah Foto
                  </span>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/png, image/jpeg, image/jpg"
                  className="hidden"
                />
              </div>

              <div className="text-center mt-4 w-full">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Bio Singkat
                    </span>
                  </label>
                  {/* PENAMBAHAN px-4 dan py-3 */}
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="textarea textarea-bordered h-24 bg-white dark:bg-gray-900 text-gray-800 dark:text-white border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500/20 w-full resize-none px-4 py-3"
                    placeholder="Tuliskan sedikit tentang dirimu..."
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* === KOLOM KANAN: DATA PERSONAL & AKADEMIK === */}
        <div className="lg:col-span-2 card bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-2xl">
          <div className="card-body p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-700 pb-2">
              Data Personal
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Nama Lengkap
                  </span>
                </label>
                {/* PENAMBAHAN px-4 */}
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  className="input input-bordered w-full bg-white dark:bg-gray-900 text-gray-800 dark:text-white border-gray-200 dark:border-gray-700 px-4"
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Tanggal Lahir
                  </span>
                </label>
                {/* PENAMBAHAN px-4 */}
                <input
                  type="date"
                  name="birth_date"
                  value={formData.birth_date}
                  onChange={handleInputChange}
                  className="input input-bordered w-full bg-white dark:bg-gray-900 text-gray-800 dark:text-white border-gray-200 dark:border-gray-700 px-4"
                />
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-6 border-b border-gray-100 dark:border-gray-700 pb-2">
              Data Akademik
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Jenjang Pendidikan
                  </span>
                </label>
                {/* PENAMBAHAN px-4 */}
                <input
                  type="text"
                  name="jenjang_pendidikan"
                  value={formData.jenjang_pendidikan}
                  onChange={handleInputChange}
                  placeholder="S1 / SMA / D3"
                  className="input input-bordered w-full bg-white dark:bg-gray-900 text-gray-800 dark:text-white border-gray-200 dark:border-gray-700 px-4"
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Jurusan
                  </span>
                </label>
                {/* PENAMBAHAN px-4 */}
                <input
                  type="text"
                  name="jurusan"
                  value={formData.jurusan}
                  onChange={handleInputChange}
                  placeholder="Teknik Informatika"
                  className="input input-bordered w-full bg-white dark:bg-gray-900 text-gray-800 dark:text-white border-gray-200 dark:border-gray-700 px-4"
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Target Akademik
                  </span>
                </label>
                {/* PENAMBAHAN px-4 */}
                <input
                  type="text"
                  name="target_akademik"
                  value={formData.target_akademik}
                  onChange={handleInputChange}
                  placeholder="IPK 3.8 / Lulus Cumlaude"
                  className="input input-bordered w-full bg-white dark:bg-gray-900 text-gray-800 dark:text-white border-gray-200 dark:border-gray-700 px-4"
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Target Jam Belajar (Per Hari)
                  </span>
                </label>
                {/* PENAMBAHAN px-4 pada pembungkus label flex */}
                <label className="input input-bordered flex items-center gap-2 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-blue-500/20 px-4">
                  <input
                    type="number"
                    name="jam_belajar_harian"
                    value={formData.jam_belajar_harian}
                    onChange={handleInputChange}
                    className="grow bg-transparent text-gray-800 dark:text-white focus:outline-none"
                    min="0"
                    max="24"
                  />
                  <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                    Jam
                  </span>
                </label>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="btn bg-blue-600 hover:bg-blue-700 text-white border-none shadow-md shadow-blue-600/30 px-8 rounded-xl font-bold flex gap-2"
              >
                <RiSave3Line size={20} />
                {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
}

export default ProfilePage;
