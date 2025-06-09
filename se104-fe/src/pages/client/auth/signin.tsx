import { useCurrentApp } from "@/components/context/app.context";
import { loginAPI } from "@/services/api";
import { message } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setIsAuthenticated } = useCurrentApp();

  const handleLogin = async () => {
  if (!username || !password) {
    message.warning("Vui lòng nhập đầy đủ tài khoản và mật khẩu!");
    return;
  }

  try {
    const res = await loginAPI(username, password);

    if (res) {
      // ✅ Lưu token vào localStorage
      localStorage.setItem("token", res.token);

      // ✅ Decode JWT payload
      const base64Url = res.token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const payload = JSON.parse(jsonPayload);

      // ✅ Lấy nameidentifier
      const nameIdentifier =
        payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

      // ✅ Lưu vào localStorage hoặc context nếu cần
      localStorage.setItem("idUser", nameIdentifier);
      console.log("Logged in as:", nameIdentifier);

      setIsAuthenticated(true);
      message.success("Đăng nhập thành công!");
      navigate("/");
    } else {
      message.error("Đăng nhập thất bại!");
    }
  } catch (error) {
    message.error("Đăng nhập thất bại. Vui lòng thử lại!");
    console.error("Login error:", error);
  }
};


  return (
    <>
      <div className="min-h-screen bg-[#0a3d3f] flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-5 left-5 flex items-center space-x-2 text-white text-lg font-semibold">
          <img
            src="https://cdn-icons-png.flaticon.com/512/29/29302.png"
            alt="Library Logo"
            className="w-8 h-8 filter invert"
          />
          <span>Library</span>
        </div>

        <div className="bg-transparent text-white text-center max-w-md w-full space-y-6 z-10">
          <h1 className="text-3xl font-bold">Sign in</h1>
          <p className="text-sm text-gray-300">Welcome to website</p>

          <input
            type="text"
            placeholder="Login"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full px-4 py-2 rounded-md bg-[#9cd4b0] text-black placeholder-gray-700 focus:outline-none"
          />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full px-4 py-2 rounded-md bg-[#9cd4b0] text-black placeholder-gray-700 focus:outline-none"
          />

          <div className="text-left text-sm">
            <label className="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <span>Hiện mật khẩu</span>
            </label>
          </div>

          <div className="flex justify-between text-xs px-1">
            <a href="/signup" style={{ color: "white" }}>
              Sign up
            </a>
            <a href="/forgot" style={{ color: "white" }}>
              Forgot password?
            </a>
          </div>

          <button
            onClick={handleLogin}
            className="w-full py-2 bg-[#21b39b] rounded-md text-white font-semibold hover:opacity-90"
          >
            Log in
          </button>
        </div>
      </div>
      <div className="absolute bottom-0 w-screen z-0">
        <svg
          viewBox="0 0 1440 320"
          className="w-[100vw] h-[260px]"
          xmlns="http://www.w3.org/2000/svg"
        >
        </svg>
      </div>
    </>
  );
};

export default SignIn;
