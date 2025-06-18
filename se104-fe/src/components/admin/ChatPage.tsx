import React, { useEffect, useState } from "react";
import { getChatHistoryAPI, sendMessageAPI } from "@/services/api";
import { message as antdMessage, message } from "antd";
interface ChatProps {
  receiverId: string;
}

const Chat = ({ receiverId }: ChatProps) => {
  const [messages, setMessages] = useState<IChatMessage[]>([]);
  const [input, setInput] = useState("");

  const senderId = localStorage.getItem("idUser") ?? "";

  useEffect(() => {
    let interval: any;

    const fetchMessages = async () => {
      try {
        const res = await getChatHistoryAPI(receiverId);
        if (Array.isArray(res)) {
          if (res.length > messages.length) {
            const lastMessage = res[res.length - 1];
            if (lastMessage.senderId !== senderId) {
              message.info(" Bạn có tin nhắn mới!");
            }
          }

          setMessages(res);
        } else {
          antdMessage.error("Không lấy được tin nhắn.");
        }
      } catch (err) {
        console.error(err);
        antdMessage.error("Lỗi khi tải tin nhắn.");
      }
    };

    fetchMessages();
    interval = setInterval(fetchMessages, 5000);

    return () => clearInterval(interval);
  }, [receiverId, senderId, messages.length]);

  const sendMessage = async () => {
    if (!input.trim()) return;

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
    }
  };

  return (
    <div className="flex flex-col justify-between h-screen bg-[#f4f7f9]">
      <div className="bg-[#153D36] px-6 py-4 flex justify-between items-center"></div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => {
          const isSender = msg.senderId === senderId;
          return (
            <div
              key={msg.id || i}
              className={`flex items-end ${
                isSender ? "justify-end" : "justify-start"
              }`}
            >
              {!isSender && (
                <img
                  src="https://i.imgur.com/1Q8ZQqX.png"
                  alt="avatar"
                  className="w-8 h-8 rounded-full mr-2"
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
                <div className="bg-white rounded-full px-4 py-2 shadow text-sm italic font-semibold">
                  {msg.content.data}
                </div>
              </div>
              {isSender && (
                <img
                  src="https://i.imgur.com/1Q8ZQqX.png"
                  alt="avatar"
                  className="w-8 h-8 rounded-full ml-2"
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center px-6 py-4 bg-green-100">
        <input
          type="text"
          placeholder="Nhập tin nhắn..."
          className="flex-1 px-4 py-2 rounded-full bg-white outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="ml-2 bg-blue-500 hover:bg-blue-600 p-2 rounded-full text-white"
          onClick={sendMessage}
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default Chat;
