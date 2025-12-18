import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { listAuthorAPI } from '@/services/api';
import { Spin, Input, Empty, Tag, Tooltip } from 'antd';
import {
    SearchOutlined,
    GlobalOutlined,
    BookOutlined,
} from '@ant-design/icons';

const AuthorPage = () => {
    const [authors, setAuthors] = useState<IAddAuthor[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAuthors = async () => {
            try {
                const res = await listAuthorAPI();
                setAuthors(Array.isArray(res.data) ? res.data : []);
            } catch (error) {
                console.error('Error fetching authors:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAuthors();
    }, []);

    // Logic tìm kiếm tác giả
    const filteredAuthors = useMemo(() => {
        return authors.filter(
            (author) =>
                author.nameAuthor
                    .toLowerCase()
                    .includes(searchText.toLowerCase()) ||
                author.nationality
                    .toLowerCase()
                    .includes(searchText.toLowerCase())
        );
    }, [authors, searchText]);

    return (
        <div className="min-h-screen bg-[#F8FAFC] w-full px-4 md:px-12 py-10 animate-fade-in">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div>
                        <h2 className="text-3xl font-extrabold text-[#153D36] tracking-tight">
                            Danh mục Tác giả
                        </h2>
                        <p className="text-gray-500 mt-1 flex items-center gap-2">
                            <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                            Hệ thống đang quản lý{' '}
                            <span className="font-bold text-gray-800">
                                {authors.length}
                            </span>{' '}
                            tác giả
                        </p>
                    </div>

                    <div className="w-full md:w-80">
                        <Input
                            prefix={
                                <SearchOutlined className="text-gray-400" />
                            }
                            placeholder="Tìm tên hoặc quốc tịch..."
                            allowClear
                            size="large"
                            className="rounded-xl border-gray-200 hover:border-[#153D36] focus:border-[#153D36] transition-all shadow-sm"
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
                    {loading ? (
                        <div className="flex flex-col justify-center items-center py-32 gap-4">
                            <Spin size="large" />
                            <p className="text-gray-400 animate-pulse">
                                Đang tải dữ liệu tác giả...
                            </p>
                        </div>
                    ) : filteredAuthors.length === 0 ? (
                        <div className="py-24 bg-white">
                            <Empty description="Không tìm thấy tác giả nào phù hợp" />
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-[#F1F5F9] border-b border-gray-200">
                                        <th className="px-6 py-5 text-center text-xs font-bold text-gray-500 uppercase tracking-wider w-24">
                                            Ảnh
                                        </th>
                                        <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            Thông tin tác giả
                                        </th>
                                        <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                                            Quốc tịch
                                        </th>
                                        <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                            Thể loại chính
                                        </th>
                                        <th className="px-6 py-5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                                            Tiểu sử
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredAuthors.map((author) => (
                                        <tr
                                            key={author.idAuthor}
                                            className="hover:bg-blue-50/30 transition-all duration-200 cursor-pointer group"
                                            onClick={() =>
                                                navigate(
                                                    `/authorInfo/${author.idAuthor}`
                                                )
                                            }
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="relative inline-block">
                                                    {author.urlAvatar ? (
                                                        <img
                                                            src={
                                                                author.urlAvatar
                                                            }
                                                            alt={
                                                                author.nameAuthor
                                                            }
                                                            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-gray-100 group-hover:ring-[#153D36]/30 transition-all shadow-md"
                                                        />
                                                    ) : (
                                                        <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center text-gray-400 border-2 border-white shadow-sm">
                                                            <span className="text-xl font-bold">
                                                                ?
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-[#153D36] text-lg group-hover:text-blue-600 transition-colors">
                                                    {author.nameAuthor}
                                                </div>
                                                <div className="md:hidden mt-1 flex gap-2">
                                                    <Tag
                                                        color="default"
                                                        className="m-0 border-none bg-gray-100 text-[10px]"
                                                    >
                                                        {author.nationality}
                                                    </Tag>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 hidden md:table-cell">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <GlobalOutlined className="text-gray-400" />
                                                    {author.nationality}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Tag
                                                    icon={<BookOutlined />}
                                                    color="cyan"
                                                    className="px-3 py-1 rounded-full border-none font-medium shadow-sm bg-cyan-50 text-cyan-700"
                                                >
                                                    {
                                                        author.idTypeBook
                                                            .nameTypeBook
                                                    }
                                                </Tag>
                                            </td>
                                            <td className="px-6 py-4 hidden lg:table-cell">
                                                <Tooltip
                                                    title={author.biography}
                                                    placement="topLeft"
                                                >
                                                    <p className="text-gray-500 text-sm max-w-xs line-clamp-2 leading-relaxed">
                                                        {author.biography ||
                                                            'Chưa có thông tin tiểu sử chi tiết.'}
                                                    </p>
                                                </Tooltip>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer hint */}
            <p className="text-center text-gray-400 text-sm mt-8">
                Mẹo: Nhấn vào một hàng để xem chi tiết thông tin tác giả.
            </p>
        </div>
    );
};

export default AuthorPage;
