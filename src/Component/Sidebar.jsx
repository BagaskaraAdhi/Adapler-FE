import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  RiDashboardLine,
  RiCalendarCheckLine,
  RiFileTextLine,
  RiRobot2Line,
  RiLogoutBoxRLine,
} from "@remixicon/react";

// Pastikan path di sini sama persis dengan yang ada di <Route> pada App.jsx
const menuItems = [
  { name: "Dashboard", icon: RiDashboardLine, path: "/dashboard" },
  { name: "Task & Planner", icon: RiCalendarCheckLine, path: "/tasks" },
  { name: "Material Summary", icon: RiFileTextLine, path: "/materials" },
  { name: "AI Tutor & Quiz", icon: RiRobot2Line, path: "/ai-tutor" },
];

function Sidebar({ isSidebarOpen }) {
  const location = useLocation();

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
          className={`hidden lg:flex flex-col pt-5 pb-2 ${isSidebarOpen ? "px-6 items-start" : "px-0 items-center"}`}
        >
          {isSidebarOpen ? (
            <Link
              to="/dashboard"
              className="text-2xl font-black italic tracking-tight text-blue-600 dark:text-blue-400 mb-4 h-8 flex items-center"
            >
              Adapler<span className="text-gray-800 dark:text-white">AI</span>
            </Link>
          ) : (
            <Link
              to="/dashboard"
              className="text-2xl font-black italic tracking-tight text-blue-600 dark:text-blue-400 mb-4 h-8 flex items-center tooltip tooltip-right"
              data-tip="Adapler AI"
            >
              A<span className="text-gray-800 dark:text-white">AI</span>
            </Link>
          )}
        </div>

        <ul
          className={`menu py-4 w-full gap-3 text-gray-600 dark:text-gray-400 font-medium flex-1 overflow-y-auto overflow-x-hidden ${isSidebarOpen ? "px-4" : "px-3 items-center"}`}
        >
          {menuItems.map((item, index) => {
            // Logika untuk menentukan apakah menu ini sedang aktif
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
                {/* Menggunakan komponen Link agar URL berubah tanpa refresh halaman */}
                <Link
                  to={item.path}
                  className={`flex items-center transition-colors ${
                    isSidebarOpen
                      ? "px-4 py-3 rounded-xl gap-3"
                      : "justify-center p-3 rounded-xl w-12 h-12"
                  } ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold"
                      : "hover:text-blue-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <item.icon size={22} className="min-w-[22px]" />
                  <span
                    className={`transition-opacity duration-300 ${
                      isSidebarOpen ? "opacity-100" : "opacity-0 hidden"
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              </li>
            );
          })}

          <div
            className={`divider my-1 border-gray-100 dark:border-gray-700 ${
              isSidebarOpen ? "px-0" : "px-4"
            }`}
          ></div>
        </ul>

        <div
          className={`mt-auto border-t border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/50 ${
            isSidebarOpen ? "p-4" : "p-4 flex justify-center"
          }`}
        >
          {isSidebarOpen ? (
            <div className="flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 p-3 rounded-2xl shadow-sm hover:border-blue-300 dark:hover:border-blue-500 transition-colors cursor-pointer group w-full">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="avatar placeholder">
                  <div className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl w-10 h-10 flex items-center justify-center shrink-0">
                    <span className="font-bold text-lg">B</span>
                  </div>
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    Bagaskara Adhi
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    user@kampus.ac.id
                  </span>
                </div>
              </div>
              <Link
                to="/"
                className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors shrink-0"
                title="Keluar"
              >
                <RiLogoutBoxRLine size={20} />
              </Link>
            </div>
          ) : (
            <div
              className="avatar placeholder cursor-pointer tooltip tooltip-right"
              data-tip="Profil & Keluar"
            >
              <div className="bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-xl w-12 h-12 flex items-center justify-center border border-gray-200 dark:border-gray-600 shadow-sm hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
                <span className="font-bold text-xl">B</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
