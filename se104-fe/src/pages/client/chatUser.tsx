import React, { useEffect, useState } from "react";
import { getChatHistoryAPI, sendMessageAPI } from "@/services/api";
import { message as antdMessage, Spin } from "antd";

const ChatUser = () => {
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const receiverId = "rd00025"; // thủ thư
  const senderId = localStorage.getItem("idReader") ?? "";

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await getChatHistoryAPI(receiverId);
        if (Array.isArray(res)) {
          setMessages(res);
        } else {
          antdMessage.error("Không lấy được tin nhắn.");
        }
      } catch (err) {
        console.error(err);
        antdMessage.error("Lỗi khi tải tin nhắn.");
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [senderId]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setSending(true);
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
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col justify-between h-screen bg-gradient-to-br from-[#f4f7f9] to-[#e0f7fa] animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#153D36] to-[#1A4E46] px-6 py-4 flex items-center shadow-lg">
        <div className="text-white text-xl font-bold tracking-wide">
          Chat với Thủ thư
        </div>
      </div>
      {/* Loading */}
      {loading ? (
        <div className="flex-1 flex justify-center items-center animate-fade-in">
          <Spin size="large" className="scale-150" />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-transparent">
          {messages.map((msg, i) => {
            const isSender = msg.senderId === senderId;
            return (
              <div
                key={msg.id || i}
                className={`flex items-end ${
                  isSender ? "justify-end" : "justify-start"
                } animate-fade-in-up`}
              >
                {!isSender && (
                  <img
                    src="https://i.imgur.com/1Q8ZQqX.png"
                    alt="avatar"
                    className="w-8 h-8 rounded-full mr-2 shadow"
                  />
                )}
                <div>
                  <p
                    className={`text-xs mb-1 ${
                      isSender
                        ? "text-green-800 italic text-right"
                        : "text-red-600 italic"
                    }`}
                  >
                    {isSender ? "Bạn" : "Thủ thư"}
                  </p>
                  <div
                    className={`rounded-2xl px-4 py-2 shadow text-sm font-medium bg-white/90 ${
                      isSender ? "text-[#153D36]" : "text-[#1A4E46]"
                    } animate-fade-in-up`}
                  >
                    {msg.content.data}
                  </div>
                </div>
                {isSender && (
                  <img
                    src="https://i.imgur.com/1Q8ZQqX.png"
                    alt="avatar"
                    className="w-8 h-8 rounded-full ml-2 shadow"
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
      {/* Input */}
      <div className="flex items-center px-6 py-4 bg-white/80 shadow-lg">
        <input
          type="text"
          placeholder="Nhập tin nhắn..."
          className="flex-1 px-4 py-2 rounded-full bg-gray-100 outline-none border border-gray-200 focus:ring-2 focus:ring-[#1A4E46] text-gray-800"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={sending}
        />
        <button
          className="ml-2 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 p-2 rounded-full text-white shadow-lg transition-all duration-200 text-xl disabled:opacity-60"
          onClick={sendMessage}
          disabled={sending}
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default ChatUser;
// Tailwind CSS animation utilities
// .animate-fade-in { animation: fadeIn 0.7s; }
// .animate-fade-in-up { animation: fadeInUp 0.7s; }
// @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
// @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px);} to { opacity: 1; transform: none; } }
