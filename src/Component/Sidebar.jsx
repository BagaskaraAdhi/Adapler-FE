import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  RiDashboardLine,
  RiCalendarCheckLine,
  RiFileTextLine,
  RiRobot2Line,
  RiQuestionnaireLine,
  RiLogoutBoxRLine,
} from "@remixicon/react";
import logo from "../assets/logo.png";

const menuItems = [
  { name: "Dashboard", icon: RiDashboardLine, path: "/dashboard" },
  { name: "Study Planner", icon: RiCalendarCheckLine, path: "/tasks" },
  { name: "Material Summary", icon: RiFileTextLine, path: "/materials" },
  { name: "AI Tutor", icon: RiRobot2Line, path: "/ai-tutor" },
  { name: "Quiz Generate", icon: RiQuestionnaireLine, path: "/quiz-generate" },
];

function Sidebar({ isSidebarOpen }) {
  const location = useLocation();
  const [userData, setUserData] = useState({
    fullname: "Loading...",
    email: "Loading...",
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const API_BASE_URL = "https://adapler-api.inidito.my.id";
  const token = localStorage.getItem("authToken");

  const isProfileActive = location.pathname === "/profile";

  useEffect(() => {
    if (token) {
      fetchUserData();
      fetchUserPhoto();
    }
  }, [token]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/profiles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const result = await response.json();
        setUserData({
          fullname: result.data.fullname || "User",
          email: result.data.email || "user@email.com",
        });
      }
    } catch (error) {
      console.error("Gagal mengambil data user:", error);
    }
  };

  const fetchUserPhoto = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/profiles/photo-profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const blob = await response.blob();
        setProfilePhoto(URL.createObjectURL(blob));
      }
    } catch (error) {
      console.error("Gagal mengambil foto profil:", error);
    }
  };

  return (
    <div className="drawer-side z-40">
      <label
        htmlFor="my-drawer-2"
        aria-label="close sidebar"
        className="drawer-overlay"
      ></label>

      <div
        className={`p-0 min-h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? "w-72" : "w-72 lg:w-[88px]"}`}
      >
        <div
          className={`hidden lg:flex flex-col pt-5 pb-2 ${isSidebarOpen ? "px-6 items-start" : "px-0 items-center justify-center"}`}
        >
          <Link
            to="/dashboard"
            className="text-2xl font-black italic tracking-tight text-blue-600 dark:text-blue-400 mb-4 h-8 flex items-center gap-2"
          >
            <img
              src={logo}
              alt="Adapler AI"
              className="w-8 h-8 object-contain"
            />
            <span
              className={`transition-opacity duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0 hidden"}`}
            >
              Adapler<span className="text-gray-800 dark:text-white">AI</span>
            </span>
          </Link>
        </div>

        {/* Menu Items */}
        <ul
          className={`menu py-4 w-full gap-3 text-gray-600 dark:text-gray-400 font-medium flex-1 overflow-y-auto ${isSidebarOpen ? "px-4" : "px-3 items-center"}`}
        >
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <li
                key={index}
                className={
                  !isSidebarOpen
                    ? "tooltip tooltip-right w-full flex justify-center"
                    : "w-full"
                }
                data-tip={!isSidebarOpen ? item.name : ""}
              >
                <Link
                  to={item.path}
                  className={`flex items-center transition-colors ${isSidebarOpen ? "px-4 py-3 rounded-xl gap-3" : "justify-center p-3 rounded-xl w-12 h-12"} ${isActive ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold" : "hover:text-blue-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-gray-700/50"}`}
                >
                  <item.icon size={22} className="min-w-[22px]" />
                  <span
                    className={`transition-opacity duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0 hidden"}`}
                  >
                    {item.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* User Info & Logout Section */}
        <div
          className={`mt-auto border-t border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/50 ${isSidebarOpen ? "p-4" : "p-4 flex justify-center"}`}
        >
          {isSidebarOpen ? (
            <div
              className={`flex items-center justify-between border p-3 rounded-2xl shadow-sm transition-colors group w-full ${isProfileActive ? "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700" : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600"}`}
            >
              <Link
                to="/profile"
                className="flex items-center gap-3 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity flex-1"
              >
                <div className="avatar">
                  <div
                    className={`w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center ${isProfileActive ? "bg-blue-100" : "bg-blue-100 dark:bg-blue-900/40"}`}
                  >
                    {profilePhoto ? (
                      <img
                        src={profilePhoto}
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span
                        className={`font-bold text-lg ${isProfileActive ? "text-blue-700" : "text-blue-600"}`}
                      >
                        {userData.fullname.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col truncate">
                  <span
                    className={`text-sm font-bold truncate ${isProfileActive ? "text-blue-700 dark:text-blue-300" : "text-gray-800 dark:text-gray-200"}`}
                  >
                    {userData.fullname}
                  </span>
                  <span
                    className={`text-xs truncate ${isProfileActive ? "text-blue-600/80 dark:text-blue-400/80" : "text-gray-500 dark:text-gray-400"}`}
                  >
                    {userData.email}
                  </span>
                </div>
              </Link>

              <button
                onClick={() => {
                  localStorage.removeItem("authToken");
                  window.location.href = "/login";
                }}
                className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors"
                title="Keluar"
              >
                <RiLogoutBoxRLine size={20} />
              </button>
            </div>
          ) : (
            <Link
              to="/profile"
              className={`avatar cursor-pointer tooltip tooltip-right ${isProfileActive ? "ring-2 ring-blue-500 rounded-xl" : ""}`}
              data-tip="Profil"
            >
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-200 bg-white flex items-center justify-center">
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-bold text-xl text-blue-600">
                    {userData.fullname.charAt(0)}
                  </span>
                )}
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
