import React, { useState } from "react";

const ChatUser = () => {
  const [messages, setMessages] = useState([
    {
      sender: "Thủ thư",
      text: "cơm nước gì chưa người đẹp",
      avatar: "https://i.imgur.com/1Q8ZQqX.png",
      side: "left",
    },
    {
      sender: "Tiến Khang",
      text: "cơm gà xối mỡ",
      avatar: "https://i.imgur.com/1Q8ZQqX.png",
      side: "right",
    },
    {
      sender: "Thủ thư",
      text: "cơm nước gì chưa người đẹp",
      avatar: "https://i.imgur.com/1Q8ZQqX.png",
      side: "left",
    },
    {
      sender: "Tiến Khang",
      text: "cơm gà xối mỡ",
      avatar: "https://i.imgur.com/1Q8ZQqX.png",
      side: "right",
    },
  ]);

  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim()) {
      setMessages([
        ...messages,
        {
          sender: "Tiến Khang",
          text: input,
          avatar: "https://i.imgur.com/1Q8ZQqX.png",
          side: "right",
        },
      ]);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col justify-between h-screen bg-[#f4f7f9]">
      <div className="bg-[#153D36] px-6 py-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search..."
          className="w-[400px] px-4 py-2 rounded-full outline-none text-sm text-black bg-white"
        />
        <div className="text-white text-xl">🔔</div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-end ${
              msg.side === "right" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.side === "left" && (
              <img
                src={msg.avatar}
                alt="avatar"
                className="w-8 h-8 rounded-full mr-2"
              />
            )}
            <div>
              <p
                className={`text-xs mb-1 ${
                  msg.side === "left"
                    ? "text-red-600 italic"
                    : "text-green-800 italic text-right"
                }`}
              >
                {msg.sender}
              </p>
              <div className="bg-white rounded-full px-4 py-2 shadow text-sm italic font-semibold">
                {msg.text}
              </div>
            </div>
            {msg.side === "right" && (
              <img
                src={msg.avatar}
                alt="avatar"
                className="w-8 h-8 rounded-full ml-2"
              />
            )}
          </div>
        ))}
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

export default ChatUser;
