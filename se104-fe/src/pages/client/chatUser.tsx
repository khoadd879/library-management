import React, { useEffect, useState, useRef } from "react";
import { getChatHistoryAPI, sendMessageAPI } from "@/services/api";
import { message as antdMessage } from "antd";
import { useCurrentApp } from "@/components/context/app.context";
import { SendOutlined, UserOutlined, CustomerServiceOutlined } from "@ant-design/icons";

const Chat = () => {
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [inputError, setInputError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { user } = useCurrentApp();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const receiverId = "rd00002";
  const senderId = localStorage.getItem("idUser") ?? "";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    let interval: any;

    const fetchMessages = async () => {
      try {
        const res = await getChatHistoryAPI(senderId);
        if (Array.isArray(res)) {
          setMessages(res);
          console.log(res)
        } else {
          antdMessage.error("Không lấy được tin nhắn.");
        }
      } catch (err) {
        console.error(err);
        antdMessage.error("Lỗi khi tải tin nhắn.");
      }
    };

    fetchMessages();
    interval = setInterval(fetchMessages, 3000);

    return () => clearInterval(interval);
  }, [receiverId, senderId]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Hôm nay";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Hôm qua";
    }
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const sendMessage = async () => {
    if (!input.trim()) {
      setInputError("Chưa có nội dung để gửi");
      return;
    }
    setInputError("");
    setIsSending(true);

    const payload = {
      receiverId,
      content: {
        type: "text" as "text",
        data: input.trim(),
      },
    };

    try {
      await sendMessageAPI(payload);
      const newMessage: IChatMessage = {
        senderId,
        receiverId,
        content: payload.content as IChatContent,
        sentAt: new Date().toISOString(),
        id: Date.now().toString(),
      };
      setMessages((prev) => [...prev, newMessage]);
      setInput("");
    } catch (err) {
      console.error(err);
      antdMessage.error("Không gửi được tin nhắn.");
    } finally {
      setIsSending(false);
    }
  };

  // Group messages by date
  const groupedMessages: { [key: string]: IChatMessage[] } = {};
  messages.forEach((msg) => {
    const dateKey = new Date(msg.sentAt).toDateString();
    if (!groupedMessages[dateKey]) {
      groupedMessages[dateKey] = [];
    }
    groupedMessages[dateKey].push(msg);
  });

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#153D36] to-[#1E5D4A] px-6 py-4 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-2 border-white/30">
              <img
                src="https://thumbs.dreamstime.com/b/man-people-admin-avatar-icon-272321203.jpg"
                alt="Librarian"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
          </div>
          <div className="flex-1">
            <h2 className="text-white font-semibold text-lg flex items-center gap-2">
              <CustomerServiceOutlined />
              Thủ thư Hỗ trợ
            </h2>
            <p className="text-emerald-200 text-sm">Trực tuyến • Thường trả lời trong vài phút</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
              <CustomerServiceOutlined className="text-4xl text-emerald-500" />
            </div>
            <p className="text-lg font-medium text-gray-500">Bắt đầu cuộc trò chuyện</p>
            <p className="text-sm text-gray-400 mt-1">Gửi tin nhắn để được hỗ trợ từ thủ thư</p>
          </div>
        ) : (
          <div className="space-y-6 max-w-3xl mx-auto">
            {Object.entries(groupedMessages).map(([dateKey, msgs]) => (
              <div key={dateKey}>
                {/* Date Separator */}
                <div className="flex items-center justify-center mb-4">
                  <span className="px-4 py-1 bg-white/80 backdrop-blur-sm rounded-full text-xs text-gray-500 shadow-sm">
                    {formatDate(msgs[0].sentAt)}
                  </span>
                </div>

                {/* Messages for this date */}
                <div className="space-y-3">
                  {msgs.map((msg, i) => {
                    const isSender = msg.senderId === senderId;
                    return (
                      <div
                        key={msg.id || i}
                        className={`flex items-end gap-2 animate-fadeIn ${
                          isSender ? "justify-end" : "justify-start"
                        }`}
                        style={{
                          animation: "fadeIn 0.3s ease-out",
                        }}
                      >
                        {/* Librarian Avatar */}
                        {!isSender && (
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-emerald-200">
                              <img
                                src="https://thumbs.dreamstime.com/b/man-people-admin-avatar-icon-272321203.jpg"
                                alt="Thủ thư"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        )}

                        {/* Message Bubble */}
                        <div className={`max-w-[70%] ${isSender ? "order-1" : ""}`}>
                          <div
                            className={`group relative px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                              isSender
                                ? "bg-gradient-to-br from-[#153D36] to-[#1E5D4A] text-white rounded-br-sm"
                                : "bg-white text-gray-800 rounded-bl-sm border border-gray-100"
                            }`}
                          >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                              {msg.content.data}
                            </p>
                          </div>
                          <p
                            className={`text-[10px] mt-1 text-gray-400 ${
                              isSender ? "text-right mr-1" : "ml-1"
                            }`}
                          >
                            {formatTime(msg.sentAt)}
                          </p>
                        </div>

                        {/* User Avatar */}
                        {isSender && (
                          <div className="flex-shrink-0 order-2">
                            <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-emerald-300 bg-emerald-100 flex items-center justify-center">
                              {user?.data?.avatarUrl ? (
                                <img
                                  src={user.data.avatarUrl}
                                  alt="Bạn"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <UserOutlined className="text-emerald-600" />
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white/80 backdrop-blur-sm px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Nhập tin nhắn của bạn..."
                className={`w-full px-5 py-3 pr-12 rounded-full bg-gray-100 border-2 transition-all duration-200 outline-none text-sm ${
                  inputError
                    ? "border-red-300 focus:border-red-400"
                    : "border-transparent focus:border-emerald-400 focus:bg-white"
                }`}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  if (inputError) setInputError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              />
            </div>
            <button
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                input.trim()
                  ? "bg-gradient-to-r from-[#153D36] to-[#1E5D4A] text-white shadow-lg hover:shadow-xl hover:scale-105"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              } ${isSending ? "animate-pulse" : ""}`}
              onClick={sendMessage}
              disabled={isSending || !input.trim()}
            >
              <SendOutlined className="text-lg" style={{ transform: "rotate(-45deg)" }} />
            </button>
          </div>
          {inputError && (
            <p className="text-red-500 text-xs mt-2 ml-4 animate-shake">
              ⚠️ {inputError}
            </p>
          )}
          <p className="text-center text-xs text-gray-400 mt-3">
            Nhấn Enter để gửi tin nhắn
          </p>
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Chat;
