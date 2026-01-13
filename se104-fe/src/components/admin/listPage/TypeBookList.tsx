import { useEffect, useState, useMemo } from 'react';
import { getTypeBooksAPI, deleteTypeBookAPI } from '@/services/api';
import {
    Table,
    message,
    Modal,
    Button,
    Space,
    Tooltip,
    Tag,
    Spin,
} from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    TagsOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import AddTypeBookModal from './AddTypeBookModal';
import EditTypeBookModal from './EditTypeBookModal';

interface Props {
    keyword: string;
}

interface ITypeBook {
    idTypeBook: string;
    nameTypeBook: string;
    description: string;
}

const TypeBookList = ({ keyword }: Props) => {
    const [typeBooks, setTypeBooks] = useState<ITypeBook[]>([]);
    const [loading, setLoading] = useState(true);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedBook, setSelectedBook] = useState<ITypeBook | null>(null);
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

    const fetchTypeBooks = async () => {
        setLoading(true);
        try {
            const res = await getTypeBooksAPI();
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

    const filteredData = useMemo(() => {
        if (!keyword) return typeBooks;
        return typeBooks.filter((tb) =>
            (tb.nameTypeBook || '')
                .toLowerCase()
                .includes(keyword.toLowerCase())
        );
    }, [typeBooks, keyword]);

    const handleEdit = (typeBook: ITypeBook) => {
        setSelectedBook(typeBook);
        setShowEditModal(true);
    };

    const confirmDelete = async () => {
        if (!pendingDeleteId) return;
        try {
            await deleteTypeBookAPI(pendingDeleteId);
            message.success('Đã xoá loại sách thành công!');
            fetchTypeBooks();
        } catch (err) {
            message.error(
                'Không thể xoá loại sách này (có thể đang có sách thuộc loại này).'
            );
        } finally {
            setPendingDeleteId(null);
        }
    };

    const pendingName = typeBooks.find(
        (t) => t.idTypeBook === pendingDeleteId
    )?.nameTypeBook;

    const columns: ColumnsType<ITypeBook> = [
        {
            title: 'Tên loại sách',
            dataIndex: 'nameTypeBook',
            key: 'nameTypeBook',
            sorter: (a, b) => a.nameTypeBook.localeCompare(b.nameTypeBook),
            render: (text) => (
                <div className="flex items-center gap-2">
                    <TagsOutlined className="text-[#153D36]" />
                    <span className="font-medium text-gray-800">{text}</span>
                </div>
            ),
        },
        {
            title: '',
            key: 'action',
            width: 90,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Sửa">
                        <Button
                            type="text"
                            size="small"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                            className="text-[#153D36] hover:!text-emerald-600 hover:!bg-emerald-50"
                        />
                    </Tooltip>
                    <Tooltip title="Xoá">
                        <Button
                            type="text"
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => setPendingDeleteId(record.idTypeBook)}
                            className="hover:!bg-red-50"
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    if (loading)
        return (
            <div className="h-64 flex justify-center items-center">
                <Spin tip="Đang tải dữ liệu..." size="large" />
            </div>
        );

    return (
        <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <span className="text-sm text-gray-500">
                    Hiển thị <span className="font-semibold text-[#153D36]">{filteredData.length}</span> loại sách
                </span>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    className="bg-[#153D36] border-none rounded-lg h-9 px-5 shadow-sm hover:!bg-[#12352e]"
                    onClick={() => setShowAddModal(true)}
                >
                    Thêm loại sách
                </Button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="idTypeBook"
                    scroll={{ x: 500 }}
                    size="middle"
                    pagination={{
                        pageSize: 8,
                        showSizeChanger: false,
                        showTotal: (total) => (
                            <span className="text-gray-500 text-sm">
                                Tổng <span className="font-semibold text-[#153D36]">{total}</span> loại sách
                            </span>
                        ),
                    }}
                    locale={{ emptyText: 'Không có dữ liệu' }}
                />
            </div>

            {/* Delete Modal */}
            <Modal
                title={
                    <span className="text-[#153D36] font-semibold">
                        Xác nhận xoá
                    </span>
                }
                open={!!pendingDeleteId}
                onOk={confirmDelete}
                onCancel={() => setPendingDeleteId(null)}
                okText="Xoá"
                cancelText="Huỷ"
                okButtonProps={{ danger: true }}
                centered
                width={400}
            >
                <div className="py-4 text-center">
                    <p className="text-gray-600 mb-3">
                        Bạn có chắc muốn xoá loại sách này không?
                    </p>
                    <Tag color="red" className="text-base px-4 py-1">
                        {pendingName}
                    </Tag>
                    <p className="text-red-500 text-xs mt-3">
                        * Hành động này không thể hoàn tác
                    </p>
                </div>
            </Modal>

            {/* Add Modal */}
            <AddTypeBookModal
                open={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSuccess={fetchTypeBooks}
            />

            {/* Edit Modal */}
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
        </>
    );
};

export default TypeBookList;
