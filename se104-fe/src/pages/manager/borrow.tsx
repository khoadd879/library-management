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
            <div className="bg-gradient-to-r from-[#153D36] via-[#1A4A42] to-[#0D2621] px-8 py-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-bold text-white mb-1">
                        Quản lý mượn trả sách
                    </h1>
                    <p className="text-emerald-200/80 text-sm">
                        Xử lý các yêu cầu mượn, trả sách và thu tiền phạt
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 py-8">
                {/* Tab Navigation */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mb-8 inline-flex gap-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setSelectedTab(tab.key as typeof selectedTab)}
                            className={`flex items-center gap-3 px-6 py-3.5 rounded-xl font-medium text-sm transition-all duration-300 ${selectedTab === tab.key
                                    ? 'bg-gradient-to-r from-[#153D36] to-[#1A4A42] text-white shadow-lg shadow-emerald-500/20'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#153D36]'
                                }`}
                        >
                            <span className={`${selectedTab === tab.key ? 'text-emerald-300' : 'text-gray-400'}`}>
                                {tab.icon}
                            </span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-[500px]">
                    <div className="animate-fadeIn">
                        {renderTab()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BorrowBook;
