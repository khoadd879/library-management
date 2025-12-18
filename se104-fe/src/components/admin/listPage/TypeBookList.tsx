import { useEffect, useState, useMemo } from 'react';
import { getTypeBooksAPI, deleteTypeBookAPI } from '@/services/api';
import {
    Table,
    message,
    Modal,
    Button,
    Space,
    Tooltip,
    Card,
    Tag,
    Typography,
} from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    TagsOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import AddTypeBookModal from './AddTypeBookModal';
import EditTypeBookModal from './EditTypeBookModal';

const { Text } = Typography;
const { confirm } = Modal;

interface Props {
    keyword: string;
}

interface ITypeBook {
    idTypeBook: string;
    nameTypeBook: string;
    description: string;
}

const TypeBookList = ({ keyword }: Props) => {
    // --- State ---
    const [typeBooks, setTypeBooks] = useState<ITypeBook[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState<ITypeBook | null>(null);

    // 1. Fetch Data
    const fetchTypeBooks = async () => {
        setLoading(true);
        try {
            const res = await getTypeBooksAPI();
            // Xử lý an toàn dữ liệu trả về
            const data = Array.isArray(res) ? res : res.data || [];
            setTypeBooks(data);
        } catch (err) {
            console.error('Lỗi khi tải loại sách:', err);
            message.error('Không thể tải danh sách loại sách.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTypeBooks();
    }, []);

    // 2. Filter Logic (useMemo)
    const filteredData = useMemo(() => {
        if (!keyword) return typeBooks;
        return typeBooks.filter((tb) =>
            (tb.nameTypeBook || '')
                .toLowerCase()
                .includes(keyword.toLowerCase())
        );
    }, [typeBooks, keyword]);

    // 3. Handlers
    const showDeleteConfirm = (id: string, name: string) => {
        confirm({
            title: 'Xác nhận xoá loại sách',
            icon: <ExclamationCircleOutlined className="text-red-500" />,
            content: (
                <div>
                    Bạn có chắc chắn muốn xoá loại sách{' '}
                    <strong className="text-[#153D36]">{name}</strong>?
                    <br />
                    <span className="text-xs text-red-500 italic">
                        * Hành động này không thể hoàn tác.
                    </span>
                </div>
            ),
            okText: 'Xoá ngay',
            okType: 'danger',
            cancelText: 'Huỷ',
            onOk: async () => {
                try {
                    await deleteTypeBookAPI(id);
                    message.success('Đã xoá loại sách thành công!');
                    fetchTypeBooks();
                } catch (err) {
                    message.error(
                        'Không thể xoá loại sách này (có thể đang có sách thuộc loại này).'
                    );
                }
            },
        });
    };

    const handleEdit = (typeBook: ITypeBook) => {
        setSelectedBook(typeBook);
        setShowEditModal(true);
    };

    // 4. Columns Configuration
    const columns: ColumnsType<ITypeBook> = [
        {
            title: 'ID',
            dataIndex: 'idTypeBook',
            key: 'idTypeBook',
            width: 300,
            render: (text) => (
                <Text type="secondary" className="text-xs">
                    {text}
                </Text>
            ),
        },
        {
            title: 'Tên loại sách',
            dataIndex: 'nameTypeBook',
            key: 'nameTypeBook',
            sorter: (a, b) => a.nameTypeBook.localeCompare(b.nameTypeBook),
            render: (text) => (
                <Tag
                    icon={<TagsOutlined />}
                    color="cyan"
                    className="text-sm py-1 px-3"
                >
                    {text}
                </Tag>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            width: 150,
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="text"
                            icon={<EditOutlined className="text-blue-600" />}
                            onClick={() => handleEdit(record)}
                            className="hover:bg-blue-50"
                        />
                    </Tooltip>
                    <Tooltip title="Xoá">
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() =>
                                showDeleteConfirm(
                                    record.idTypeBook,
                                    record.nameTypeBook
                                )
                            }
                            className="hover:bg-red-50"
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div className="space-y-4">
            {/* Header Toolbar */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2">
                    <TagsOutlined className="text-xl text-[#153D36]" />
                    <h2 className="text-lg font-bold text-[#153D36] m-0">
                        Quản lý Loại sách
                    </h2>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    className="bg-[#153D36] border-none rounded-lg h-10 px-6 shadow-md hover:!bg-[#12352e]"
                    onClick={() => setShowAddModal(true)}
                >
                    Thêm loại sách
                </Button>
            </div>

            {/* Main Table */}
            <Card
                className="shadow-sm rounded-xl border-none"
                bodyStyle={{ padding: 0 }}
            >
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="idTypeBook"
                    loading={loading}
                    pagination={{
                        pageSize: 8,
                        showTotal: (total) => `Tổng ${total} loại sách`,
                        showSizeChanger: false, // Ẩn đổi size trang nếu ít dữ liệu
                    }}
                    locale={{ emptyText: 'Không có dữ liệu' }}
                />
            </Card>

            {/* Modals */}
            <AddTypeBookModal
                open={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSuccess={fetchTypeBooks}
            />

            {selectedBook && (
                <EditTypeBookModal
                    open={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    onSuccess={fetchTypeBooks}
                    initialData={{
                        idTypeBook: selectedBook.idTypeBook,
                        nameTypeBook: selectedBook.nameTypeBook,
                    }}
                />
            )}
        </div>
    );
};

export default TypeBookList;
