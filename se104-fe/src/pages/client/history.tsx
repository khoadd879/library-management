import { useEffect, useState, useMemo } from "react";
import { getLoanSlipHistoryAPI } from "@/services/api";
import { message, Skeleton, Empty, Tag, Input, Tabs, Progress } from "antd";
import {
  CalendarOutlined,
  BookOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

interface ILoanHistory {
  idBook: string;
  nameBook: string;
  genre: string;
  dateBorrow: string;
  dateReturn: string;
  avatarUrl: string;
  isReturned: boolean;
}

const History = () => {
  const [history, setHistory] = useState<ILoanHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchHistory = async () => {
      const idUser = localStorage.getItem("idUser");
      if (!idUser) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await getLoanSlipHistoryAPI(idUser);
        if (res?.data) setHistory(res.data);
        else if (Array.isArray(res)) setHistory(res);
      } catch (err) {
        message.error("Không thể tải lịch sử mượn sách.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // Logic lọc dữ liệu
  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      const matchesSearch = item.nameBook
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "borrowing" && !item.isReturned) ||
        (activeTab === "returned" && item.isReturned);
      return matchesSearch && matchesTab;
    });
  }, [history, searchText, activeTab]);

  // Tính toán phần trăm thời gian đã trôi qua
  const getDeadlineProgress = (start: string, end: string) => {
    const startDate = dayjs(start);
    const endDate = dayjs(end);
    const today = dayjs();
    const totalDays = endDate.diff(startDate, "day");
    const elapsedDays = today.diff(startDate, "day");
    const percentage = Math.min(
      Math.max((elapsedDays / totalDays) * 100, 0),
      100,
    );
    return {
      percent: Math.round(percentage),
      status: percentage >= 90 ? "exception" : "normal",
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-slate-100 pb-20">
      {/* Header Section with gradient */}
      <div className="relative bg-gradient-to-r from-[#153D36] via-[#1A4A42] to-[#153D36] pt-12 pb-20 px-4 mb-0 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg">
                  <ReadOutlined className="!text-white text-2xl" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tight">
                    Lịch sử mượn sách
                  </h2>
                  <p className="text-emerald-200/70 mt-1 text-sm">
                    Quản lý và theo dõi thời hạn trả sách của bạn
                  </p>
                </div>
              </div>
              {/* Stats */}
              <div className="flex gap-4 mt-6">
                <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
                  <span className="text-emerald-300 font-black text-xl">
                    {history.length}
                  </span>
                  <span className="text-white/60 text-sm ml-2">Tổng số</span>
                </div>
                <div className="px-4 py-2 bg-amber-500/20 backdrop-blur-md rounded-xl border border-amber-400/20">
                  <span className="text-amber-300 font-black text-xl">
                    {history.filter((h) => !h.isReturned).length}
                  </span>
                  <span className="text-white/60 text-sm ml-2">Đang mượn</span>
                </div>
                <div className="px-4 py-2 bg-emerald-500/20 backdrop-blur-md rounded-xl border border-emerald-400/20">
                  <span className="text-emerald-300 font-black text-xl">
                    {history.filter((h) => h.isReturned).length}
                  </span>
                  <span className="text-white/60 text-sm ml-2">Đã trả</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Input
                prefix={<SearchOutlined className="text-slate-400" />}
                placeholder="Tìm tên sách..."
                className="rounded-xl h-12 sm:w-72 border-0 shadow-lg bg-white/95 backdrop-blur-md"
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section - Overlapping header */}
      <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-20 mb-8">
        <div className="bg-white rounded-2xl shadow-xl p-2 inline-flex gap-1">
          {[
            { key: "all", label: `Tất cả (${history.length})` },
            {
              key: "borrowing",
              label: `Đang mượn (${history.filter((h) => !h.isReturned).length})`,
            },
            {
              key: "returned",
              label: `Đã trả (${history.filter((h) => h.isReturned).length})`,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                activeTab === tab.key
                  ? "bg-[#153D36] text-white shadow-lg"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm"
              >
                <Skeleton
                  active
                  avatar={{ size: 80, shape: "square" }}
                  paragraph={{ rows: 3 }}
                />
              </div>
            ))}
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 shadow-xl border border-slate-100 flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
              <BookOutlined className="text-3xl text-slate-300" />
            </div>
            <Empty
              description={
                <span className="text-slate-400 text-lg">
                  Không tìm thấy dữ liệu mượn sách
                </span>
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHistory.map((item, index) => {
              const progress = getDeadlineProgress(
                item.dateBorrow,
                item.dateReturn,
              );
              const daysRemaining = dayjs(item.dateReturn).diff(dayjs(), "day");
              const isOverdue = daysRemaining < 0 && !item.isReturned;

              return (
                <div
                  key={index}
                  className={`group bg-white rounded-2xl p-5 shadow-sm border-2 transition-all duration-500 flex flex-col gap-4 hover:-translate-y-2 hover:shadow-2xl ${
                    isOverdue
                      ? "border-red-200 hover:border-red-300"
                      : item.isReturned
                        ? "border-slate-100 hover:border-emerald-200"
                        : "border-slate-100 hover:border-amber-200"
                  }`}
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <div className="flex gap-4">
                    {/* Book Cover */}
                    <div className="w-20 h-28 flex-shrink-0 rounded-xl overflow-hidden shadow-lg relative">
                      {item.avatarUrl ? (
                        <img
                          src={item.avatarUrl}
                          alt={item.nameBook}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-300">
                          <BookOutlined className="text-2xl" />
                        </div>
                      )}
                      {/* Status overlay */}
                      {!item.isReturned && (
                        <div
                          className={`absolute bottom-0 left-0 right-0 py-1 text-center text-[10px] font-black text-white ${
                            isOverdue ? "bg-red-500" : "bg-amber-500"
                          }`}
                        >
                          {isOverdue ? "QUÁ HẠN" : "ĐANG MƯỢN"}
                        </div>
                      )}
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1 min-w-0">
                      <Tag
                        color="default"
                        className="m-0 mb-2 rounded-lg bg-[#153D36]/10 border-0 text-[10px] uppercase font-black text-[#153D36] tracking-wider"
                      >
                        {item.genre}
                      </Tag>
                      <h3 className="text-base font-bold text-slate-800 line-clamp-2 leading-tight group-hover:text-[#153D36] transition-colors">
                        {item.nameBook}
                      </h3>
                      <div className="mt-3">
                        {item.isReturned ? (
                          <Tag
                            icon={<CheckCircleOutlined />}
                            className="rounded-full px-3 py-1 bg-emerald-50 text-emerald-600 border-0 m-0 font-bold shadow-sm"
                          >
                            Đã trả
                          </Tag>
                        ) : isOverdue ? (
                          <Tag
                            icon={<ClockCircleOutlined />}
                            className="rounded-full px-3 py-1 bg-red-50 text-red-600 border-0 m-0 font-bold shadow-sm animate-pulse"
                          >
                            Quá hạn {Math.abs(daysRemaining)} ngày
                          </Tag>
                        ) : (
                          <Tag
                            icon={<SyncOutlined spin />}
                            className="rounded-full px-3 py-1 bg-amber-50 text-amber-600 border-0 m-0 font-bold shadow-sm"
                          >
                            Còn {daysRemaining} ngày
                          </Tag>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Timeline & Progress */}
                  <div
                    className={`rounded-xl p-4 space-y-3 mt-auto ${
                      isOverdue
                        ? "bg-red-50"
                        : item.isReturned
                          ? "bg-emerald-50/50"
                          : "bg-slate-50"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="text-center">
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                          Ngày mượn
                        </p>
                        <p className="text-sm font-black text-slate-700 mt-1">
                          {dayjs(item.dateBorrow).format("DD/MM/YYYY")}
                        </p>
                      </div>
                      <div className="flex-1 mx-4 flex items-center">
                        <div className="flex-1 h-0.5 bg-slate-200 rounded-full relative">
                          <div
                            className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${
                              isOverdue
                                ? "bg-red-400"
                                : item.isReturned
                                  ? "bg-emerald-400"
                                  : "bg-amber-400"
                            }`}
                            style={{
                              width: item.isReturned
                                ? "100%"
                                : `${progress.percent}%`,
                            }}
                          />
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                          Hạn trả
                        </p>
                        <p
                          className={`text-sm font-black mt-1 ${
                            isOverdue
                              ? "text-red-600"
                              : item.isReturned
                                ? "text-emerald-600"
                                : "text-[#153D36]"
                          }`}
                        >
                          {dayjs(item.dateReturn).format("DD/MM/YYYY")}
                        </p>
                      </div>
                    </div>
                    {!item.isReturned && (
                      <div className="pt-2">
                        <Progress
                          percent={progress.percent}
                          size="small"
                          showInfo={false}
                          strokeColor={
                            isOverdue
                              ? "#ef4444"
                              : progress.percent >= 90
                                ? "#f59e0b"
                                : "#10b981"
                          }
                          trailColor={isOverdue ? "#fecaca" : "#e2e8f0"}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
