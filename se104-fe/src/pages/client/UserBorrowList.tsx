import { useState } from 'react';
import { BookOpen, RotateCcw, AlertCircle, Library } from 'lucide-react';
import UserBorrows from '@/components/client/UserBorrows';
import UserReturns from '@/components/client/UserReturns';
import UserFines from '@/components/client/UserFines';

const UserBorrowList = () => {
    const [selectedTab, setSelectedTab] = useState<
        'borrows' | 'returns' | 'fines'
    >('borrows');

    const tabs = [
        { id: 'borrows', label: 'Phiếu Mượn', shortLabel: 'Mượn', icon: BookOpen },
        { id: 'returns', label: 'Phiếu Trả', shortLabel: 'Trả', icon: RotateCcw },
        { id: 'fines', label: 'Danh Sách Phạt', shortLabel: 'Phạt', icon: AlertCircle },
    ] as const;

    const renderTab = () => {
        switch (selectedTab) {
            case 'borrows':
                return <UserBorrows />;
            case 'returns':
                return <UserReturns />;
            case 'fines':
                return <UserFines />;
            default:
                return null;
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#f8fafc] text-slate-800">
            {/* Header - Responsive */}
            <header className="sticky top-0 z-10 bg-[#153D36] text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 shadow-lg flex items-center gap-2 sm:gap-3">
                <Library className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-emerald-400 flex-shrink-0" />
                <div className="min-w-0">
                    <h1 className="text-base sm:text-lg md:text-xl font-extrabold tracking-tight uppercase truncate">
                        Quản Lý Thư Viện
                    </h1>
                    <p className="text-[10px] sm:text-xs text-emerald-200/70 font-medium tracking-wide uppercase">
                        Cổng thông tin bạn đọc
                    </p>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
                {/* Tab Navigation - Responsive */}
                <div className="flex bg-white p-1 sm:p-1.5 rounded-lg sm:rounded-xl shadow-sm border border-slate-200 mb-4 sm:mb-6 md:mb-8">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = selectedTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setSelectedTab(tab.id)}
                                className={`
                                    flex-1 sm:flex-none flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 
                                    px-2 sm:px-4 md:px-6 py-2 sm:py-2.5 rounded-md sm:rounded-lg 
                                    font-semibold text-xs sm:text-sm transition-all duration-200
                                    ${isActive
                                        ? 'bg-[#153D36] text-white shadow-md scale-[1.02] sm:scale-105'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-[#153D36]'
                                    }
                                `}
                            >
                                <Icon
                                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                                        isActive ? 'text-emerald-400' : ''
                                    }`}
                                />
                                <span className="hidden sm:inline">{tab.label}</span>
                                <span className="sm:hidden">{tab.shortLabel}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Content Area - Responsive */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-slate-200 min-h-[400px] sm:min-h-[500px] overflow-hidden">
                    {/* Header trong tab content */}
                    <div className="border-b border-slate-100 px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 bg-slate-50/50">
                        <h2 className="text-sm sm:text-base md:text-lg font-bold text-slate-700 flex items-center gap-2">
                            {tabs.find((t) => t.id === selectedTab)?.label}
                        </h2>
                    </div>

                    <div className="p-3 sm:p-4 md:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {renderTab()}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserBorrowList;
