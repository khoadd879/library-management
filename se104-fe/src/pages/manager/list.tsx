import React, { useState, useEffect } from 'react';
import { Input, Layout, Typography } from 'antd';
import {
    SearchOutlined,
    TeamOutlined,
    SolutionOutlined,
    ReadOutlined,
    TagsOutlined,
    BookOutlined,
} from '@ant-design/icons';

import BookList from '@/components/admin/listPage/BookList';
import ReaderList from '@/components/admin/listPage/ReaderList';
import AuthorList from '@/components/admin/listPage/AuthorList';
import TypeReaderList from '@/components/admin/listPage/TypeReaderList';
import TypeBookList from '@/components/admin/listPage/TypeBookList';

const { Content } = Layout;
const { Title, Text } = Typography;

const List = () => {
    const [activeTab, setActiveTab] = useState<string>('reader');
    const [searchKeyword, setSearchKeyword] = useState('');
    const [debouncedKeyword, setDebouncedKeyword] = useState('');

    useEffect(() => {
        setSearchKeyword('');
        setDebouncedKeyword('');
    }, [activeTab]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedKeyword(searchKeyword);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchKeyword]);

    const tabItems = [
        {
            key: 'reader',
            label: 'Độc giả',
            icon: <TeamOutlined />,
            children: <ReaderList keyword={debouncedKeyword} />,
        },
        {
            key: 'author',
            label: 'Tác giả',
            icon: <SolutionOutlined />,
            children: <AuthorList keyword={debouncedKeyword} />,
        },
        {
            key: 'book',
            label: 'Kho sách',
            icon: <ReadOutlined />,
            children: <BookList keyword={debouncedKeyword} />,
        },
        {
            key: 'typeBook',
            label: 'Loại sách',
            icon: <TagsOutlined />,
            children: <TypeBookList keyword={debouncedKeyword} />,
        },
        {
            key: 'typeReader',
            label: 'Loại độc giả',
            icon: <BookOutlined />,
            children: <TypeReaderList keyword={debouncedKeyword} />,
        },
    ];

    return (
        <Layout className="min-h-screen bg-[#f5f7fa]">
            {/* Header Section */}
            <div className="bg-[#153D36] px-4 sm:px-6 lg:px-8 py-5">
                <div className="max-w-[1400px] mx-auto">
                    <Title
                        level={3}
                        className="!text-white !mb-1 !font-semibold"
                    >
                        Quản lý thư viện
                    </Title>
                    <Text className="text-emerald-200/70 text-sm">
                        Tra cứu và quản lý dữ liệu hệ thống
                    </Text>
                </div>
            </div>

            <Content className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto w-full">
                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Tab Header with Search */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4 border-b border-gray-100">
                        {/* Tabs */}
                        <div className="flex flex-wrap gap-2">
                            {tabItems.map((item) => (
                                <button
                                    key={item.key}
                                    onClick={() => setActiveTab(item.key)}
                                    className={`
                                        flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                                        ${activeTab === item.key
                                            ? 'bg-[#153D36] text-white shadow-lg shadow-emerald-500/20'
                                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-[#153D36]'
                                        }
                                    `}
                                >
                                    <span className={activeTab === item.key ? 'text-emerald-300' : 'text-gray-400'}>
                                        {item.icon}
                                    </span>
                                    <span className="hidden sm:inline">{item.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="w-full lg:w-auto">
                            <Input
                                placeholder="Tìm kiếm theo tên, mã..."
                                prefix={<SearchOutlined className="text-gray-400" />}
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                allowClear
                                className="w-full lg:w-[300px] rounded-xl bg-gray-50 hover:bg-white focus:bg-white border-gray-200 hover:border-[#153D36] focus:border-[#153D36] transition-all h-10"
                            />
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-4 sm:p-6">
                        {tabItems.find((item) => item.key === activeTab)?.children}
                    </div>
                </div>
            </Content>

            {/* Custom Table Styles */}
            <style>{`
                .ant-table {
                    font-size: 14px;
                }
                .ant-table-thead > tr > th {
                    background: #f8fafc !important;
                    color: #64748b !important;
                    font-weight: 600 !important;
                    font-size: 12px !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.05em !important;
                    border-bottom: 1px solid #e2e8f0 !important;
                    padding: 12px 16px !important;
                }
                .ant-table-tbody > tr > td {
                    padding: 14px 16px !important;
                    border-bottom: 1px solid #f1f5f9 !important;
                }
                .ant-table-tbody > tr:hover > td {
                    background: #f0fdf4 !important;
                }
                .ant-table-tbody > tr:last-child > td {
                    border-bottom: none !important;
                }
                .ant-pagination {
                    padding: 16px !important;
                    margin: 0 !important;
                    border-top: 1px solid #f1f5f9;
                }
                .ant-pagination-item-active {
                    border-color: #153D36 !important;
                }
                .ant-pagination-item-active a {
                    color: #153D36 !important;
                }
                .ant-spin-dot-item {
                    background-color: #153D36 !important;
                }
                .ant-table-cell-fix-left,
                .ant-table-cell-fix-right {
                    background: #fff !important;
                }
                .ant-table-tbody > tr:hover .ant-table-cell-fix-left,
                .ant-table-tbody > tr:hover .ant-table-cell-fix-right {
                    background: #f0fdf4 !important;
                }
                @media (max-width: 640px) {
                    .ant-table-thead > tr > th,
                    .ant-table-tbody > tr > td {
                        padding: 10px 12px !important;
                    }
                }
            `}</style>
        </Layout>
    );
};

export default List;
