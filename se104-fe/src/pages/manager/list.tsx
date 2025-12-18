import React, { useState, useEffect } from 'react';
import {
    Input,
    Tabs,
    Badge,
    Avatar,
    Layout,
    Typography,
    Dropdown,
    MenuProps,
    Button,
} from 'antd';
import {
    SearchOutlined,
    BellOutlined,
    UserOutlined,
    DownOutlined,
    TeamOutlined,
    SolutionOutlined,
    ReadOutlined,
    TagsOutlined,
    BookOutlined,
    LogoutOutlined,
    SettingOutlined,
} from '@ant-design/icons';

// Import các component con của bạn
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

    // Logic Search & Debounce giữ nguyên như cũ
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

    // Menu Dropdown cho User (Ví dụ: Đăng xuất, Cài đặt)
    const userMenuItems: MenuProps['items'] = [
        { key: '1', label: 'Thông tin cá nhân', icon: <UserOutlined /> },
        { key: '2', label: 'Cài đặt', icon: <SettingOutlined /> },
        { type: 'divider' },
        {
            key: '3',
            label: 'Đăng xuất',
            icon: <LogoutOutlined />,
            danger: true,
        },
    ];

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
        <Layout className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-[#153D36] via-[#1A4A42] to-[#0D2621] px-8 py-6">
                <div className="max-w-[1600px] mx-auto">
                    <Title
                        level={2}
                        style={{
                            color: 'white',
                            margin: 0,
                            fontWeight: 700,
                        }}
                    >
                        Quản lý thư viện
                    </Title>
                    <Text className="text-emerald-200/80">
                        Tra cứu và quản lý dữ liệu hệ thống
                    </Text>
                </div>
            </div>

            <Content className="p-6 md:p-10 max-w-[1600px] mx-auto w-full">
                {/* === PHẦN NỘI DUNG CHÍNH (CARD TRẮNG) === */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <Tabs
                        activeKey={activeTab}
                        onChange={setActiveTab}
                        type="card"
                        size="large"
                        // Tùy chỉnh CSS cho Tabs để nó hòa nhập với nền trắng
                        className="custom-admin-tabs pt-4 px-4"
                        items={tabItems.map((item) => ({
                            key: item.key,
                            label: (
                                <span className="flex items-center gap-2 px-1 py-1">
                                    {item.icon}
                                    {item.label}
                                </span>
                            ),
                            children: (
                                <div className="p-2 animate-fadeIn min-h-[500px]">
                                    {/* Truyền keyword xuống children */}
                                    {item.children}
                                </div>
                            ),
                        }))}
                        // Thanh Search nằm gọn bên phải Tabs
                        tabBarExtraContent={
                            <div className="mr-2 pb-1 w-[280px] md:w-[350px]">
                                <Input
                                    placeholder="Tìm kiếm theo tên, mã..."
                                    prefix={
                                        <SearchOutlined className="text-gray-400" />
                                    }
                                    value={searchKeyword}
                                    onChange={(e) =>
                                        setSearchKeyword(e.target.value)
                                    }
                                    allowClear
                                    className="rounded-lg bg-gray-50 hover:bg-white focus:bg-white border-gray-200 hover:border-[#153D36] focus:border-[#153D36] transition-all"
                                />
                            </div>
                        }
                    />
                </div>
            </Content>
        </Layout>
    );
};

export default List;
