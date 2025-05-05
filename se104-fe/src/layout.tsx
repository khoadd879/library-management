import { Outlet } from "react-router-dom";
import AppSidebar from "./components/layout/app.sidebar";

function Layout() {
  return (
    <div className="flex ">
      <div>
        <AppSidebar />
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
