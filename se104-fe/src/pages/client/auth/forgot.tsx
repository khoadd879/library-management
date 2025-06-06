import { useNavigate } from "react-router-dom";
import { forgotPassword } from "@/services/api";
import { message } from "antd";
import { useState } from "react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    if (!email) {
      message.warning("Vui lòng nhập email!");
      return;
    }

    try {
      const res = await forgotPassword(email);
      if (res) {
        message.success("Gửi mã OTP thành công");
        navigate("/verification", {
          state: {
            email: email,
            mode: "forgot",
          },
        });
      } else {
        message.error("Gửi mã OTP thất bại!");
      }
    } catch (error) {
      message.error("Thất bại");
      console.error("OTP error:", error);
    }
  }


  return (
    <div className="min-h-screen bg-[#0a3d3f] flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-5 left-5 flex items-center space-x-2 text-white text-lg font-semibold">
        <img
          src="https://cdn-icons-png.flaticon.com/512/29/29302.png"
          alt="Library Logo"
          className="w-8 h-8 filter invert"
        />
        <span>Library</span>
      </div>

      <div className="absolute top-5 right-5 text-white text-sm">
        <a
          href="#"
          className="flex items-center space-x-1 underline hover:opacity-80"
        >
          <span className="text-lg text-white">←</span>
          <span className=" text-white">Sign in</span>
        </a>
      </div>

      <div className="bg-transparent text-white text-center max-w-md w-full space-y-6 z-10">
        <h1 className="text-3xl font-bold">Forgot password</h1>
        <p className="text-sm text-gray-300 px-2">
          Please write your email to receive confirmation code to <br />
          set a new password
        </p>

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendOTP()}
          className="w-full px-4 py-2 rounded-md bg-[#9cd4b0] text-black placeholder-gray-700 focus:outline-none"
        />

        <button
          className="w-full py-2 bg-[#21b39b] rounded-md text-white font-semibold hover:opacity-90"
          onClick={
            handleSendOTP}
        >
          Confirm mail
        </button>
      </div>

      <div className="absolute bottom-0 w-full z-0">
        <svg
          viewBox="0 0 1440 320"
          className="w-full h-[260px]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#345c5b"
            fillOpacity="1"
            d="M0,192L60,202.7C120,213,240,235,360,224C480,213,600,171,720,154.7C840,139,960,149,1080,165.3C1200,181,1320,203,1380,213.3L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          />
          <path
            fill="#7c9b99"
            fillOpacity="1"
            d="M0,224L80,229.3C160,235,320,245,480,229.3C640,213,800,171,960,154.7C1120,139,1280,149,1360,154.7L1440,160L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
          />
          <path
            fill="#eff4f2"
            fillOpacity="1"
            d="M0,256L120,245.3C240,235,480,213,720,218.7C960,224,1200,256,1320,272L1440,288L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"
          />
        </svg>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
