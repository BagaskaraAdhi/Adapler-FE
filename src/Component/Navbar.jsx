import React from "react";
import { RiMenuLine, RiMoonLine, RiSunLine } from "@remixicon/react";
import { useTheme } from "./ThemeContext";

function Navbar({ isSidebarOpen, setIsSidebarOpen }) {
  const { isDarkMode, setIsDarkMode } = useTheme();

  return (
    <div className="w-full navbar bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 px-4 lg:px-6 transition-colors duration-300">
      <div className="flex-1 flex items-center gap-2 lg:gap-4">
        <label
          htmlFor="my-drawer-2"
          className="btn btn-square btn-ghost text-blue-600 dark:text-blue-400 lg:hidden hover:bg-blue-50 dark:hover:bg-gray-700"
        >
          <RiMenuLine size={24} />
        </label>

        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="btn btn-square btn-ghost text-gray-600 dark:text-gray-300 hidden lg:flex hover:bg-blue-50 dark:hover:bg-gray-700"
          title={isSidebarOpen ? "Kecilkan Sidebar" : "Perbesar Sidebar"}
        >
          <RiMenuLine size={24} />
        </button>

        <div className="lg:hidden ml-2">
          <a className="text-xl font-black italic tracking-tight text-blue-600 dark:text-blue-400">
            Adapler<span className="text-gray-800 dark:text-white">AI</span>
          </a>
        </div>
      </div>

      <div className="flex-none flex items-center gap-2">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="btn btn-circle btn-ghost text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title={isDarkMode ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
        >
          {isDarkMode ? (
            <RiSunLine size={22} className="text-orange-400" />
          ) : (
            <RiMoonLine size={22} className="text-blue-600" />
          )}
        </button>
      </div>
    </div>
  );
}

export default Navbar;
