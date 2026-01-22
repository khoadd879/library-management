import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Collapse, Badge } from "antd";
import { motion, Variants } from "framer-motion";
import {
  ReadOutlined,
  MessageOutlined,
  HistoryOutlined,
  ArrowRightOutlined,
  CheckCircleFilled,
  UsergroupAddOutlined,
  ThunderboltFilled,
  SmileFilled,
  CaretRightOutlined,
  DashboardOutlined,
  BookOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";

const { Panel } = Collapse;

// --- VARIANTS ---
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const pageTransition: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.3 } },
};

// --- CẤU HÌNH MENU ---
// Định nghĩa rõ label và id tương ứng của section
const NAV_ITEMS = [
  { label: "Tính năng", id: "tinh-nang" },
  { label: "Quy trình", id: "quy-trinh" },
  { label: "Hỗ trợ", id: "ho-tro" },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- HÀM XỬ LÝ SCROLL ---
  const handleScrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Tính toán vị trí offset để tránh bị Header che mất (khoảng 100px)
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const faqs = [
    {
      key: "1",
      question: "Làm thế nào để tôi bắt đầu mượn sách?",
      answer:
        "Bạn chỉ cần đăng ký tài khoản, tìm cuốn sách mình muốn trên hệ thống và nhấn nút đặt mượn. Sau đó đến thư viện nhận sách.",
    },
    {
      key: "2",
      question: "Tôi có thể gia hạn sách online không?",
      answer:
        "Có. Hệ thống cho phép bạn gia hạn trực tuyến nếu sách đó chưa có người khác đặt trước.",
    },
    {
      key: "3",
      question: "Nếu gặp vấn đề tôi liên hệ ai?",
      answer:
        'Bạn có thể sử dụng tính năng "Chat với Thủ thư" được tích hợp ngay trong trang quản lý cá nhân.',
    },
  ];

  return (
    <motion.div
      className="min-h-screen bg-[#F8FAFC] font-sans text-gray-800 overflow-x-hidden relative selection:bg-emerald-200 selection:text-emerald-900"
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* --- BACKGROUND DECORATION --- */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, 20, 0], y: [0, -20, 0] }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], x: [0, -20, 0], y: [0, 20, 0] }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1,
          }}
          className="absolute top-0 right-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
      </div>

      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] h-20"
            : "bg-transparent h-24"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* LOGO AREA */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="w-11 h-11 bg-gradient-to-br from-[#153D36] to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-900/10"
            >
              <ReadOutlined className="!text-white text-xl" />
            </motion.div>
            <span className="font-extrabold text-2xl text-[#153D36] tracking-tight group-hover:text-emerald-800 transition-colors">
              LibManager<span className="text-emerald-500">.</span>
            </span>
          </div>

          {/* NAVIGATION & BUTTONS */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Menu Desktop - ĐÃ CẬP NHẬT */}
            <nav className="hidden md:flex gap-8 mr-6 font-semibold text-gray-500 text-sm tracking-wide">
              {NAV_ITEMS.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleScrollToSection(item.id)}
                  className="hover:text-[#153D36] relative group transition-colors bg-transparent border-none cursor-pointer"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all group-hover:w-full rounded-full"></span>
                </button>
              ))}
            </nav>

            {/* Nút Đăng ký */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button
                className="bg-gradient-to-r hover:cursor-pointer text-white from-[#153D36] to-emerald-600 hover:to-emerald-500 border-none shadow-xl shadow-emerald-900/20 font-bold rounded-full px-8 h-12 text-base flex items-center gap-2 group"
                onClick={() => navigate("/signin")}
              >
                Đăng nhập
                <ArrowRightOutlined className="text-xs group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-emerald-100 shadow-sm text-sm font-bold text-emerald-800"
              >
                <Badge status="processing" color="#10b981" />
                <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Hệ thống quản lý thư viện thông minh
                </span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-5xl lg:text-7xl font-black text-gray-900 leading-[1.1] tracking-tight"
              >
                Khám phá tri thức <br />
                <span className="relative inline-block">
                  <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-[#153D36] via-emerald-600 to-teal-500">
                    Theo cách của bạn
                  </span>
                  <motion.svg
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    className="absolute w-full h-3 -bottom-1 left-0 text-emerald-300 -z-10"
                    viewBox="0 0 200 9"
                    fill="none"
                  >
                    <path
                      d="M2.00025 6.99997C25.3533 3.86906 142.062 -2.17417 197.973 2.11217"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </motion.svg>
                </span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-xl text-gray-500 font-medium leading-relaxed max-w-lg"
              >
                Đơn giản hóa việc tìm kiếm và mượn sách. Kết nối trực tiếp với
                kho tàng tài liệu phong phú chỉ với vài thao tác.
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow:
                      "0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/signin")}
                  className="px-8 py-4 bg-[#153D36] text-white rounded-2xl font-bold text-lg shadow-xl shadow-emerald-900/30 transition-all flex items-center justify-center gap-3"
                >
                  Bắt đầu ngay <ArrowRightOutlined />
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Right Visual */}
            <div className="relative h-[550px] hidden lg:block perspective-1000">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-emerald-100 to-transparent rounded-full blur-3xl opacity-50"></div>
              <motion.div
                animate={{ y: [-10, 10], rotate: [1, -1] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
                className="absolute top-10 right-10 w-80 bg-white/70 backdrop-blur-xl border border-white/50 p-6 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] z-20"
              >
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <DashboardOutlined className="text-emerald-600" />
                    </div>
                    <h4 className="font-bold text-gray-800">Tổng quan</h4>
                  </div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                </div>
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-white/60 border border-white/50 shadow-sm">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs font-bold text-gray-400 uppercase">
                        Trạng thái
                      </span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        Hoạt động
                      </span>
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "70%" }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                        className="h-full bg-emerald-500 rounded-full"
                      ></motion.div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="flex-1 p-3 rounded-2xl bg-blue-50/50 border border-blue-100"
                    >
                      <BookOutlined className="text-blue-500 mb-2" />
                      <div className="h-2 w-12 bg-blue-200 rounded mb-1"></div>
                    </motion.div>
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="flex-1 p-3 rounded-2xl bg-purple-50/50 border border-purple-100"
                    >
                      <HistoryOutlined className="text-purple-500 mb-2" />
                      <div className="h-2 w-12 bg-purple-200 rounded mb-1"></div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* --- STATS BAR --- */}
      <section className="bg-[#153D36] py-12 relative overflow-hidden">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10"
        >
          {[
            { title: "Kho sách", desc: "Đa dạng thể loại" },
            { title: "Truy cập", desc: "Mọi lúc mọi nơi" },
            { title: "Hỗ trợ", desc: "Nhanh chóng 24/7" },
            { title: "Chi phí", desc: "Hoàn toàn miễn phí" },
          ].map((stat, idx) => (
            <motion.div variants={fadeInUp} key={idx} className="space-y-1">
              <h3 className="text-2xl lg:text-3xl font-black text-white">
                {stat.title}
              </h3>
              <p className="text-emerald-200 font-medium text-sm lg:text-base">
                {stat.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* --- FEATURES GRID (ID: tinh-nang) --- */}
      <section id="tinh-nang" className="py-24 bg-[#F8FAFC] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-black text-[#153D36]">
              Tiện ích nổi bật
            </h2>
            <p className="text-gray-500 mt-2">
              Công cụ hỗ trợ tối đa cho việc đọc của bạn
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                icon: MessageOutlined,
                color: "blue",
                title: "Hỗ trợ trực tuyến",
                desc: "Giải đáp thắc mắc và hỗ trợ tìm sách thông qua kênh chat tích hợp.",
              },
              {
                icon: ReadOutlined,
                color: "emerald",
                title: "Quản lý thông minh",
                desc: "Dễ dàng theo dõi sách đang mượn và thời hạn trả để tránh bị phạt.",
              },
              {
                icon: HistoryOutlined,
                color: "purple",
                title: "Lưu lịch sử đọc",
                desc: "Hệ thống tự động ghi nhớ những cuốn sách bạn đã từng mượn.",
              },
              {
                icon: SafetyCertificateOutlined,
                color: "rose",
                title: "Tài khoản an toàn",
                desc: "Bảo mật thông tin cá nhân và lịch sử hoạt động của bạn.",
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className="h-full"
              >
                <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-shadow h-full border border-gray-50">
                  <div
                    className={`w-16 h-16 bg-${feature.color}-100 rounded-2xl flex items-center justify-center mb-6`}
                  >
                    <feature.icon
                      className={`text-2xl text-${feature.color}-600`}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed text-sm">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- HOW IT WORKS (ID: quy-trinh) --- */}
      <section id="quy-trinh" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-black text-[#153D36]">
              Quy trình mượn sách
            </h2>
            <p className="text-gray-500 mt-4">Đơn giản hóa trong 3 bước</p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-12 relative"
          >
            {/* Connector Line */}
            <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-gray-100 -z-10"></div>

            {[
              {
                step: "01",
                title: "Đăng ký & Tìm kiếm",
                desc: "Tạo tài khoản và tra cứu cuốn sách bạn cần trên hệ thống.",
                icon: UsergroupAddOutlined,
              },
              {
                step: "02",
                title: "Chọn sách",
                desc: "Tìm những quyển sách yêu thích của bạn trực tuyến.",
                icon: ThunderboltFilled,
              },
              {
                step: "03",
                title: "Nhận sách",
                desc: "Đến thư viện nhận sách và bắt đầu hành trình đọc.",
                icon: CheckCircleFilled,
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="relative bg-white pt-4 text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-24 h-24 mx-auto bg-white border-4 border-emerald-50 rounded-full flex items-center justify-center mb-6 shadow-lg cursor-pointer"
                >
                  <item.icon className="text-3xl text-[#153D36]" />
                </motion.div>
                <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 text-6xl font-black text-gray-100 -z-10 select-none">
                  {item.step}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm px-6">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- FAQ SECTION (ID: ho-tro) --- */}
      <section id="ho-tro" className="py-20 bg-[#F8FAFC]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto px-4"
        >
          <h2 className="text-center text-3xl font-black text-[#153D36] mb-12">
            Câu hỏi thường gặp
          </h2>
          <Collapse
            accordion
            ghost
            expandIcon={({ isActive }) => (
              <CaretRightOutlined rotate={isActive ? 90 : 0} />
            )}
            className="site-collapse-custom-collapse"
          >
            {faqs.map((faq) => (
              <Panel
                header={
                  <span className="font-bold text-lg text-gray-700 py-2 block">
                    {faq.question}
                  </span>
                }
                key={faq.key}
                className="mb-4 border-b border-gray-200 pb-2"
              >
                <p className="text-gray-500 pl-6">{faq.answer}</p>
              </Panel>
            ))}
          </Collapse>
        </motion.div>
      </section>

      {/* --- NEW UNIFIED FOOTER & CTA SECTION --- */}
      <section className="relative pt-32 pb-12 bg-[#153D36] overflow-hidden">
        {/* Decorative Wave Top - Màu trắng trùng nền trước để tạo hiệu ứng cắt */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
          <svg
            className="relative block w-full h-16 sm:h-24"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              className="fill-[#F8FAFC]"
            ></path>
          </svg>
        </div>

        {/* Background Blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[80px]"></div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center relative z-10 px-4"
        >
          <motion.h2
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight"
          >
            Đồng hành cùng tri thức Việt
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="text-emerald-100 text-lg mb-10 max-w-2xl mx-auto"
          >
            Tham gia cộng đồng bạn đọc ngay hôm nay. Hoàn toàn miễn phí.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex justify-center mb-20">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/signup")}
              className="px-12 py-5 bg-white text-[#153D36] rounded-full font-black text-xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:shadow-white/20 transition-all"
            >
              Tạo tài khoản ngay
            </motion.button>
          </motion.div>

          {/* --- INTEGRATED FOOTER CONTENT --- */}
          <motion.div
            variants={fadeInUp}
            className="border-t border-emerald-800/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-emerald-200/60 text-sm"
          >
            <div className="flex items-center gap-2">
              <span className="font-semibold text-emerald-100">LibManager</span>
              <span>© 2024. All rights reserved.</span>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </motion.div>
  );
};

export default LandingPage;
