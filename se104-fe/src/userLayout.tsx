import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import UserSidebar from "./components/layout/user.sidebar";
import GlobalMessageListener from "./components/MessageListener";
import AIChatWidget from "./components/AIChatWidget";

const UserLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile on mount
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar / Mobile Header */}
      {!isMobile && (
        <aside
          className={`fixed top-0 left-0 h-full z-30 transition-all duration-300 bg-white shadow-lg ${
            sidebarOpen ? "w-72" : "w-20"
          }`}
          aria-label="Sidebar"
        >
          <UserSidebar
            open={sidebarOpen}
            setOpen={setSidebarOpen}
            isMobile={false}
          />
        </aside>
      )}

      {/* Mobile Header is rendered inside UserSidebar when isMobile is true */}
      {isMobile && (
        <UserSidebar
          open={sidebarOpen}
          setOpen={setSidebarOpen}
          isMobile={true}
        />
      )}

      {/* Main content */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isMobile
            ? "pt-16" // Add padding for mobile header
            : sidebarOpen
            ? "ml-72"
            : "ml-20"
        }`}
      >
        <GlobalMessageListener />
        <Outlet />
        <AIChatWidget />
      </div>
    </div>
  );
};

export default UserLayout;
