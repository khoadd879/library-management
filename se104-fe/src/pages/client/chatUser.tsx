import React, { useEffect, useState, useRef } from 'react';
import { getChatHistoryAPI, sendMessageAPI } from '@/services/api';
import { message as antdMessage } from 'antd';
import { useCurrentApp } from '@/components/context/app.context';
import {
    SendOutlined,
    UserOutlined,
    CustomerServiceOutlined,
} from '@ant-design/icons';
import * as signalR from '@microsoft/signalr';

const Chat = () => {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(
        null
    );
    const [messages, setMessages] = useState<IChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [inputError, setInputError] = useState('');
    const [isSending, setIsSending] = useState(false);
    const { user } = useCurrentApp();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const senderId = localStorage.getItem('idUser') ?? '';

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load lịch sử chat ban đầu
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await getChatHistoryAPI('rd00002'); // receiverId của thủ thư
                if (Array.isArray(res)) {
                    setMessages(res);
                }
            } catch (err) {
                console.error('Lỗi khi tải tin nhắn:', err);
            }
        };

        fetchMessages();
    }, []);

    const ENDPOINT = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080/';

    useEffect(() => {
        // 1. Khởi tạo connection
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${ENDPOINT}chatHub`, {
                accessTokenFactory: () => localStorage.getItem('token') || '',
            })
            .withAutomaticReconnect()
            .build();

        // Backend gửi: SendAsync("ReceiveMessage", senderId, content, sentAt)
        newConnection.on('ReceiveMessage', (msgSenderId: string, content: IChatContent, sentAt: string) => {
            const newMessage: IChatMessage = {
                id: Date.now().toString(),
                senderId: msgSenderId,
                receiverId: senderId, // Người nhận là user hiện tại
                content: content,
                sentAt: sentAt,
            };
            setMessages((prev) => {
                // Tránh duplicate message
                const isExisted = prev.find((m) => 
                    m.senderId === msgSenderId && 
                    m.content?.data === content?.data && 
                    m.sentAt === sentAt
                );
                if (isExisted) return prev;
                return [...prev, newMessage];
            });
        });

        const startConnection = async () => {
            try {
                await newConnection.start();
                console.log('SignalR Connected!');
                // Backend dùng CustomUserIdProvider lấy userId từ JWT token
                // Không cần invoke JoinRoom
                setConnection(newConnection);
            } catch (err) {
                console.log('SignalR Connection Error: ', err);
                setTimeout(startConnection, 5000);
            }
        };

        startConnection();

        // 4. Cleanup: Ngắt kết nối khi component unmount
        return () => {
            if (newConnection) {
                newConnection.stop();
            }
        };
    }, [senderId]); // Re-connect nếu senderId thay đổi

    // Đã loại bỏ useEffect duplicate - connection đã được start ở useEffect trên

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Hôm nay';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Hôm qua';
        }
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const sendMessage = async () => {
        if (input.trim()) {
            const payload = {
                receiverId: 'rd00002',
                content: {
                    type: 'text' as const,
                    data: input.trim(),
                },
            };

            setIsSending(true);
            try {
                // Gọi API để lưu vào Database
                // Backend sẽ tự động push tin nhắn qua SignalR cho người nhận
                await sendMessageAPI(payload);

                // Cập nhật giao diện người gửi (optimistic update)
                const localMsg: IChatMessage = {
                    id: Date.now().toString(),
                    senderId: senderId,
                    receiverId: payload.receiverId,
                    content: payload.content,
                    sentAt: new Date().toISOString(),
                };

                setMessages((prev) => [...prev, localMsg]);
                setInput('');
            } catch (e) {
                console.error('Lỗi khi gửi tin nhắn:', e);
                antdMessage.error('Không thể gửi tin nhắn.');
            } finally {
                setIsSending(false);
            }
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
        <div className="flex flex-col h-[calc(100vh-4rem)] sm:h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#153D36] to-[#1E5D4A] px-4 sm:px-6 py-3 sm:py-4 shadow-lg">
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className="relative">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-2 border-white/30">
                            <img
                                src="https://thumbs.dreamstime.com/b/man-people-admin-avatar-icon-272321203.jpg"
                                alt="Librarian"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-400 border-2 border-white rounded-full"></span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h2 className="text-white font-semibold text-base sm:text-lg flex items-center gap-2 truncate">
                            <CustomerServiceOutlined className="hidden sm:inline" />
                            Thủ thư Hỗ trợ
                        </h2>
                        <p className="text-emerald-200 text-xs sm:text-sm truncate">
                            Trực tuyến • Thường trả lời trong vài phút
                        </p>
                    </div>
                </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 px-4">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                            <CustomerServiceOutlined className="text-3xl sm:text-4xl text-emerald-500" />
                        </div>
                        <p className="text-base sm:text-lg font-medium text-gray-500 text-center">
                            Bắt đầu cuộc trò chuyện
                        </p>
                        <p className="text-xs sm:text-sm text-gray-400 mt-1 text-center">
                            Gửi tin nhắn để được hỗ trợ từ thủ thư
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4 sm:space-y-6 max-w-3xl mx-auto">
                        {Object.entries(groupedMessages).map(
                            ([dateKey, msgs]) => (
                                <div key={dateKey}>
                                    {/* Date Separator */}
                                    <div className="flex items-center justify-center mb-3 sm:mb-4">
                                        <span className="px-3 sm:px-4 py-1 bg-white/80 backdrop-blur-sm rounded-full text-[10px] sm:text-xs text-gray-500 shadow-sm">
                                            {formatDate(msgs[0].sentAt)}
                                        </span>
                                    </div>

                                    {/* Messages for this date */}
                                    <div className="space-y-2 sm:space-y-3">
                                        {msgs.map((msg, i) => {
                                            const isSender =
                                                msg.senderId === senderId;
                                            return (
                                                <div
                                                    key={msg.id || i}
                                                    className={`flex items-end gap-1.5 sm:gap-2 animate-fadeIn ${
                                                        isSender
                                                            ? 'justify-end'
                                                            : 'justify-start'
                                                    }`}
                                                    style={{
                                                        animation:
                                                            'fadeIn 0.3s ease-out',
                                                    }}
                                                >
                                                    {/* Librarian Avatar */}
                                                    {!isSender && (
                                                        <div className="flex-shrink-0">
                                                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden ring-2 ring-emerald-200">
                                                                <img
                                                                    src="https://thumbs.dreamstime.com/b/man-people-admin-avatar-icon-272321203.jpg"
                                                                    alt="Thủ thư"
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Message Bubble */}
                                                    <div
                                                        className={`max-w-[80%] sm:max-w-[70%] ${
                                                            isSender
                                                                ? 'order-1'
                                                                : ''
                                                        }`}
                                                    >
                                                        <div
                                                            className={`group relative px-3 sm:px-4 py-2 sm:py-3 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md ${
                                                                isSender
                                                                    ? 'bg-gradient-to-br from-[#153D36] to-[#1E5D4A] text-white rounded-br-sm'
                                                                    : 'bg-white text-gray-800 rounded-bl-sm border border-gray-100'
                                                            }`}
                                                        >
                                                            <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                                                                {
                                                                    msg.content
                                                                        ?.data
                                                                }
                                                            </p>
                                                        </div>
                                                        <p
                                                            className={`text-[9px] sm:text-[10px] mt-0.5 sm:mt-1 text-gray-400 ${
                                                                isSender
                                                                    ? 'text-right mr-1'
                                                                    : 'ml-1'
                                                            }`}
                                                        >
                                                            {formatTime(
                                                                msg.sentAt
                                                            )}
                                                        </p>
                                                    </div>

                                                    {/* User Avatar */}
                                                    {isSender && (
                                                        <div className="flex-shrink-0 order-2">
                                                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden ring-2 ring-emerald-300 bg-emerald-100 flex items-center justify-center">
                                                                {user?.data
                                                                    ?.avatarUrl ? (
                                                                    <img
                                                                        src={
                                                                            user
                                                                                .data
                                                                                .avatarUrl
                                                                        }
                                                                        alt="Bạn"
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <UserOutlined className="text-emerald-600 text-xs sm:text-base" />
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 bg-white/80 backdrop-blur-sm px-3 sm:px-4 py-3 sm:py-4">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Nhập tin nhắn..."
                                className={`w-full px-4 sm:px-5 py-2.5 sm:py-3 pr-10 sm:pr-12 rounded-full bg-gray-100 border-2 transition-all duration-200 outline-none text-sm ${
                                    inputError
                                        ? 'border-red-300 focus:border-red-400'
                                        : 'border-transparent focus:border-emerald-400 focus:bg-white'
                                }`}
                                value={input}
                                onChange={(e) => {
                                    setInput(e.target.value);
                                    if (inputError) setInputError('');
                                }}
                                onKeyDown={(e) =>
                                    e.key === 'Enter' &&
                                    !e.shiftKey &&
                                    sendMessage()
                                }
                            />
                        </div>
                        <button
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                                input.trim()
                                    ? 'bg-gradient-to-r from-[#153D36] to-[#1E5D4A] text-white shadow-lg hover:shadow-xl hover:scale-105'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            } ${isSending ? 'animate-pulse' : ''}`}
                            onClick={sendMessage}
                            disabled={isSending || !input.trim()}
                        >
                            <SendOutlined
                                className="text-base sm:text-lg"
                                style={{ transform: 'rotate(-45deg)' }}
                            />
                        </button>
                    </div>
                    {inputError && (
                        <p className="text-red-500 text-xs mt-1.5 sm:mt-2 ml-3 sm:ml-4 animate-shake">
                            ⚠️ {inputError}
                        </p>
                    )}
                    <p className="text-center text-[10px] sm:text-xs text-gray-400 mt-2 sm:mt-3 hidden sm:block">
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
