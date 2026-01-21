import { useEffect, useState, useMemo } from 'react';
import {
    Table,
    Button,
    Tag,
    Space,
    Modal,
    message,
    Image,
    Typography,
    Tooltip,
} from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
    getAllBooksAndCommentsAPI,
    deleteBookAPI,
    getListAuthor,
    getTypeBooksAPI,
    updateBookAPI,
    addBookAPI,
} from '@/services/api';
import UpdateBookModal from '../user/UpdateBookModal';
import AddBookModal from './AddBookModal';

const { Text } = Typography;

const BookList = ({ keyword }: { keyword: string }) => {
    const [books, setBooks] = useState<IBook[]>([]);
    const [loading, setLoading] = useState(true);
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
    const [selectedBook, setSelectedBook] = useState<IBook | null>(null);
    const [typeBooks, setTypeBooks] = useState<
        { value: string; label: string }[]
    >([]);
    const [authors, setAuthors] = useState<
        { id: string; nameAuthor: string }[]
    >([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const idUser = localStorage.getItem('idUser');
            if (!idUser) {
                message.warning('Vui lòng đăng nhập lại');
                return;
            }
            const res = await getAllBooksAndCommentsAPI(idUser);
            setBooks(res.data || []);
        } catch (error) {
            console.error('Lỗi khi tải danh sách sách:', error);
            message.error('Không thể tải danh sách sách');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const confirmDelete = async () => {
        if (!pendingDeleteId) return;
        try {
            await deleteBookAPI(pendingDeleteId);
            message.success('Đã xoá sách thành công!');
            fetchBooks();
        } catch (err) {
            message.error('Không thể xoá sách!');
        } finally {
            setPendingDeleteId(null);
        }
    };

    const loadFormData = async () => {
        const [typeRes, authorRes] = await Promise.all([
            getTypeBooksAPI(),
            getListAuthor(),
        ]);

        const typeListData = Array.isArray(typeRes)
            ? typeRes
            : typeRes?.data || [];
        setTypeBooks(
            typeListData.map((t: any) => ({
                value: t.idTypeBook,
                label: t.nameTypeBook,
            })),
        );

        const authorListData = Array.isArray(authorRes)
            ? authorRes
            : authorRes?.data || [];
        setAuthors(
            authorListData.map((a: any) => ({
                id: a.idAuthor,
                nameAuthor: a.nameAuthor,
            })),
        );
    };

    const openUpdateModal = async (book: IBook) => {
        try {
            await loadFormData();
            setSelectedBook(book);
        } catch (err) {
            console.error('Lỗi tải dữ liệu:', err);
            message.error('Lỗi tải dữ liệu');
        }
    };

    const openAddModal = async () => {
        try {
            await loadFormData();
            setIsAddModalOpen(true);
        } catch (err) {
            console.error('Lỗi tải dữ liệu:', err);
            message.error('Lỗi tải dữ liệu thể loại và tác giả');
        }
    };

    const handleUpdateBook = async (idBook: string, formData: FormData) => {
        setIsUpdating(true);
        try {
            await updateBookAPI(idBook, formData);
            message.success('Cập nhật thành công!');
            fetchBooks();
            setSelectedBook(null);
        } catch (err) {
            message.error('Cập nhật thất bại!');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleAddBook = async (formData: FormData) => {
        setIsAdding(true);
        try {
            const res = await addBookAPI(formData);
            // Axios interceptor returns response.data directly
            // Check if response indicates failure
            if (res?.success === false) {
                message.error(res?.message || 'Thêm sách thất bại!');
                return;
            }
            message.success('Thêm sách thành công!');
            fetchBooks();
            setIsAddModalOpen(false);
        } catch (err: any) {
            console.error('Lỗi thêm sách:', err);

            // Axios interceptor returns error.response.data directly as err
            // So err might be the data object directly
            let errorMsg = 'Thêm sách thất bại!';

            if (err?.errors) {
                // Handle validation errors object from ASP.NET: { "FieldName": ["error1", "error2"], ... }
                const errorMessages = Object.entries(err.errors)
                    .map(
                        ([field, messages]) =>
                            `${field}: ${(messages as string[]).join(', ')}`,
                    )
                    .join('; ');
                errorMsg = errorMessages || err?.title || errorMsg;
            } else if (err?.message) {
                // Handle custom error message from BE (e.g., regulation violations)
                errorMsg = err.message;
            } else if (err?.title) {
                errorMsg = err.title;
            } else if (typeof err === 'string') {
                errorMsg = err;
            }

            message.error(errorMsg);
        } finally {
            setIsAdding(false);
        }
    };

    const filteredBooks = useMemo(() => {
        return books.filter((book) =>
            (book.nameBook || '').toLowerCase().includes(keyword.toLowerCase()),
        );
    }, [books, keyword]);

    const columns: ColumnsType<IBook> = [
        {
            title: 'Sách',
            key: 'book',
            fixed: 'left',
            width: 280,
            render: (_, record) => (
                <div className="flex items-center gap-3">
                    <Image
                        src={record.image}
                        alt={record.nameBook}
                        width={45}
                        height={60}
                        className="rounded object-cover flex-shrink-0"
                        fallback="https://via.placeholder.com/45x60?text=No"
                        preview={false}
                    />
                    <div className="min-w-0">
                        <p className="font-semibold text-gray-800 m-0 text-sm line-clamp-2">
                            {record.nameBook}
                        </p>
                        <p className="text-xs text-gray-400 m-0 truncate">
                            {record.publisher || 'NXB chưa rõ'}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            title: 'Tác giả',
            dataIndex: 'authors',
            key: 'authors',
            width: 160,
            render: (authors: any[]) => (
                <div className="flex flex-wrap gap-1">
                    {authors?.slice(0, 2).map((a) => (
                        <Tag
                            key={a.idAuthor}
                            color="cyan"
                            className="text-xs border-none"
                        >
                            {a.nameAuthor}
                        </Tag>
                    ))}
                    {authors?.length > 2 && (
                        <Tag className="text-xs border-none bg-gray-100">
                            +{authors.length - 2}
                        </Tag>
                    )}
                </div>
            ),
        },
        {
            title: 'Giá trị',
            dataIndex: 'valueOfbook',
            key: 'value',
            width: 110,
            sorter: (a, b) => (a.valueOfbook || 0) - (b.valueOfbook || 0),
            render: (val) => (
                <Text className="text-[#153D36] font-semibold text-sm">
                    {val?.toLocaleString()}đ
                </Text>
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
                            onClick={() => openUpdateModal(record)}
                            className="text-[#153D36] hover:!text-emerald-600 hover:!bg-emerald-50"
                        />
                    </Tooltip>
                    <Tooltip title="Xoá">
                        <Button
                            type="text"
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => setPendingDeleteId(record.idBook)}
                            className="hover:!bg-red-50"
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                        Hiển thị{' '}
                        <span className="font-semibold text-[#153D36]">
                            {filteredBooks.length}
                        </span>{' '}
                        sách
                    </span>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={openAddModal}
                    className="bg-[#153D36] border-none rounded-lg h-9 px-5 shadow-sm hover:!bg-[#12352e]"
                >
                    Thêm sách
                </Button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <Table
                    columns={columns}
                    dataSource={filteredBooks}
                    rowKey="idBook"
                    loading={loading}
                    scroll={{ x: 600 }}
                    size="middle"
                    pagination={{
                        pageSize: 8,
                        showSizeChanger: false,
                        showTotal: (total) => (
                            <span className="text-gray-500 text-sm">
                                Tổng{' '}
                                <span className="font-semibold text-[#153D36]">
                                    {total}
                                </span>{' '}
                                sách
                            </span>
                        ),
                    }}
                    locale={{ emptyText: 'Không tìm thấy sách' }}
                />
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                title={
                    <span className="flex items-center gap-2 text-[#153D36]">
                        <ExclamationCircleOutlined className="text-red-500" />
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
                        Bạn có chắc muốn xoá sách này không?
                    </p>
                    <Tag color="red" className="text-base px-4 py-1">
                        {
                            books.find((b) => b.idBook === pendingDeleteId)
                                ?.nameBook
                        }
                    </Tag>
                </div>
            </Modal>

            {/* Update Book Modal */}
            {selectedBook && (
                <UpdateBookModal
                    open={!!selectedBook}
                    onClose={() => setSelectedBook(null)}
                    initialData={{
                        idBook: selectedBook.idBook,
                        nameHeaderBook: selectedBook.nameBook,
                        describeBook: selectedBook.describe,
                        idTypeBook:
                            selectedBook.authors[0]?.idTypeBook?.idTypeBook ||
                            '',
                        idAuthors: selectedBook.authors.map((a) => a.idAuthor),
                        publisher: selectedBook.publisher || '',
                        reprintYear: selectedBook.reprintYear || 2024,
                        valueOfBook: selectedBook.valueOfbook || 0,
                        imageUrl: selectedBook.image || undefined,
                    }}
                    authors={authors}
                    typeBooks={typeBooks}
                    onSubmit={handleUpdateBook}
                    isLoading={isUpdating}
                />
            )}

            {/* Add Book Modal */}
            <AddBookModal
                open={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                authors={authors}
                typeBooks={typeBooks}
                onSubmit={handleAddBook}
                isLoading={isAdding}
            />
        </>
    );
};

export default BookList;
