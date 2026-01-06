import { useState, useEffect, useRef } from "react";
import {
  FaRobot,
  FaPaperPlane,
  FaTrash,
  FaTimes,
  FaCommentDots,
} from "react-icons/fa";
import { useCurrentApp } from "@/components/context/app.context";
import {
  createAIMessageAPI,
  getAIHistoryAPI,
  deleteAIHistoryAPI,
} from "@/services/api";
import { Button, Tooltip, Spin, message as antMessage } from "antd";

interface IMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: Date;
}

const AIChatWidget = () => {
  const { user } = useCurrentApp();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Fetch history when chat opens
  useEffect(() => {
    if (isOpen && user?.data?.idReader) {
      fetchHistory();
    }
  }, [isOpen, user]);

  const fetchHistory = async () => {
    if (!user?.data?.idReader) return;
    setIsHistoryLoading(true);
    try {
      const res = await getAIHistoryAPI(user.data.idReader);
      // Giả sử API trả về mảng các cặp câu hỏi/trả lời hoặc danh sách tin nhắn
      // Cần map dữ liệu trả về theo format của UI.
      // Dưới đây là logic xử lý dữ liệu giả định (bạn có thể điều chỉnh theo response thực tế)

      const formattedMessages: IMessage[] = [];
      const historyData = res.data || res; // Tùy vào format axios response

      if (Array.isArray(historyData)) {
        historyData.forEach((item: any, index: number) => {
          // Nếu API trả về cặp { request: "...", response: "..." }
          if (item.request) {
            formattedMessages.push({
              id: `hist-req-${index}`,
              sender: "user",
              text: item.request,
              timestamp: new Date(),
            });
          }
          if (item.response) {
            formattedMessages.push({
              id: `hist-res-${index}`,
              sender: "ai",
              text: item.response,
              timestamp: new Date(),
            });
          }
          // Hoặc nếu API trả về danh sách phẳng thì map trực tiếp
        });
      }
      setMessages(formattedMessages);
    } catch (error) {
      console.error("Failed to load chat history", error);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || !user?.data?.idReader) return;

    const userMsgText = input;
    const newMessage: IMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: userMsgText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await createAIMessageAPI(user.data.idReader, userMsgText);
      // Giả sử API trả về text câu trả lời trong res.data hoặc res.data.message
      const aiResponseText =
        typeof res.data === "string"
          ? res.data
          : res.data?.message || "Không có phản hồi từ AI";

      const aiMessage: IMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: aiResponseText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message", error);
      const errorMessage: IMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: "Xin lỗi, hệ thống đang bận. Vui lòng thử lại sau.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleDeleteHistory = async () => {
    if (!user?.data?.idReader) return;
    try {
      await deleteAIHistoryAPI(user.data.idReader);
      setMessages([]);
      antMessage.success("Đã xóa lịch sử trò chuyện");
    } catch (error) {
      antMessage.error("Không thể xóa lịch sử");
    }
  };

  // Nếu chưa đăng nhập thì không hiện chat
  if (!user) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {/* Chat Window */}
      <div
        className={`bg-white rounded-2xl shadow-2xl w-80 sm:w-96 transition-all duration-300 origin-bottom-right overflow-hidden flex flex-col border border-gray-200 ${
          isOpen
            ? "opacity-100 scale-100 mb-4 h-[500px]"
            : "opacity-0 scale-0 h-0 mb-0"
        }`}
      >
        {/* Header */}
        <div className="bg-[#153D36] p-4 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-2 rounded-full">
              <FaRobot className="text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Trợ lý ảo thư viện</h3>
              <p className="text-xs text-emerald-200/80">
                Luôn sẵn sàng hỗ trợ bạn
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Tooltip title="Xóa lịch sử">
              <button
                onClick={handleDeleteHistory}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-emerald-200 hover:text-red-300"
              >
                <FaTrash size={14} />
              </button>
            </Tooltip>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 bg-gray-50 p-4 overflow-y-auto custom-scrollbar flex flex-col gap-3">
          {isHistoryLoading ? (
            <div className="flex justify-center items-center h-full">
              <Spin size="small" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-400 mt-10">
              <FaRobot className="mx-auto text-4xl mb-2 opacity-20" />
              <p className="text-sm">
                Xin chào! Tôi có thể giúp gì cho bạn về sách và thư viện?
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    msg.sender === "user"
                      ? "bg-[#153D36] text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-500 border border-gray-200 p-3 rounded-2xl rounded-bl-none shadow-sm text-xs flex items-center gap-2">
                <Spin size="small" /> AI đang trả lời...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-white border-t border-gray-100 shrink-0">
          <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 border border-gray-200 focus-within:border-[#153D36] focus-within:bg-white transition-all">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập tin nhắn..."
              disabled={isLoading}
              className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading}
              className={`p-2 rounded-full transition-all ${
                input.trim() && !isLoading
                  ? "text-[#153D36] hover:bg-emerald-50"
                  : "text-gray-400 cursor-not-allowed"
              }`}
            >
              <FaPaperPlane />
            </button>
          </div>
          <div className="text-[10px] text-center text-gray-400 mt-1">
            AI có thể đưa ra thông tin không chính xác.
          </div>
        </div>
      </div>

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative flex items-center justify-center w-14 h-14 rounded-full shadow-lg shadow-[#153D36]/30 transition-all duration-300 hover:scale-110 ${
          isOpen
            ? "bg-gray-200 text-gray-600 rotate-90"
            : "bg-[#153D36] text-white"
        }`}
      >
        {isOpen ? <FaTimes size={20} /> : <FaCommentDots size={24} />}

        {!isOpen && (
          <span className="absolute right-0 top-0 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        )}
      </button>
    </div>
  );
};

export default AIChatWidget;
