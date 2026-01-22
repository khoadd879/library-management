import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  signUpWithOtpAPI,
  verifyOTP,
  signUpSendOtpAPI,
  forgotPassword,
} from "@/services/api";
import { message } from "antd";
import { ReadOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
const VerificationCodePage = () => {
  const [timer, setTimer] = useState(30);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const mode = location.state?.mode || "signup";
  const email = location.state?.email || "";
  const password = location.state?.password || "";
  const confirmPassword = location.state?.confirmPassword || "";

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer]);

  const handleResendOTP = async () => {
    try {
      let res;
      if (mode === "signup") {
        res = await signUpSendOtpAPI(email, password, confirmPassword);
      } else if (mode === "forgot") {
        res = await forgotPassword(email);
      }

      // Check if response is successful
      if (res?.statusCode === 200 && res?.success === true) {
        message.success("Mã OTP đã được gửi lại!");
        setTimer(30); // Reset timer
        setOtp(["", "", "", "", "", ""]); // Clear OTP input
      } else {
        const errorMessage = res?.message || "Gửi lại OTP thất bại!";
        message.error(errorMessage);
        console.error("Resend OTP response error:", res);
        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      const errorMsg =
        error?.message || "Lỗi khi gửi lại OTP. Vui lòng thử lại!";
      message.error(errorMsg);
      throw error;
    }
  };

  const handleConfirmCode = async () => {
    const enteredOtp = otp.join("").trim();
    if (enteredOtp.length !== 6) {
      message.warning("Vui lòng nhập đầy đủ mã xác minh (6 chữ số)");
      return;
    }

    try {
      let res;
      if (mode === "signup") {
        res = await signUpWithOtpAPI(email, enteredOtp);
      } else if (mode === "forgot") {
        res = await verifyOTP(email, enteredOtp);
      }

      // Check if response is successful
      if (res?.statusCode === 200 && res?.success === true) {
        message.success("Xác minh thành công!");

        if (mode === "signup") {
          navigate("/signin");
        } else if (mode === "forgot") {
          navigate("/new-pass", { state: { email } });
        }
      } else {
        const errorMessage = res?.message || "Mã xác minh không đúng!";
        message.error(errorMessage);
        console.error("Verify OTP response error:", res);
        throw new Error(errorMessage);
      }
    } catch (err: any) {
      console.error("Verify error:", err);
      const errorMsg = err?.message || "Lỗi xác minh. Vui lòng thử lại!";
      message.error(errorMsg);
      throw err;
    }
  };

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a3d3f] flex items-center justify-center relative overflow-hidden p-4">
      <div
        className="absolute top-5 left-5 flex items-center gap-3 cursor-pointer group z-20"
        onClick={() => navigate("/")}
      >
        <motion.div
          whileHover={{ rotate: 15, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="w-10 h-10 bg-gradient-to-br from-[#153D36] to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-black/20"
        >
          <ReadOutlined className="!text-white text-lg" />
        </motion.div>
        <span className="font-extrabold text-2xl text-white tracking-tight group-hover:text-emerald-200 transition-colors">
          LibManager<span className="text-emerald-400">.</span>
        </span>
      </div>

      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 sm:p-8 w-full max-w-md mx-auto z-10 shadow-xl transition-all duration-300 transform hover:scale-[1.01]">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Verification Code
          </h1>
          <p className="text-base sm:text-lg text-gray-200">
            Mã xác minh đã gửi đến:{" "}
            <span className="text-[#a5f3fc]">{email}</span>
          </p>
        </div>

        <div className="flex justify-center gap-3 mb-6">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              ref={(el: HTMLInputElement | null) => {
                inputsRef.current[idx] = el;
              }}
              className="w-12 h-12 text-center text-xl rounded-lg bg-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#21b39b] transition-all"
            />
          ))}
        </div>

        <button
          onKeyDown={(e) => e.key === "Enter" && handleConfirmCode()}
          onClick={handleConfirmCode}
          className="w-full py-3 bg-[#21b39b] rounded-lg text-white font-semibold hover:bg-[#1a9c86] transition-colors shadow-lg text-sm sm:text-base"
        >
          Confirm Code
        </button>

        <div className="text-center mt-4">
          {timer > 0 ? (
            <p className="text-sm text-white/80">
              <span className="font-bold">
                0:{timer < 10 ? `0${timer}` : timer}
              </span>{" "}
              Resend confirmation code
            </p>
          ) : (
            <button
              className="text-sm text-[#a5f3fc] hover:underline transition-colors"
              onClick={handleResendOTP}
            >
              Gửi lại mã xác minh
            </button>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-0 h-[180px] sm:h-[260px]">
        <svg
          viewBox="0 0 1917 253"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            fill="#345c5b"
            fillOpacity="1"
            d="M 758.802 100.0837 C 448 120.246 279.336 115.5669 0 100.0837 V 130.063 C 307.343 150.749 542.161 151.062 783.891 140.983 C 889.408 135.964 996.242 128.632 1111 120.063 C 1488.66 95.9929 1594.95 80.9355 1917 120.063 V 100.0837 C 1660 30.356 1334.76 60.51373 758.802 100.0837 Z"
          />
          <path
            fill="#eff4f2"
            fillOpacity="1"
            d="M 0 261 H 1917 V 238.829 V 160.266 C 1581.64 120.2362 1373.88 118.0273 947.5 160.266 C 924.233 162.458 901.598 164.479 879.509 166.308 C 558.784 205.911 353.178 215.238 0 160.266 L 0 261 Z"
          />
          <path
            fill="#7c9b99"
            fillOpacity="1"
            d="M 1917 120.063 C 1594.95 80.9355 1488.66 95.9929 1111 120.063 C 996.242 128.632 889.408 135.964 783.891 140.983 C 542.161 151.062 307.343 150.749 0 130.063 L 0 160.266 C 353.178 215.238 558.784 205.911 879.509 166.308 C 901.598 164.479 924.233 162.458 947.5 160.266 C 1373.88 118.0273 1581.64 120.2362 1917 160.266 V 120.063 Z"
          />
        </svg>
      </div>
    </div>
  );
};

export default VerificationCodePage;
