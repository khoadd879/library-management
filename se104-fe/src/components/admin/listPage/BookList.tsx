import { useEffect, useState, useMemo } from 'react';
import {
    Table,
    Button,
    Tag,
    Space,
    Tooltip,
    Modal,
    message,
    Image,
    Typography,
    Card,
} from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    BookOutlined,
    UserOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
    getAllBooksAndCommentsAPI,
    deleteBookAPI,
    getListAuthor,
    getTypeBooksAPI,
    updateBookAPI,
} from '@/services/api';
import UpdateBookModal from '../user/UpdateBookModal';

const { Text, Paragraph } = Typography;

interface Props {
    keyword: string;
}

const BookList = ({ keyword }: Props) => {
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

    const openUpdateModal = async (book: IBook) => {
        try {
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
                }))
            );

            const authorListData = Array.isArray(authorRes)
                ? authorRes
                : authorRes?.data || [];
            setAuthors(
                authorListData.map((a: any) => ({
                    id: a.idAuthor,
                    nameAuthor: a.nameAuthor,
                }))
            );

            setSelectedBook(book);
        } catch (err) {
            message.error('Lỗi tải dữ liệu cập nhật');
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

    // Tối ưu lọc tìm kiếm với useMemo
    const filteredBooks = useMemo(() => {
        return books.filter((book) =>
            (book.nameBook || '').toLowerCase().includes(keyword.toLowerCase())
        );
    }, [books, keyword]);

    // Cấu hình các cột của bảng
    const columns: ColumnsType<IBook> = [
        {
            title: 'Bìa sách',
            dataIndex: 'image',
            key: 'image',
            width: 100,
            render: (src, record) => (
                <Image
                    src={src}
                    alt={record.nameBook}
                    width={60}
                    height={85}
                    className="rounded shadow-sm object-cover"
                    fallback="https://via.placeholder.com/60x85?text=No+Cover"
                />
            ),
        },
        {
            title: 'Thông tin sách',
            key: 'info',
            render: (_, record) => (
                // Tìm đến dòng 164 và sửa lại đoạn render thông tin sách:
                <Space direction="vertical" size={0}>
                    <Text strong className="text-[#153D36] text-base">
                        {record.nameBook}
                    </Text>
                    {/* Thay size="small" bằng class text-xs của Tailwind */}
                    <Text type="secondary" className="text-xs">
                        ID: {record.idBook}
                    </Text>
                </Space>
            ),
        },
        {
            title: 'Tác giả',
            dataIndex: 'authors',
            key: 'authors',
            render: (authors: any[]) => (
                <Space wrap>
                    {authors.map((a) => (
                        <Tag
                            icon={<UserOutlined />}
                            color="blue"
                            key={a.idAuthor}
                        >
                            {a.nameAuthor}
                        </Tag>
                    ))}
                </Space>
            ),
        },
        {
            title: 'Mô tả',
            dataIndex: 'describe',
            key: 'describe',
            width: 300,
            render: (text) => (
                <Paragraph
                    ellipsis={{ rows: 2, expandable: true, symbol: 'Xem thêm' }}
                    className="mb-0 text-gray-600"
                >
                    {text || 'Chưa có mô tả'}
                </Paragraph>
            ),
        },
        {
            title: 'Trị giá',
            dataIndex: 'valueOfbook',
            key: 'valueOfbook',
            sorter: (a, b) => (a.valueOfbook || 0) - (b.valueOfbook || 0),
            render: (val) => (
                <Text strong className="text-orange-600">
                    {val?.toLocaleString()}đ
                </Text>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="text"
                            icon={<EditOutlined className="text-blue-600" />}
                            onClick={() => openUpdateModal(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Xoá sách">
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => setPendingDeleteId(record.idBook)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <Card
            className="shadow-sm rounded-xl border-none"
            bodyStyle={{ padding: 0 }}
        >
            <Table
                columns={columns}
                dataSource={filteredBooks}
                rowKey="idBook"
                loading={loading}
                pagination={{
                    pageSize: 5,
                    showTotal: (total) => `Tổng số ${total} cuốn sách`,
                    className: 'px-4',
                }}
                locale={{ emptyText: 'Không tìm thấy sách phù hợp' }}
            />

            <Modal
                title={
                    <span>
                        <BookOutlined className="mr-2" />
                        Xác nhận xoá sách
                    </span>
                }
                open={!!pendingDeleteId}
                onOk={confirmDelete}
                onCancel={() => setPendingDeleteId(null)}
                okText="Xoá"
                cancelText="Huỷ"
                okButtonProps={{ danger: true }}
                centered
            >
                <p>
                    Bạn có chắc chắn muốn xoá cuốn sách{' '}
                    <strong>
                        {
                            books.find((b) => b.idBook === pendingDeleteId)
                                ?.nameBook
                        }
                    </strong>
                    ?
                </p>
                <Text type="danger" className="text-xs italic">
                    * Hành động này không thể hoàn tác.
                </Text>
            </Modal>

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
        </Card>
    );
};

export default BookList;
