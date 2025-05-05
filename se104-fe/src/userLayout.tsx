import { Outlet } from "react-router-dom";
import UserSidebar from "./components/layout/user.sidebar";

const UserLayout = () => {
  return (
    <div className="flex">
      <div>
        <UserSidebar />
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;
