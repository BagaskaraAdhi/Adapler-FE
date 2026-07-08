import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  RiRobot2Line,
  RiCheckDoubleLine,
  RiTimeLine,
  RiBookOpenLine,
} from "@remixicon/react";
import DashboardLayout from "../Layout/DashboardLayout";

function Dashboard() {
  const navigate = useNavigate();
  const API_BASE_URL = "https://adapler-api.inidito.my.id";
  const token = localStorage.getItem("authToken");

  const [userName, setUserName] = useState("Pengguna");
  const [targetBelajar, setTargetBelajar] = useState(0);
  const [unfinishedTasks, setUnfinishedTasks] = useState([]);
  const [finishedCount, setFinishedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const todayFormatted = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const profileRes = await fetch(`${API_BASE_URL}/profiles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        const firstName =
          profileData?.data?.fullname?.split(" ")[0] || "Pengguna";
        setUserName(firstName);
        setTargetBelajar(profileData?.data?.jamBelajarHarian || 0);
      }

      const unfinishRes = await fetch(`${API_BASE_URL}/task/not-finish`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (unfinishRes.ok) {
        const unfinishData = await unfinishRes.json();
        const tasksArray = Array.isArray(unfinishData?.data?.tasks)
          ? unfinishData.data.tasks
          : [];
        setUnfinishedTasks(tasksArray);
      }

      const finishRes = await fetch(`${API_BASE_URL}/task/finish`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (finishRes.ok) {
        const finishData = await finishRes.json();
        const finishedArray = Array.isArray(finishData?.data?.tasks)
          ? finishData.data.tasks
          : [];
        setFinishedCount(finishedArray.length);
      }
    } catch (error) {
      console.error("Gagal mengambil data dashboard:", error);
      setErrorMsg("Gagal memuat data dari server.");
    } finally {
      setIsLoading(false);
    }
  };

  // ================= PARSER TANGGAL TANGGUH =================
  const parseSafeDate = (dateString) => {
    if (!dateString) return null;
    let d = new Date(dateString);
    if (!isNaN(d.getTime())) return d;
    return null;
  };

  const getDeadlineInfo = (dateString) => {
    if (!dateString) return { text: "-", color: "text-gray-500" };

    const deadline = parseSafeDate(dateString);
    if (!deadline)
      return {
        text: String(dateString).split("T")[0],
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

  const getPriorityBadge = (priority) => {
    const p = (priority || "").toLowerCase();
    if (p === "tinggi")
      return "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400";
    if (p === "sedang")
      return "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400";
    return "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Halo, {userName}! 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium text-sm md:text-base">
            {todayFormatted}
          </p>
        </div>
        <button
          onClick={() => navigate("/tasks")}
          className="btn bg-orange-500 hover:bg-orange-600 text-white border-none shadow-lg shadow-orange-500/40 px-6 rounded-xl font-bold"
        >
          + Kelola Tugas
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-2xl">
          <div className="card-body p-6 flex flex-row items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
              <RiCheckDoubleLine size={28} />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm">Tugas Selesai</h3>
              <p className="text-2xl font-bold">
                {isLoading
                  ? "..."
                  : `${finishedCount} / ${finishedCount + unfinishedTasks.length}`}
              </p>
            </div>
          </div>
        </div>
        <div className="card bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-2xl">
          <div className="card-body p-6 flex flex-row items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-500">
              <RiTimeLine size={28} />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm">Target Belajar</h3>
              <p className="text-2xl font-bold">
                {isLoading ? "..." : `${targetBelajar} Jam / Hari`}
              </p>
            </div>
          </div>
        </div>
        <div className="card bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-2xl">
          <div className="card-body p-6 flex flex-row items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500">
              <RiBookOpenLine size={28} />
            </div>
            <div>
              <h3 className="text-gray-500 text-sm">Tugas Belum Selesai</h3>
              <p className="text-2xl font-bold">
                {isLoading ? "..." : `${unfinishedTasks.length} Tugas`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-2xl transition-colors">
          <div className="card-body p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="card-title text-xl text-gray-900 dark:text-white">
                Tugas Mendatang
              </h2>
              <button
                onClick={() => navigate("/tasks")}
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 bg-transparent border-none cursor-pointer"
              >
                Lihat Semua
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                    <th>Tugas</th>
                    <th>Deadline</th>
                    <th>Prioritas</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="text-center py-6 text-gray-500"
                      >
                        Memuat tugas...
                      </td>
                    </tr>
                  ) : unfinishedTasks.length === 0 ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="text-center py-6 text-gray-500"
                      >
                        Tidak ada tugas mendatang. Santai dulu! 🏕️
                      </td>
                    </tr>
                  ) : (
                    unfinishedTasks.slice(0, 4).map((task) => {
                      const deadlineInfo = getDeadlineInfo(task.deadline);
                      return (
                        <tr key={task.id} className="border-b border-gray-50">
                          <td className="font-medium">{task.task_name}</td>
                          <td className={deadlineInfo.color}>
                            {deadlineInfo.text}
                          </td>
                          <td>
                            <span
                              className={`badge border-none badge-sm ${getPriorityBadge(task.prioritas)}`}
                            >
                              {task.prioritas}
                            </span>
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

        <div className="card bg-gradient-to-br from-blue-700 to-blue-500 dark:from-blue-900 dark:to-blue-700 text-white shadow-lg shadow-blue-900/20 border-none rounded-2xl">
          <div className="card-body p-6">
            <div className="flex items-center gap-3 mb-4">
              <RiRobot2Line size={24} className="text-orange-400" />
              <h2 className="card-title text-xl font-bold">AI Insight</h2>
            </div>
            <p className="text-blue-50 dark:text-gray-200 leading-relaxed mb-6 font-medium text-sm lg:text-base">
              {unfinishedTasks.length > 0 ? (
                <>
                  "Kamu memiliki tugas{" "}
                  <strong className="text-white">
                    {unfinishedTasks[0].task_name}
                  </strong>{" "}
                  yang mendekati deadline. Prioritaskan tugas tersebut, dan
                  biarkan saya membantu meringkas materi yang diperlukan."
                </>
              ) : (
                "Semua tugasmu sudah selesai! Waktu yang tepat untuk bersantai atau me-review materi."
              )}
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
