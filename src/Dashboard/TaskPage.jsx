import React, { useState, useEffect } from "react";
import DashboardLayout from "../Layout/DashboardLayout";
import {
  RiEdit2Line,
  RiDeleteBinLine,
  RiCalendarEventLine,
  RiMagicLine,
  RiAddLine,
  RiCloseLine,
  RiInformationLine,
  RiArrowDownSLine,
  RiCheckLine,
  RiRobot2Line,
} from "@remixicon/react";

function TaskPage() {
  const API_BASE_URL = "https://adapler-api.inidito.my.id";
  const token = localStorage.getItem("authToken");

  // ================= STATE UNTUK TASKS =================
  const [tasks, setTasks] = useState([]);
  const [isTaskLoading, setIsTaskLoading] = useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);
  const [taskEditId, setTaskEditId] = useState(null);
  const [taskFormData, setTaskFormData] = useState({
    task_name: "",
    deadline_date: "",
    deadline_time: "",
    progres: 0,
    prioritas: "sedang",
    status: "belum_selesai",
  });

  // ================= STATE UNTUK STUDY PLANNER =================
  const [planners, setPlanners] = useState([]);
  const [selectedPlanner, setSelectedPlanner] = useState(null);
  const [isPlannerLoading, setIsPlannerLoading] = useState(false);

  // Modal Generate Planner
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [startTime, setStartTime] = useState("");

  // Modal Edit Planner
  const [isEditPlannerModalOpen, setIsEditPlannerModalOpen] = useState(false);
  const [isSubmittingPlannerEdit, setIsSubmittingPlannerEdit] = useState(false);
  const [editJadwal, setEditJadwal] = useState([]);

  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (token) {
      fetchTasks();
      fetchPlanners();
    }
  }, [token]);

  // ================= FUNGSI API: TASKS =================
  const fetchTasks = async () => {
    setIsTaskLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/task/not-finish`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const result = await response.json();
        setTasks(Array.isArray(result?.data?.tasks) ? result.data.tasks : []);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error("Gagal mengambil tugas:", error);
    } finally {
      setIsTaskLoading(false);
    }
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingTask(true);
    setMessage({ text: "", type: "" });

    const url = taskEditId
      ? `${API_BASE_URL}/task/${taskEditId}`
      : `${API_BASE_URL}/task`;
    const method = taskEditId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...taskFormData,
          progres: Number(taskFormData.progres),
        }),
      });

      const resData = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(resData.message || "Gagal menyimpan tugas.");
      }

      setMessage({
        text: `Tugas berhasil ${taskEditId ? "diperbarui" : "ditambahkan"}!`,
        type: "success",
      });
      setIsTaskModalOpen(false);

      await fetchTasks();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setMessage({ text: error.message, type: "error" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmittingTask(false);
    }
  };

  const handleTaskDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus tugas ini?")) return;
    try {
      const response = await fetch(`${API_BASE_URL}/task/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Gagal menghapus tugas.");
      setMessage({ text: "Tugas berhasil dihapus!", type: "success" });
      fetchTasks();
    } catch (error) {
      setMessage({ text: error.message, type: "error" });
    }
  };

  // ================= FUNGSI API: STUDY PLANNER =================
  const fetchPlanners = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/study-planner`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const result = await response.json();
        const plannerList = result.data?.studyPlanner || [];
        setPlanners(plannerList);

        if (plannerList.length > 0 && !selectedPlanner) {
          fetchPlannerDetail(plannerList[0].id);
        }
      }
    } catch (error) {
      console.error("Gagal memuat history planner:", error);
    }
  };

  const fetchPlannerDetail = async (id) => {
    setIsPlannerLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/study-planner/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const result = await response.json();
        setSelectedPlanner(result.data);
      }
    } catch (error) {
      console.error("Gagal memuat detail planner:", error);
    } finally {
      setIsPlannerLoading(false);
    }
  };

  const handleGeneratePlanner = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch(`${API_BASE_URL}/study-planner`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ startTime }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(data.message || "Gagal meng-generate jadwal.");

      setMessage({
        text: "Jadwal berhasil digenerate oleh AI!",
        type: "success",
      });
      setIsGenerateModalOpen(false);
      setStartTime("");
      fetchPlanners();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setMessage({ text: error.message, type: "error" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeletePlanner = async () => {
    if (!selectedPlanner) return;
    if (!window.confirm("Yakin ingin menghapus jadwal ini?")) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/study-planner/${selectedPlanner.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!response.ok) throw new Error("Gagal menghapus jadwal.");
      setMessage({ text: "Jadwal berhasil dihapus!", type: "success" });
      setSelectedPlanner(null);
      fetchPlanners();
    } catch (error) {
      setMessage({ text: error.message, type: "error" });
    }
  };

  // ================= FUNGSI: EDIT STUDY PLANNER (PUT) =================
  const handleOpenEditPlannerModal = () => {
    if (!selectedPlanner) return;
    const jadwalArray = Array.isArray(selectedPlanner.jadwal)
      ? selectedPlanner.jadwal
      : [];

    setEditJadwal(
      jadwalArray.map((item) => ({
        waktu: item.waktu || item.time || item.jam || "",
        aktivitas: item.aktivitas || item.activity || item.tugas || "",
      })),
    );
    setIsEditPlannerModalOpen(true);
  };

  const addJadwalItem = () => {
    setEditJadwal([...editJadwal, { waktu: "", aktivitas: "" }]);
  };

  const removeJadwalItem = (idx) => {
    setEditJadwal(editJadwal.filter((_, i) => i !== idx));
  };

  const updateJadwalItem = (idx, field, value) => {
    setEditJadwal(
      editJadwal.map((item, i) =>
        i === idx ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handleEditPlannerSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlanner) return;

    setIsSubmittingPlannerEdit(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch(
        `${API_BASE_URL}/study-planner/${selectedPlanner.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          // Catatan: struktur "detail_jadwal" mengikuti asumsi field "jadwal"
          // yang dikembalikan GET. Sesuaikan lagi jika BE mengharapkan bentuk lain.
          body: JSON.stringify({ detail_jadwal: editJadwal }),
        },
      );

      const resData = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(resData.message || "Gagal memperbarui jadwal.");
      }

      setMessage({ text: "Jadwal berhasil diperbarui!", type: "success" });
      setIsEditPlannerModalOpen(false);

      await fetchPlanners();
      fetchPlannerDetail(selectedPlanner.id);
    } catch (error) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      setIsSubmittingPlannerEdit(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // ================= PARSER TANGGAL SUPER TANGGUH =================
  const parseSafeDate = (dateString) => {
    if (!dateString) return null;
    let str = String(dateString);

    // 1. Coba parse native javascript dulu
    let d = new Date(str);
    if (!isNaN(d.getTime())) return d;

    // 2. Jika gagal, ubah bulan bahasa Indonesia ke angka
    const idMonths = {
      januari: "01",
      februari: "02",
      maret: "03",
      april: "04",
      mei: "05",
      juni: "06",
      juli: "07",
      agustus: "08",
      september: "09",
      oktober: "10",
      november: "11",
      desember: "12",
    };
    let normalizedStr = str.toLowerCase();
    for (const [namaBulan, angkaBulan] of Object.entries(idMonths)) {
      normalizedStr = normalizedStr.replace(
        new RegExp(`\\b${namaBulan}\\b`, "g"),
        angkaBulan,
      );
    }

    // 3. Ekstrak pola angka (Tgl, Bln, Thn, Jam, Mnt)
    const nums = normalizedStr.match(/\d+/g);
    if (nums && nums.length >= 3) {
      let year, month, day;
      if (nums[0].length === 4) {
        year = nums[0];
        month = nums[1];
        day = nums[2];
      } else if (nums[2].length === 4) {
        day = nums[0];
        month = nums[1];
        year = nums[2];
      } else {
        return null;
      }

      let hour = nums[3] || "00";
      let min = nums[4] || "00";
      let sec = nums[5] || "00";

      // Gabung jadi ISO Format yang dijamin bisa dibaca browser
      const iso = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${hour.padStart(2, "0")}:${min.padStart(2, "0")}:${sec.padStart(2, "0")}`;
      d = new Date(iso);
      if (!isNaN(d.getTime())) return d;
    }
    return null;
  };

  const getDeadlineInfo = (dateString) => {
    if (!dateString) return { text: "-", color: "text-gray-500" };

    const deadline = parseSafeDate(dateString);
    // Jika semua cara parsing gagal, tampilkan seluruh string asli dari Backend
    if (!deadline)
      return {
        text: String(dateString),
        color: "text-gray-600 dark:text-gray-400 font-medium",
      };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0)
      return { text: "Terlewat", color: "text-red-600 font-bold" };
    if (diffDays === 0)
      return { text: "Hari ini", color: "text-red-500 font-bold" };
    if (diffDays === 1)
      return { text: "Besok", color: "text-orange-500 font-medium" };
    return {
      text: `${diffDays} Hari lagi`,
      color: "text-gray-600 dark:text-gray-400",
    };
  };

  const extractTime = (dateString) => {
    if (!dateString) return "-";
    const d = parseSafeDate(dateString);
    if (d) {
      return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    }
    // Fallback: Cari string yang berbentuk jam (misal 23:59)
    const match = String(dateString).match(/\b\d{1,2}:\d{2}\b/);
    return match ? match[0] : "-";
  };

  const getPriorityBadge = (priority) => {
    const p = (priority || "").toLowerCase();
    if (p === "tinggi") return "bg-red-100 text-red-600";
    if (p === "sedang") return "bg-orange-100 text-orange-600";
    return "bg-blue-100 text-blue-600";
  };

  const handleOpenTaskModal = (task = null) => {
    if (task) {
      setTaskEditId(task.id);

      let datePart = "";
      let timePart = "";

      const d = parseSafeDate(task.deadline);
      if (d) {
        // Ekstrak nilai YYYY-MM-DD untuk input type="date"
        datePart = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        // Ekstrak nilai HH:mm untuk input type="time"
        timePart = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
      }

      setTaskFormData({
        task_name: task.task_name || "",
        deadline_date: datePart,
        deadline_time: timePart,
        progres: task.progres || 0,
        prioritas: task.prioritas || "sedang",
        status: task.status || "belum_selesai",
      });
    } else {
      setTaskEditId(null);
      setTaskFormData({
        task_name: "",
        deadline_date: "",
        deadline_time: "",
        progres: 0,
        prioritas: "sedang",
        status: "belum_selesai",
      });
    }
    setIsTaskModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Study Planner
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Kelola tugas akademik dan dapatkan rekomendasi jadwal belajar dari
            AI.
          </p>
        </div>
        <button
          onClick={() => setIsGenerateModalOpen(true)}
          className="btn bg-blue-600 hover:bg-blue-700 text-white border-none shadow-lg shadow-blue-600/30 px-6 rounded-xl font-bold flex items-center gap-2"
        >
          <RiMagicLine size={20} /> Generate AI Planner
        </button>
      </div>

      {message.text && (
        <div
          className={`alert ${message.type === "error" ? "alert-error bg-red-50 text-red-600" : "alert-success bg-green-50 text-green-600"} text-sm p-3 mb-6 rounded-lg border-none`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ================= KOLOM KIRI: AI STUDY PLANNER ================= */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="card bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-2xl h-full">
            <div className="card-body p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <RiCalendarEventLine size={24} className="text-orange-500" />
                  <h2 className="card-title text-xl text-gray-900 dark:text-white">
                    Jadwal AI
                  </h2>
                </div>

                {selectedPlanner && (
                  <button
                    onClick={handleOpenEditPlannerModal}
                    title="Edit Jadwal"
                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 transition-all duration-200 hover:scale-105"
                  >
                    <RiEdit2Line size={17} />
                  </button>
                )}
              </div>

              {planners.length > 0 ? (
                <div className="mb-4">
                  <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">
                    Pilih Riwayat Jadwal
                  </label>

                  <div className="dropdown w-full">
                    <div
                      tabIndex={0}
                      role="button"
                      className="flex items-center justify-between w-full bg-slate-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 rounded-xl px-4 py-3 cursor-pointer transition-colors group"
                    >
                      {selectedPlanner ? (
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                            <RiCalendarEventLine size={18} />
                          </div>
                          <div className="flex flex-col text-left truncate">
                            <span className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate">
                              {selectedPlanner.tanggal}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Target {selectedPlanner.target_harian} Jam/hari
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">
                          Pilih jadwal...
                        </span>
                      )}
                      <RiArrowDownSLine
                        size={20}
                        className="text-gray-400 group-focus-within:rotate-180 transition-transform shrink-0"
                      />
                    </div>

                    <ul
                      tabIndex={0}
                      className="dropdown-content menu z-20 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl rounded-xl p-2 max-h-72 overflow-y-auto"
                    >
                      {planners.map((p) => {
                        const isActive = selectedPlanner?.id === p.id;
                        return (
                          <li key={p.id}>
                            <button
                              type="button"
                              onClick={(e) => {
                                fetchPlannerDetail(p.id);
                                e.currentTarget.closest("ul").blur();
                              }}
                              className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                                isActive
                                  ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold"
                                  : "text-gray-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-gray-700/50"
                              }`}
                            >
                              <div className="flex flex-col text-left truncate">
                                <span className="truncate">{p.tanggal}</span>
                                <span className="text-xs font-normal opacity-70">
                                  Target {p.target_harian} Jam
                                </span>
                              </div>
                              {isActive && (
                                <RiCheckLine size={18} className="shrink-0" />
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 flex flex-col items-center">
                  <RiInformationLine size={32} className="mb-2 opacity-50" />
                  <p className="text-sm">
                    Belum ada jadwal yang digenerate.
                    <br />
                    Klik tombol "Generate AI Planner" di atas.
                  </p>
                </div>
              )}

              {isPlannerLoading ? (
                <div className="flex justify-center py-8">
                  <span className="loading loading-spinner text-blue-500"></span>
                </div>
              ) : selectedPlanner ? (
                <>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl mb-4 border border-blue-100 dark:border-blue-900/30">
                    <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">
                      Total Estimasi: {selectedPlanner.total_jam_belajar} Jam
                    </p>
                  </div>

                  <div className="flex-1 overflow-y-auto max-h-[400px] pr-2">
                    <ul className="steps steps-vertical w-full">
                      {Array.isArray(selectedPlanner.jadwal) &&
                        selectedPlanner.jadwal.map((item, idx) => (
                          <li
                            key={idx}
                            className="step step-primary text-sm font-medium text-gray-800 dark:text-gray-200"
                          >
                            <div className="text-left w-full pl-2 pb-4">
                              <span className="block font-bold text-blue-600 dark:text-blue-400">
                                {item.waktu || item.time || item.jam || "Waktu"}
                              </span>
                              {item.aktivitas ||
                                item.activity ||
                                item.tugas ||
                                "Aktivitas"}
                            </div>
                          </li>
                        ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button
                      onClick={handleDeletePlanner}
                      className="btn btn-outline btn-error w-full rounded-xl font-bold"
                    >
                      Hapus Jadwal Ini
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>

        {/* ================= KOLOM KANAN: TASK MANAGEMENT ================= */}
        <div className="lg:col-span-2 card bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-2xl">
          <div className="card-body p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="card-title text-xl text-gray-900 dark:text-white">
                Daftar Tugas
              </h2>
              <button
                onClick={() => handleOpenTaskModal()}
                className="btn btn-sm btn-outline text-gray-600 dark:text-gray-300 px-4 rounded-xl font-medium flex items-center gap-1"
              >
                <RiAddLine size={18} /> Tambah Manual
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                    <th>Nama Tugas</th>
                    <th>Deadline</th>
                    <th>Prioritas</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {isTaskLoading ? (
                    <tr>
                      <td colSpan="4" className="text-center py-6">
                        Memuat data...
                      </td>
                    </tr>
                  ) : tasks.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="text-center py-6 text-gray-500"
                      >
                        Belum ada tugas.
                      </td>
                    </tr>
                  ) : (
                    tasks.map((task) => {
                      const deadlineInfo = getDeadlineInfo(task.deadline);
                      return (
                        <tr
                          key={task.id}
                          className="hover:bg-slate-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-50 dark:border-gray-700/50"
                        >
                          <td className="font-medium text-gray-800 dark:text-gray-200">
                            {task.task_name}
                          </td>
                          <td className={deadlineInfo.color}>
                            {deadlineInfo.text}
                          </td>
                          <td>
                            <span
                              className={`badge border-none badge-sm font-medium px-3 py-2 ${getPriorityBadge(task.prioritas)}`}
                            >
                              {task.prioritas}
                            </span>
                          </td>
                          <td>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleOpenTaskModal(task)}
                                title="Edit Tugas"
                                className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-500 dark:text-blue-400 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 transition-all duration-200 hover:scale-105"
                              >
                                <RiEdit2Line size={17} />
                              </button>
                              <button
                                onClick={() => handleTaskDelete(task.id)}
                                title="Hapus Tugas"
                                className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 transition-all duration-200 hover:scale-105"
                              >
                                <RiDeleteBinLine size={17} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {isGenerateModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box bg-white dark:bg-gray-800 rounded-2xl relative">
            <button
              onClick={() => setIsGenerateModalOpen(false)}
              className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
            >
              <RiCloseLine size={20} />
            </button>
            <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              Buat Jadwal via AI
              <RiRobot2Line
                size={22}
                className="text-blue-600 dark:text-blue-400"
              />
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              AI akan membaca daftar tugasmu dan membuatkan rincian langkah
              belajar.
            </p>

            <form
              onSubmit={handleGeneratePlanner}
              className="flex flex-col gap-4"
            >
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    Jam Berapa Kamu Ingin Mulai Belajar?
                  </span>
                </label>
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="input input-bordered w-full dark:bg-gray-900 dark:text-white"
                />
                <label className="label">
                  <span className="label-text-alt text-gray-500">
                    Contoh: 19:00
                  </span>
                </label>
              </div>

              <div className="modal-action mt-4">
                <button
                  type="button"
                  onClick={() => setIsGenerateModalOpen(false)}
                  className="btn btn-ghost"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isGenerating || !startTime}
                  className="btn bg-blue-600 hover:bg-blue-700 text-white border-none px-6"
                >
                  {isGenerating ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "Generate Jadwal"
                  )}
                </button>
              </div>
            </form>
          </div>
          <div
            className="modal-backdrop bg-black/40"
            onClick={() => setIsGenerateModalOpen(false)}
          ></div>
        </div>
      )}

      {/* ================= MODAL EDIT JADWAL AI ================= */}
      {isEditPlannerModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box bg-white dark:bg-gray-800 rounded-2xl relative max-w-2xl">
            <button
              onClick={() => setIsEditPlannerModalOpen(false)}
              className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
            >
              <RiCloseLine size={20} />
            </button>
            <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-1">
              Edit Jadwal AI
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Sesuaikan langkah waktu dan aktivitas belajarmu.
            </p>

            <form
              onSubmit={handleEditPlannerSubmit}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-3 max-h-[360px] overflow-y-auto pr-1">
                {editJadwal.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-6">
                    Belum ada langkah. Klik "Tambah Langkah" di bawah.
                  </p>
                ) : (
                  editJadwal.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 bg-slate-50 dark:bg-gray-900 rounded-xl p-3"
                    >
                      <div className="flex flex-col gap-2 flex-1">
                        <input
                          type="text"
                          value={item.waktu}
                          onChange={(e) =>
                            updateJadwalItem(idx, "waktu", e.target.value)
                          }
                          placeholder="Waktu, contoh: 19:00 - 20:00"
                          className="input input-bordered input-sm w-full dark:bg-gray-800 dark:text-white"
                        />
                        <input
                          type="text"
                          value={item.aktivitas}
                          onChange={(e) =>
                            updateJadwalItem(idx, "aktivitas", e.target.value)
                          }
                          placeholder="Aktivitas, contoh: Belajar Struktur Data"
                          className="input input-bordered input-sm w-full dark:bg-gray-800 dark:text-white"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeJadwalItem(idx)}
                        title="Hapus Langkah"
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 transition-colors shrink-0 mt-1"
                      >
                        <RiCloseLine size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <button
                type="button"
                onClick={addJadwalItem}
                className="btn btn-outline btn-sm self-start rounded-xl font-medium flex items-center gap-1"
              >
                <RiAddLine size={16} /> Tambah Langkah
              </button>

              <div className="modal-action mt-2">
                <button
                  type="button"
                  onClick={() => setIsEditPlannerModalOpen(false)}
                  className="btn btn-ghost"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPlannerEdit}
                  className="btn bg-blue-600 hover:bg-blue-700 text-white border-none px-6"
                >
                  {isSubmittingPlannerEdit ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "Simpan Perubahan"
                  )}
                </button>
              </div>
            </form>
          </div>
          <div
            className="modal-backdrop bg-black/40"
            onClick={() => setIsEditPlannerModalOpen(false)}
          ></div>
        </div>
      )}

      {/* ================= MODAL TAMBAH / EDIT TUGAS ================= */}
      {isTaskModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box bg-white dark:bg-gray-800 rounded-2xl relative overflow-visible">
            <button
              onClick={() => setIsTaskModalOpen(false)}
              className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
            >
              <RiCloseLine size={20} />
            </button>
            <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-6">
              {taskEditId ? "Edit Tugas" : "Tambah Tugas Baru"}
            </h3>

            <form onSubmit={handleTaskSubmit} className="flex flex-col gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Nama Tugas</span>
                </label>
                <input
                  type="text"
                  name="task_name"
                  required
                  value={taskFormData.task_name}
                  onChange={(e) =>
                    setTaskFormData({
                      ...taskFormData,
                      task_name: e.target.value,
                    })
                  }
                  className="input input-bordered w-full dark:bg-gray-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Tanggal Deadline
                    </span>
                  </label>
                  <input
                    type="date"
                    name="deadline_date"
                    required
                    value={taskFormData.deadline_date}
                    onChange={(e) =>
                      setTaskFormData({
                        ...taskFormData,
                        deadline_date: e.target.value,
                      })
                    }
                    className="input input-bordered w-full dark:bg-gray-900 dark:text-white"
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">
                      Waktu Deadline
                    </span>
                  </label>
                  <input
                    type="time"
                    name="deadline_time"
                    required
                    value={taskFormData.deadline_time}
                    onChange={(e) =>
                      setTaskFormData({
                        ...taskFormData,
                        deadline_time: e.target.value,
                      })
                    }
                    className="input input-bordered w-full dark:bg-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Prioritas</span>
                  </label>
                  <select
                    name="prioritas"
                    value={taskFormData.prioritas}
                    onChange={(e) =>
                      setTaskFormData({
                        ...taskFormData,
                        prioritas: e.target.value,
                      })
                    }
                    className="select select-bordered w-full dark:bg-gray-900 dark:text-white"
                  >
                    <option value="tinggi">Tinggi</option>
                    <option value="sedang">Sedang</option>
                    <option value="rendah">Rendah</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Status</span>
                  </label>
                  <select
                    name="status"
                    value={taskFormData.status}
                    onChange={(e) =>
                      setTaskFormData({
                        ...taskFormData,
                        status: e.target.value,
                      })
                    }
                    className="select select-bordered w-full dark:bg-gray-900 dark:text-white"
                  >
                    <option value="belum_selesai">Belum Selesai</option>
                    <option value="selesai">Selesai</option>
                  </select>
                </div>
              </div>

              <div className="modal-action mt-6">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="btn btn-ghost"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingTask}
                  className="btn bg-blue-600 hover:bg-blue-700 text-white border-none px-6"
                >
                  {isSubmittingTask ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
          <div
            className="modal-backdrop bg-black/40"
            onClick={() => setIsTaskModalOpen(false)}
          ></div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default TaskPage;
