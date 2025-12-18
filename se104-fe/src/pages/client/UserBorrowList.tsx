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
        { id: 'borrows', label: 'Phiếu Mượn', icon: BookOpen },
        { id: 'returns', label: 'Phiếu Trả', icon: RotateCcw },
        { id: 'fines', label: 'Danh Sách Phạt', icon: AlertCircle },
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
            {/* Header - Modern Glassmorphism effect */}
            <header className="sticky top-0 z-10 bg-[#153D36] text-white px-8 py-5 shadow-lg flex items-center gap-3">
                <Library className="w-8 h-8 text-emerald-400" />
                <div>
                    <h1 className="text-xl font-extrabold tracking-tight uppercase">
                        Quản Lý Thư Viện
                    </h1>
                    <p className="text-xs text-emerald-200/70 font-medium tracking-wide uppercase">
                        Cổng thông tin bạn đọc
                    </p>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Tab Navigation - Pill style */}
                <div className="flex bg-white p-1.5 rounded-xl shadow-sm border border-slate-200 inline-flex mb-8">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = selectedTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setSelectedTab(tab.id)}
                                className={`
                  flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200
                  ${
                      isActive
                          ? 'bg-[#153D36] text-white shadow-md scale-105'
                          : 'text-slate-500 hover:bg-slate-50 hover:text-[#153D36]'
                  }
                `}
                            >
                                <Icon
                                    className={`w-4 h-4 ${
                                        isActive ? 'text-emerald-400' : ''
                                    }`}
                                />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Content Area - Clean Card container */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 min-h-[500px] overflow-hidden">
                    {/* Header trong tab content (tùy chọn) */}
                    <div className="border-b border-slate-100 px-8 py-5 bg-slate-50/50">
                        <h2 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                            {tabs.find((t) => t.id === selectedTab)?.label}
                        </h2>
                    </div>

                    <div className="p-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {renderTab()}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserBorrowList;
