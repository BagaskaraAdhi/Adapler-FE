import React, { useState } from "react";
import Navbar from "../Component/Navbar";
import Sidebar from "../Component/Sidebar";

function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="drawer lg:drawer-open font-sans transition-colors duration-300 min-h-screen bg-slate-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col items-center justify-start transition-all duration-300 w-full overflow-hidden">
        <Navbar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* ini bagian yang berperan seperti @yield('content') */}
        <div className="w-full max-w-7xl p-6 lg:p-10 mx-auto">{children}</div>
      </div>

      <Sidebar isSidebarOpen={isSidebarOpen} />
    </div>
  );
}

export default DashboardLayout;
