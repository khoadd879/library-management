import { useEffect, useState, useMemo } from 'react';
import {
    Table,
    message,
    Modal,
    Avatar,
    Tag,
    Button,
    Space,
    Tooltip,
    Typography,
    Card,
} from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
    deleteAuthorAPI,
    getListAuthor,
    getTypeBooksAPI,
    updateAuthorAPI,
} from '@/services/api';
import UpdateAuthorModal from '../user/UpdateAuthorModal';

interface Props {
    keyword: string;
}

// === SỬA INTERFACE TẠI ĐÂY ===
// Thêm | null vào các trường có thể rỗng
interface IAuthor {
    idAuthor: string;
    nameAuthor: string;
    nationality: string | null;
    biography: string | null;
    urlAvatar: string | null; // <-- Khắc phục lỗi chính
    idTypeBook: {
        idTypeBook: string;
        nameTypeBook: string;
    };
}

const AuthorList = ({ keyword }: Props) => {
    // State
    const [authors, setAuthors] = useState<IAuthor[]>([]);
    const [loading, setLoading] = useState(true);
    const [typeBookOptions, setTypeBookOptions] = useState<
        { value: string; label: string }[]
    >([]);

    // Modal state
    const [openModal, setOpenModal] = useState(false);
    const [selectedAuthor, setSelectedAuthor] = useState<IAuthor | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Delete state
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // 1. Fetch Type Books
    useEffect(() => {
        const fetchTypeBooks = async () => {
            try {
                const res = await getTypeBooksAPI();
                const listData = res.data || [];
                const options = listData.map((item: any) => ({
                    value: item.idTypeBook,
                    label: item.nameTypeBook,
                }));
                setTypeBookOptions(options);
            } catch (err) {
                console.error('Lỗi khi lấy thể loại sách:', err);
            }
        };
        fetchTypeBooks();
    }, []);

    // 2. Fetch Authors List
    const loadAuthors = async () => {
        setLoading(true);
        try {
            const res = await getListAuthor();
            setAuthors(res.data || []);
        } catch (err) {
            console.error('Lỗi khi tải tác giả:', err);
            message.error('Không thể tải danh sách tác giả.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAuthors();
    }, []);

    // 3. Filter Logic
    const filteredAuthors = useMemo(() => {
        if (!keyword) return authors;
        return authors.filter((author) =>
            (author.nameAuthor || '')
                .toLowerCase()
                .includes(keyword.toLowerCase())
        );
    }, [authors, keyword]);

    // 4. Handlers
    const handleEdit = (author: IAuthor) => {
        setSelectedAuthor(author);
        setOpenModal(true);
    };

    const handleUpdateSubmit = async (formData: FormData) => {
        if (!selectedAuthor) return;
        setIsSubmitting(true);
        try {
            await updateAuthorAPI(selectedAuthor.idAuthor, formData);
            message.success('Cập nhật tác giả thành công!');
            setOpenModal(false);
            loadAuthors();
        } catch (err) {
            console.error(err);
            message.error('Cập nhật tác giả thất bại!');
        } finally {
            setIsSubmitting(false);
        }
    };

    const confirmDelete = async () => {
        if (!pendingDeleteId) return;
        setIsDeleting(true);
        try {
            await deleteAuthorAPI(pendingDeleteId);
            message.success('Đã xoá tác giả thành công!');
            loadAuthors();
        } catch (err) {
            console.error('Lỗi khi xoá tác giả:', err);
            message.error('Xoá tác giả thất bại!');
        } finally {
            setIsDeleting(false);
            setPendingDeleteId(null);
        }
    };

    // 5. Columns Configuration
    const columns: ColumnsType<IAuthor> = [
        {
            title: 'Photo',
            dataIndex: 'urlAvatar',
            key: 'urlAvatar',
            align: 'center',
            width: 80,
            render: (url) => (
                <Avatar
                    src={url}
                    icon={<UserOutlined />}
                    size="large"
                    className="border border-gray-200"
                />
            ),
        },
        {
            title: 'Tên tác giả',
            dataIndex: 'nameAuthor',
            key: 'nameAuthor',
            render: (text) => (
                <span className="font-medium text-[#153D36]">{text}</span>
            ),
            sorter: (a, b) => a.nameAuthor.localeCompare(b.nameAuthor),
        },
        {
            title: 'Thể loại',
            dataIndex: ['idTypeBook', 'nameTypeBook'],
            key: 'typeBook',
            render: (text) => <Tag color="cyan">{text || 'Chưa cập nhật'}</Tag>,
        },
        {
            title: 'Quốc tịch',
            dataIndex: 'nationality',
            key: 'nationality',
            render: (text) => text || '---',
        },
        {
            title: 'Tiểu sử',
            dataIndex: 'biography',
            key: 'biography',
            width: 300,
            render: (text) => (
                <Typography.Paragraph
                    ellipsis={{ rows: 2, expandable: true, symbol: 'Xem thêm' }}
                    className="mb-0 text-gray-600 text-sm"
                >
                    {text || 'Chưa có thông tin'}
                </Typography.Paragraph>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            width: 120,
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="text"
                            icon={<EditOutlined className="text-blue-600" />}
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Xoá">
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => setPendingDeleteId(record.idAuthor)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const pendingAuthorName = authors.find(
        (a) => a.idAuthor === pendingDeleteId
    )?.nameAuthor;

    return (
        <Card
            className="shadow-sm rounded-xl border-none"
            bodyStyle={{ padding: 0 }}
        >
            <Table
                columns={columns}
                dataSource={filteredAuthors}
                rowKey="idAuthor"
                loading={loading}
                pagination={{
                    pageSize: 5,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '20'],
                    showTotal: (total) => `Tổng ${total} tác giả`,
                }}
                locale={{ emptyText: 'Không tìm thấy tác giả nào' }}
            />

            {/* Modal Edit */}
            {selectedAuthor && (
                <UpdateAuthorModal
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    initialData={{
            
                        nameAuthor: selectedAuthor.nameAuthor || '',
                        nationality: selectedAuthor.nationality || '',
                        idTypeBook: selectedAuthor.idTypeBook?.idTypeBook || '',
                        biography: selectedAuthor.biography || '',
                        urlAvatar: selectedAuthor.urlAvatar, // Avatar null thì Component Upload tự xử lý
                    }}
                    typeBookOptions={typeBookOptions}
                    onSubmit={handleUpdateSubmit}
                    isLoading={isSubmitting}
                />
            )}

            {/* Modal Delete Confirmation */}
            <Modal
                title="Xác nhận xoá"
                open={!!pendingDeleteId}
                onOk={confirmDelete}
                onCancel={() => setPendingDeleteId(null)}
                okText="Xoá ngay"
                cancelText="Huỷ bỏ"
                okButtonProps={{ danger: true, loading: isDeleting }}
                centered
            >
                <div className="text-center py-4">
                    <p className="text-gray-600">
                        Bạn có chắc chắn muốn xoá tác giả này không?
                    </p>
                    <p className="font-bold text-lg mt-1 text-[#153D36]">
                        {pendingAuthorName || 'Tác giả này'}
                    </p>
                    <p className="text-red-500 text-xs mt-2">
                        *Hành động này không thể hoàn tác.
                    </p>
                </div>
            </Modal>
        </Card>
    );
};

export default AuthorList;
