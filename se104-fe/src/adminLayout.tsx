import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Button } from "antd";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Color palette
  const primaryColor = '#153D36';
  const lightPrimary = '#E8F5F2';
  const secondaryColor = '#27AE60';

  const navs = [
    {
      label: "Trang chủ",
      path: "/",
    },
    {
      label: "Quản lý Vai Trò",
      path: "/admin/roles",
    },
    {
      label: "Quản lý Người Dùng",
      path: "/admin/users",
    },
  ];

  const getButtonStyle = (nav: { path: string }) => {
    const isActive =
      location.pathname === nav.path ||
      (nav.path !== "/" && location.pathname.startsWith(nav.path));
    const isHome = nav.path === "/";

    if (isActive) {
      return {
        backgroundColor: secondaryColor,
        color: 'white',
        borderColor: primaryColor,
        ':hover': {
          backgroundColor: secondaryColor,
          borderColor: secondaryColor,
        }
      };
    }

    if (isHome) {
      return {
        backgroundColor: 'white',
        color: primaryColor,
        borderColor: primaryColor,
        ':hover': {
          backgroundColor: lightPrimary,
          color: primaryColor,
          borderColor: primaryColor,
        }
      };
    }

    return {
      backgroundColor: 'white',
      color: primaryColor,
      borderColor: primaryColor,
      ':hover': {
        backgroundColor: lightPrimary,
        color: secondaryColor,
        borderColor: secondaryColor,
      }
    };
  };

  return (
    <div className="p-6 min-h-screen" style={{ background: lightPrimary }}>
      <div className="flex gap-4 mb-8 bg-white rounded-xl shadow-sm p-4" style={{ border: `1px solid ${lightPrimary}` }}>
        {navs.map((nav) => (
          <Button
            key={nav.path}
            type="default" // Luôn để type là default và tự kiểm soát style
            onClick={() => navigate(nav.path)}
            size="large"
            style={{
              borderRadius: 8,
              fontWeight: 500,
              transition: 'all 0.3s ease',
              ...getButtonStyle(nav),
            }}
            onMouseEnter={(e) => {
              const style = getButtonStyle(nav);
              e.currentTarget.style.backgroundColor = style[':hover']?.backgroundColor || style.backgroundColor;
              e.currentTarget.style.color = style[':hover']?.color || style.color;
              e.currentTarget.style.borderColor = style[':hover']?.borderColor || style.borderColor;
            }}
            onMouseLeave={(e) => {
              const style = getButtonStyle(nav);
              e.currentTarget.style.backgroundColor = style.backgroundColor;
              e.currentTarget.style.color = style.color;
              e.currentTarget.style.borderColor = style.borderColor;
            }}
          >
            {nav.label}
          </Button>
        ))}
      </div>
      <div className="bg-white rounded-xl shadow-sm p-6" style={{ border: `1px solid ${lightPrimary}` }}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;