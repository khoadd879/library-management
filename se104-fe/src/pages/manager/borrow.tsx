import { useState } from 'react';
import BorrowForm from '@/components/admin/book/BorrowForm';
import FineForm from '@/components/admin/book/FineForm';
import ListBorrow from '@/components/admin/book/ListBorrow';
import { FaBook, FaListAlt, FaMoneyBillWave } from 'react-icons/fa';

const BorrowBook = () => {
    const [selectedTab, setSelectedTab] = useState<'borrow' | 'list' | 'fine'>(
        'borrow'
    );

    const renderTab = () => {
        switch (selectedTab) {
            case 'borrow':
                return <BorrowForm />;
            case 'list':
                return <ListBorrow />;
            case 'fine':
                return <FineForm />;
            default:
                return null;
        }
    };

    const tabs = [
        { key: 'borrow', label: 'Mượn sách', icon: <FaBook className="text-lg" /> },
        { key: 'list', label: 'Danh sách mượn', icon: <FaListAlt className="text-lg" /> },
        { key: 'fine', label: 'Thu tiền phạt', icon: <FaMoneyBillWave className="text-lg" /> },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-[#153D36] via-[#1A4A42] to-[#0D2621] px-4 sm:px-6 md:px-8 py-4 sm:py-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">
                        Quản lý mượn trả sách
                    </h1>
                    <p className="text-emerald-200/80 text-xs sm:text-sm">
                        Xử lý các yêu cầu mượn, trả sách và thu tiền phạt
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
                {/* Tab Navigation - Responsive */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-1.5 sm:p-2 mb-4 sm:mb-6 md:mb-8 flex flex-wrap gap-1 sm:gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setSelectedTab(tab.key as typeof selectedTab)}
                            className={`flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-3.5 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm transition-all duration-300 flex-1 sm:flex-none ${selectedTab === tab.key
                                    ? 'bg-gradient-to-r from-[#153D36] to-[#1A4A42] text-white shadow-lg shadow-emerald-500/20'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#153D36]'
                                }`}
                        >
                            <span className={`${selectedTab === tab.key ? 'text-emerald-300' : 'text-gray-400'}`}>
                                {tab.icon}
                            </span>
                            <span className="hidden xs:inline sm:inline">{tab.label}</span>
                            <span className="xs:hidden sm:hidden">{tab.key === 'borrow' ? 'Mượn' : tab.key === 'list' ? 'DS' : 'Phạt'}</span>
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-4 md:p-6 min-h-[400px] sm:min-h-[500px] overflow-x-auto">
                    <div className="animate-fadeIn">
                        {renderTab()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BorrowBook;
