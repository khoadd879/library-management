import { Outlet } from "react-router-dom";
import AppSidebar from "./components/layout/admin.sidebar";

function Layout() {
  return (
    <div className="flex ">
      <div>
        <AppSidebar />
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
