import { useEffect, useRef } from "react";
import { getChatHistoryAPI, getChatUsersAPI } from "@/services/api";
import { message } from "antd";

const GlobalMessageListener = () => {
  const receiverId = localStorage.getItem("idUser") ?? "";

  const lastTotalMessages = useRef<Record<string, number>>(
    JSON.parse(localStorage.getItem("lastMsgCount_" + receiverId) || "{}")
  );

  useEffect(() => {
    const checkNewMessages = async () => {
      try {
        const users = await getChatUsersAPI();

        for (const user of users) {
          const senderId = user.receiveUserId;
          const res = await getChatHistoryAPI(senderId);

          if (Array.isArray(res)) {
            const count = res.length;
            const prevCount = lastTotalMessages.current[senderId] ?? 0;

            if (count > prevCount) {
              const lastMsg = res[res.length - 1];
              if (lastMsg.senderId === senderId) {
                message.info(
                  `${user.receiveUserName || "Thủ thư"} vừa nhắn tin cho bạn`
                );
              }

              lastTotalMessages.current[senderId] = count;

              localStorage.setItem(
                "lastMsgCount_" + receiverId,
                JSON.stringify(lastTotalMessages.current)
              );
            }
          }
        }
      } catch (err) {
        console.error("Lỗi kiểm tra tin nhắn đến thủ thư:", err);
      }
    };

    checkNewMessages();
    const interval = setInterval(checkNewMessages, 5000);

    return () => clearInterval(interval);
  }, [receiverId]);

  return null;
};

export default GlobalMessageListener;
