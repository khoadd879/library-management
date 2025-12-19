import React, { useEffect, useState } from 'react';
import {
    FaHome,
    FaHeart,
    FaHistory,
    FaComments,
    FaSignOutAlt,
    FaUserCircle,
    FaBars,
    FaTimes,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useCurrentApp } from '../context/app.context';
import { getListReader, logoutAPI } from '../../services/api';
import { FaList } from 'react-icons/fa6';

interface UserSidebarProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isMobile?: boolean;
}

const UserSidebar: React.FC<UserSidebarProps> = ({ open, setOpen, isMobile = false }) => {
    const navigate = useNavigate();
    const { setIsAuthenticated, user, setUser } = useCurrentApp();
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        await logoutAPI(refreshToken!);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setUser(null);
        setIsAuthenticated(false);
        navigate('/signin');
    };

    const menuItems = [
        {
            icon: <FaHome size={20} />,
            label: 'Trang chủ',
            onClick: () => { navigate('/'); setMobileMenuOpen(false); },
        },
        {
            icon: <FaHeart size={20} />,
            label: 'Yêu thích',
            onClick: () => { navigate('/favorites'); setMobileMenuOpen(false); },
        },
        {
            icon: <FaHistory size={20} />,
            label: 'Lịch sử mượn',
            onClick: () => { navigate('/history'); setMobileMenuOpen(false); },
        },
        {
            icon: <FaComments size={20} />,
            label: 'Trò chuyện',
            onClick: () => { navigate('/chat'); setMobileMenuOpen(false); },
        },
        {
            icon: <FaList size={20} />,
            label: 'Danh sách mượn',
            onClick: () => { navigate('/borrow-list'); setMobileMenuOpen(false); },
        },
    ];

    useEffect(() => {
        // Nếu user context chưa có nhưng localStorage có idUser, fetch lại user và set vào context
        if (!user) {
            const idUser = localStorage.getItem('idUser');
            if (idUser) {
                getListReader().then((readers) => {
                    const found = Array.isArray(readers)
                        ? readers.find((r) => r.idReader === idUser)
                        : null;
                    if (found) setUser(found);
                });
            }
        }
        // Fetch avatar nếu user đã có
        const fetchAvatar = async () => {
            try {
                const idUser = localStorage.getItem('idUser');
                const res = await getListReader();
                const readersArray = res?.data || res;
                const found = Array.isArray(readersArray)
                    ? readersArray.find((r: any) => r.idReader === idUser)
                    : null;
                setAvatarUrl(found?.urlAvatar || null);
            } catch (e) {
                setAvatarUrl(null);
            }
        };
        if (user) fetchAvatar();

        // Lắng nghe event cập nhật profile để refresh user
        const handleProfileUpdate = () => {
            const idUser = localStorage.getItem('idUser');
            if (idUser) {
                getListReader().then((readers) => {
                    const found = Array.isArray(readers)
                        ? readers.find((r) => r.idReader === idUser)
                        : null;
                    if (found) setUser(found);
                });
            }
        };
        window.addEventListener('user-profile-updated', handleProfileUpdate);
        return () => {
            window.removeEventListener(
                'user-profile-updated',
                handleProfileUpdate
            );
        };
    }, [user, setUser]);

    // Mobile Header View
    if (isMobile) {
        return (
            <>
                {/* Mobile Header */}
                <nav className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-[#153D36] via-[#1A4A42] to-[#153D36] text-white z-50 shadow-lg flex items-center justify-between px-4">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/29/29302.png"
                            alt="Library"
                            className="w-8 h-8 filter invert opacity-80"
                        />
                        <span className="font-black text-lg tracking-wider text-emerald-200">LibManager</span>
                    </div>

                    {/* User & Menu */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/profile')}
                            className="flex items-center gap-2 hover:bg-white/10 rounded-xl px-2 py-1.5 transition-all"
                        >
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="avatar" className="w-8 h-8 rounded-full object-cover border border-emerald-400/50" />
                            ) : (
                                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                                    <FaUserCircle size={18} className="text-white/80" />
                                </div>
                            )}
                        </button>
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-xl hover:bg-white/15 transition-all"
                        >
                            {mobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                        </button>
                    </div>
                </nav>

                {/* Mobile Dropdown Menu */}
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <div 
                            className="fixed inset-0 bg-black/50 z-40 mt-16"
                            onClick={() => setMobileMenuOpen(false)}
                        />
                        {/* Menu */}
                        <div className="fixed top-16 left-0 right-0 bg-gradient-to-b from-[#1A4A42] to-[#153D36] z-50 shadow-2xl mobile-menu-enter max-h-[calc(100vh-4rem)] overflow-y-auto no-scrollbar">
                            <ul className="py-2">
                                {menuItems.map((item, index) => (
                                    <li key={index}>
                                        <button
                                            onClick={item.onClick}
                                            className="w-full flex items-center gap-4 px-6 py-4 hover:bg-white/10 transition-all text-left"
                                        >
                                            <span className="text-emerald-300">{item.icon}</span>
                                            <span className="text-white font-medium">{item.label}</span>
                                        </button>
                                    </li>
                                ))}
                                {/* Logout */}
                                <li className="border-t border-white/10 mt-2 pt-2">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-4 px-6 py-4 hover:bg-red-500/20 transition-all text-left"
                                    >
                                        <span className="text-red-400"><FaSignOutAlt size={20} /></span>
                                        <span className="text-red-300 font-bold">ĐĂNG XUẤT</span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </>
                )}
            </>
        );
    }

    // Desktop Sidebar View
    return (
        <nav
            className={`fixed top-0 left-0 h-full flex flex-col duration-500 ease-out bg-gradient-to-b from-[#153D36] via-[#1A4A42] to-[#0D2621] text-white z-50 shadow-2xl ${
                open ? 'w-72' : 'w-20'
            }`}
            aria-label="Sidebar"
        >
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 pointer-events-none" />
            
            {/* Header - User Info */}
            <div className="relative px-4 py-6 flex justify-between items-center border-b border-white/10">
                <button
                    className="group hover:bg-white/10 rounded-2xl transition-all duration-300 w-full overflow-hidden p-2"
                    onClick={() => navigate('/profile')}
                >
                    <div
                        className={`flex items-center gap-4 ${
                            !open && 'hidden'
                        }`}
                    >
                        {/* Avatar with glow effect */}
                        <div className="relative">
                            {avatarUrl ? (
                                <img
                                    src={avatarUrl}
                                    alt="avatar"
                                    className="w-12 h-12 rounded-full object-cover flex-shrink-0 border-2 border-emerald-400/50 shadow-lg shadow-emerald-500/20 group-hover:border-emerald-400 group-hover:scale-105 transition-all duration-300"
                                />
                            ) : (
                                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center shadow-lg">
                                    <FaUserCircle size={28} className="text-white/80" />
                                </div>
                            )}
                            {/* Online indicator */}
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[#153D36] shadow-sm" />
                        </div>
                        {/* Text container */}
                        <div className="flex-1 text-left min-w-0">
                            <p className="font-bold text-sm text-white truncate group-hover:text-emerald-300 transition-colors">
                                {user?.data.nameReader}
                            </p>
                            <span className="text-xs text-emerald-200/60 truncate block">
                                {user?.data.email}
                            </span>
                        </div>
                    </div>
                </button>
                <button
                    onClick={() => setOpen(!open)}
                    className="p-2.5 rounded-xl hover:bg-white/15 hover:scale-110 transition-all duration-300 flex-shrink-0 backdrop-blur-sm"
                >
                    <FaBars
                        size={18}
                        className={`duration-500 ${!open && 'rotate-180'}`}
                    />
                </button>
            </div>

            {/* Navigation Items */}
            <ul className={`relative flex-1 py-6 space-y-1.5 px-3 no-scrollbar ${open ? 'overflow-y-auto' : 'overflow-hidden'}`}>
                {menuItems.map((item, index) => (
                    <li key={index}>
                        <button
                            onClick={item.onClick}
                            className="w-full flex items-center gap-4 px-4 py-3.5 hover:bg-gradient-to-r hover:from-white/15 hover:to-white/5 rounded-xl transition-all duration-300 relative group hover:translate-x-1 hover:shadow-lg hover:shadow-black/10"
                        >
                            {/* Active indicator bar */}
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-emerald-400 rounded-full group-hover:h-6 transition-all duration-300 shadow-lg shadow-emerald-400/50" />
                            
                            <div className="flex justify-center w-8 text-emerald-300/80 group-hover:text-emerald-300 group-hover:scale-110 transition-all duration-300">
                                {item.icon}
                            </div>
                            <span
                                className={`${
                                    !open ? 'opacity-0 w-0' : 'opacity-100'
                                } transition-all duration-300 truncate text-sm font-medium text-white/90 group-hover:text-white`}
                            >
                                {item.label}
                            </span>
                            {/* Tooltip khi sidebar đóng */}
                            {!open && (
                                <span className="absolute left-20 bg-[#153D36] text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-2xl shadow-black/30 z-50 opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap border border-emerald-500/20 backdrop-blur-md">
                                    {item.label}
                                </span>
                            )}
                        </button>
                    </li>
                ))}
            </ul>

            {/* Group Logo */}
            <div className={`flex flex-col items-center py-6 border-t border-white/10 ${!open && 'hidden'}`}>
                <div className="relative">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/29/29302.png"
                        alt="Library"
                        className="w-12 h-12 filter invert opacity-60"
                    />
                    <div className="absolute inset-0 bg-emerald-400/20 blur-xl rounded-full" />
                </div>
                <p className="italic font-black text-lg tracking-wider text-emerald-200/80 mt-2 uppercase">LibManager</p>
            </div>

            {/* Footer - Logout */}
            <div className="relative px-3 py-4 border-t border-white/10">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-4 py-3.5 hover:bg-red-500/20 rounded-xl transition-all duration-300 relative group"
                >
                    <div className="flex justify-center w-8 text-red-300/70 group-hover:text-red-400 group-hover:scale-110 transition-all duration-300">
                        <FaSignOutAlt size={18} />
                    </div>
                    <span
                        className={`${
                            !open ? 'opacity-0 w-0' : 'opacity-100'
                        } transition-all duration-300 text-sm font-bold tracking-wide text-white/80 group-hover:text-red-300`}
                    >
                        ĐĂNG XUẤT
                    </span>
                    {/* Tooltip khi sidebar đóng */}
                    {!open && (
                        <span className="absolute left-20 bg-red-500/90 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-2xl z-50 opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap backdrop-blur-md">
                            ĐĂNG XUẤT
                        </span>
                    )}
                </button>
            </div>
        </nav>
    );
};

export default UserSidebar;
