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

interface IAuthor {
    idAuthor: string;
    nameAuthor: string;
    nationality: string | null;
    biography: string | null;
    urlAvatar: string | null;
    idTypeBook: {
        idTypeBook: string;
        nameTypeBook: string;
    };
}

const AuthorList = ({ keyword }: Props) => {
    const [authors, setAuthors] = useState<IAuthor[]>([]);
    const [loading, setLoading] = useState(true);
    const [typeBookOptions, setTypeBookOptions] = useState<
        { value: string; label: string }[]
    >([]);

    const [openModal, setOpenModal] = useState(false);
    const [selectedAuthor, setSelectedAuthor] = useState<IAuthor | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

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

    const filteredAuthors = useMemo(() => {
        if (!keyword) return authors;
        return authors.filter((author) =>
            (author.nameAuthor || '')
                .toLowerCase()
                .includes(keyword.toLowerCase())
        );
    }, [authors, keyword]);

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

    const columns: ColumnsType<IAuthor> = [
        {
            title: 'Tác giả',
            key: 'author',
            fixed: 'left',
            width: 220,
            render: (_, record) => (
                <div className="flex items-center gap-3">
                    <Avatar
                        src={record.urlAvatar}
                        icon={<UserOutlined />}
                        size={40}
                        className="border-2 border-emerald-100 flex-shrink-0"
                    />
                    <div className="min-w-0">
                        <p className="font-semibold text-gray-800 m-0 text-sm truncate">
                            {record.nameAuthor}
                        </p>
                        <p className="text-xs text-gray-400 m-0">
                            {record.nationality || 'Không rõ'}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            title: 'Thể loại',
            dataIndex: ['idTypeBook', 'nameTypeBook'],
            key: 'typeBook',
            width: 140,
            render: (text) => (
                <Tag color="cyan" className="border-none">
                    {text || 'Chưa phân loại'}
                </Tag>
            ),
        },
        {
            title: 'Tiểu sử',
            dataIndex: 'biography',
            key: 'biography',
            ellipsis: true,
            render: (text) => (
                <Typography.Paragraph
                    ellipsis={{ rows: 2 }}
                    className="mb-0 text-gray-600 text-sm"
                >
                    {text || 'Chưa có thông tin'}
                </Typography.Paragraph>
            ),
        },
        {
            title: '',
            key: 'action',
            fixed: 'right',
            width: 90,
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
                            onClick={() => setPendingDeleteId(record.idAuthor)}
                            className="hover:!bg-red-50"
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
        <>
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <Table
                    columns={columns}
                    dataSource={filteredAuthors}
                    rowKey="idAuthor"
                    loading={loading}
                    scroll={{ x: 600 }}
                    size="middle"
                    pagination={{
                        pageSize: 8,
                        showSizeChanger: false,
                        showTotal: (total) => (
                            <span className="text-gray-500 text-sm">
                                Tổng <span className="font-semibold text-[#153D36]">{total}</span> tác giả
                            </span>
                        ),
                    }}
                    locale={{ emptyText: 'Không tìm thấy tác giả nào' }}
                />
            </div>

            {selectedAuthor && (
                <UpdateAuthorModal
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    initialData={{
                        nameAuthor: selectedAuthor.nameAuthor || '',
                        nationality: selectedAuthor.nationality || '',
                        idTypeBook: selectedAuthor.idTypeBook?.idTypeBook || '',
                        biography: selectedAuthor.biography || '',
                        urlAvatar: selectedAuthor.urlAvatar,
                    }}
                    typeBookOptions={typeBookOptions}
                    onSubmit={handleUpdateSubmit}
                    isLoading={isSubmitting}
                />
            )}

            <Modal
                title={
                    <span className="text-[#153D36] font-semibold">
                        Xác nhận xoá tác giả
                    </span>
                }
                open={!!pendingDeleteId}
                onOk={confirmDelete}
                onCancel={() => setPendingDeleteId(null)}
                okText="Xoá"
                cancelText="Huỷ"
                okButtonProps={{ danger: true, loading: isDeleting }}
                centered
                width={400}
            >
                <div className="py-4 text-center">
                    <p className="text-gray-600 mb-3">
                        Bạn có chắc muốn xoá tác giả này không?
                    </p>
                    <Tag color="red" className="text-base px-4 py-1">
                        {pendingAuthorName || 'Tác giả này'}
                    </Tag>
                    <p className="text-red-500 text-xs mt-3">
                        * Hành động này không thể hoàn tác
                    </p>
                </div>
            </Modal>
        </>
    );
};

export default AuthorList;
