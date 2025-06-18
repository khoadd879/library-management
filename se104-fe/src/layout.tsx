import { useState } from "react";
import { Outlet } from "react-router-dom";
import AppSidebar from "./components/layout/admin.sidebar";
import GlobalMessageListener from "./components/MessageListener";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar thực tế */}
      <aside
        className={`fixed top-0 left-0 h-full z-30 transition-all duration-300 bg-white shadow-lg ${
          sidebarOpen ? "w-72" : "w-20"
        }`}
        aria-label="Sidebar"
      >
        <AppSidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      </aside>

      {/* Main content with left margin for sidebar */}
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-72" : "ml-20"
        }`}
      >
        <GlobalMessageListener />
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
