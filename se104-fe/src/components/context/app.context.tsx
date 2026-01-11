import { authenticateAPI } from "@/services/api";
import { createContext, useContext, useEffect, useState } from "react";

type IAppContext = {
  user: IFetchUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  setIsAuthenticated: (v: boolean) => void;
  setUser: (v: IFetchUser | null) => void;
};

const CurrentAppContext = createContext<IAppContext | null>(null);

type TProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: TProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<IFetchUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await authenticateAPI(token);

        // --- SỬA ĐOẠN NÀY ---
        // Kiểm tra kỹ: Phải có res, có data và quan trọng là phải có trường roleName (hoặc idUser)
        // Vì nếu API lỗi, res vẫn trả về object { data: { message: "Lỗi..." }, status: 500 } -> Cái này không phải User!
        if (res && res.data && res.data.roleName) {
          setIsAuthenticated(true);
          setUser(res);
        } else {
          // Nếu res tồn tại nhưng không đúng cấu trúc user -> Coi như lỗi
          console.warn("Token không hợp lệ hoặc hết hạn", res);
          setIsAuthenticated(false);
          setUser(null);
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
        }
        // ---------------------
      } catch (err) {
        // ... (giữ nguyên catch)
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <CurrentAppContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        setIsAuthenticated,
        setUser,
      }}
    >
      {children}
    </CurrentAppContext.Provider>
  );
};

export const useCurrentApp = () => {
  const context = useContext(CurrentAppContext);
  if (!context) {
    throw new Error(
      "useCurrentApp must be used within a CurrentAppContext.Provider"
    );
  }
  return context;
};
