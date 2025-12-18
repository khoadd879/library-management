import React, { useState, useEffect } from "react";
import { getChatUsersAPI } from "@/services/api";
import Chat from "@/components/admin/ChatPage";
import { SearchOutlined, MessageOutlined, UserOutlined } from "@ant-design/icons";

const ChatDashboard = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [chatUsers, setChatUsers] = useState<
    { receiveUserId: string; receiveUserName: string; avatarUrl: string }[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");

  const myId = localStorage.getItem("idUser");
  const selectedUser = chatUsers.find(
    (u) => u.receiveUserId === selectedUserId
  );

  useEffect(() => {
    const fetchUsers = async () => {
      if (!myId) return;
      try {
        const res = await getChatUsersAPI();
        setChatUsers(res);
      } catch (err) {
        console.error("Lỗi khi tải danh sách người dùng:", err);
      }
    };

    fetchUsers();
  }, [myId]);

  const filteredUsers = chatUsers.filter(
    (user) =>
      user.receiveUserName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.receiveUserId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - User List */}
      <div className="w-96 flex flex-col bg-white border-r border-gray-200 shadow-sm">
        {/* Sidebar Header */}
        <div className="bg-gradient-to-r from-[#153D36] to-[#1E5D4A] px-5 py-4">
          <h2 className="text-white font-semibold text-lg flex items-center gap-2">
            <MessageOutlined />
            Tin nhắn
          </h2>
          <p className="text-emerald-200 text-sm mt-1">
            {chatUsers.length} cuộc trò chuyện
          </p>
        </div>

        {/* Search Box */}
        <div className="p-3 border-b border-gray-100">
          <div className="relative">
            <SearchOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm người dùng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-full text-sm outline-none focus:bg-white focus:ring-2 focus:ring-emerald-400 transition-all duration-200"
            />
          </div>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4">
              <UserOutlined className="text-4xl mb-2" />
              <p className="text-sm">Không có cuộc trò chuyện nào</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.receiveUserId}
                onClick={() => setSelectedUserId(user.receiveUserId)}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all duration-200 border-b border-gray-50 ${
                  selectedUserId === user.receiveUserId
                    ? "bg-emerald-50 border-l-4 border-l-emerald-500"
                    : "hover:bg-gray-50 border-l-4 border-l-transparent"
                }`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.receiveUserName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-semibold text-lg">
                        {user.receiveUserName?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    )}
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></span>
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">
                    {user.receiveUserName || "Người dùng"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    ID: {user.receiveUserId}
                  </p>
                </div>

                {/* Indicator */}
                {selectedUserId === user.receiveUserId && (
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1">
        {selectedUser ? (
          <Chat
            receiverId={selectedUser.receiveUserId}
            receiveUserName={selectedUser.receiveUserName}
            avatarUrl={selectedUser.avatarUrl}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-slate-50 to-emerald-50">
            <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
              <MessageOutlined className="text-5xl text-emerald-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Tin nhắn của bạn
            </h3>
            <p className="text-gray-500 text-center max-w-sm">
              Chọn một người dùng từ danh sách bên trái để xem cuộc trò chuyện
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatDashboard;
