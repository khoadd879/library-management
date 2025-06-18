import React, { useState, useEffect } from "react";
import { getChatUsersAPI } from "@/services/api";
import Chat from "@/components/admin/ChatPage";

const ChatDashboard = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [chatUsers, setChatUsers] = useState<
    { receiveUserId: string; receiveUserName: string; avatarUrl: string }[]
  >([]);

  const myId = localStorage.getItem("idUser");
  const selectedUser = chatUsers.find(
    (u) => u.receiveUserId === selectedUserId
  );
  useEffect(() => {
    const fetchUsers = async () => {
      if (!myId) return;
      try {
        const res = await getChatUsersAPI();
        console.log(res);
        setChatUsers(res);
      } catch (err) {
        console.error("Lỗi khi tải danh sách người dùng:", err);
      }
    };

    fetchUsers();
  }, [myId]);

  return (
    <div className="flex h-screen">
      <div className="w-1/3 border-r overflow-y-auto bg-gray-100">
        <h2 className="p-4 text-xl font-bold bg-[#153D36] text-white">
          Người đã nhắn cho bạn
        </h2>
        {chatUsers.map((user) => (
          <div
            key={user.receiveUserId}
            onClick={() => setSelectedUserId(user.receiveUserId)}
            className={`p-4 cursor-pointer hover:bg-green-200 ${
              selectedUserId === user.receiveUserId ? "bg-green-300" : ""
            }`}
          >
            <p className="font-semibold">{user.receiveUserName}</p>
            <p className="text-sm text-gray-600 italic">
              ID: {user.receiveUserId}
            </p>
          </div>
        ))}
      </div>

      <div className="flex-1">
        {selectedUser ? (
          <Chat
            receiverId={selectedUser.receiveUserId}
            receiveUserName={selectedUser.receiveUserName}
            avatarUrl={selectedUser.avatarUrl}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Chọn một người để xem cuộc trò chuyện
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatDashboard;
