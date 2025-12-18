import { useEffect, useState, useMemo } from 'react';
import {
    Table,
    Avatar,
    Button,
    Tag,
    Space,
    Tooltip,
    Modal,
    message,
    Card,
} from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    UserOutlined,
    PhoneOutlined,
    MailOutlined,
    EnvironmentOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
    deleteReaderAPI,
    getListReader,
    getTypeReadersAPI,
    updateReaderAPI,
} from '@/services/api';
import UpdateReaderModal from '../user/UpdateReaderModal';

// Interface chuẩn hóa dữ liệu
interface IReader {
    idReader: string;
    nameReader: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    urlAvatar: string | null;
    createDate: string;
    dob: string | null;
    sex: string | null;
    ReaderPassword?: string;
    role_name?: string;
    role?: string;
    idTypeReader: {
        idTypeReader: string;
        nameTypeReader: string;
    };
}

interface Props {
    keyword: string;
}

const ReaderList = ({ keyword }: Props) => {
    const [readers, setReaders] = useState<IReader[]>([]);
    const [loading, setLoading] = useState(true);
    const [typeReaderOptions, setTypeReaderOptions] = useState<
        { value: string; label: string }[]
    >([]);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedReader, setSelectedReader] = useState<IReader | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

    // 1. Fetch và Filter theo Role Reader
    const fetchReaders = async () => {
        setLoading(true);
        try {
            const res = await getListReader();
            const listReader = res.data || [];

            // Lọc danh sách: Kiểm tra cả role_name và role để đảm bảo lấy đúng Reader
            const fil = listReader.filter(
                (r: any) => r.role_name === 'Reader' || r.role === 'Reader'
            );
            setReaders(fil);
        } catch (err) {
            console.error('Lỗi khi tải độc giả:', err);
            message.error('Không thể tải danh sách độc giả');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReaders();
    }, []);

    // 2. Tải danh sách loại độc giả cho Modal
    useEffect(() => {
        const fetchTypeReaderOptions = async () => {
            try {
                const res = await getTypeReadersAPI();
                const listData = Array.isArray(res) ? res : res.data || [];
                const options = listData.map((item: any) => ({
                    value: item.idTypeReader,
                    label: item.nameTypeReader,
                }));
                setTypeReaderOptions(options);
            } catch (err) {
                console.error('Lỗi khi tải loại độc giả:', err);
            }
        };
        fetchTypeReaderOptions();
    }, []);

    // 3. Logic tìm kiếm (Client-side)
    const filteredReaders = useMemo(() => {
        if (!keyword) return readers;
        const lowerKeyword = keyword.toLowerCase();
        return readers.filter(
            (reader) =>
                (reader.nameReader || '')
                    .toLowerCase()
                    .includes(lowerKeyword) ||
                (reader.email || '').toLowerCase().includes(lowerKeyword)
        );
    }, [readers, keyword]);

    const handleEdit = (reader: IReader) => {
        setSelectedReader(reader);
        setIsOpen(true);
    };

    // 4. Xử lý cập nhật thông tin
    const handleUpdate = async (formData: FormData) => {
        if (!selectedReader) return;
        setIsSubmitting(true);
        try {
            // Gọi API update bằng formData từ UpdateReaderModal
            await updateReaderAPI(selectedReader.idReader, formData);

            message.success('Cập nhật độc giả thành công!');
            setIsOpen(false);
            fetchReaders(); // Tải lại danh sách sau khi lưu
        } catch (err) {
            console.error('Lỗi khi cập nhật:', err);
            message.error('Cập nhật thất bại, vui lòng thử lại!');
        } finally {
            setIsSubmitting(false);
        }
    };

    const confirmDelete = async () => {
        if (!pendingDeleteId) return;
        try {
            await deleteReaderAPI(pendingDeleteId);
            message.success('Đã xoá độc giả thành công!');
            fetchReaders();
        } catch (err) {
            console.error('Lỗi xoá độc giả:', err);
            message.error('Không thể xoá độc giả!');
        } finally {
            setPendingDeleteId(null);
        }
    };

    // 5. Định nghĩa các cột cho Table Ant Design
    const columns: ColumnsType<IReader> = [
        {
            title: 'Độc giả',
            key: 'info',
            width: 250,
            render: (_, record) => (
                <div className="flex items-center gap-3">
                    <Avatar
                        src={record.urlAvatar || ''}
                        size={48}
                        icon={<UserOutlined />}
                        className="border border-gray-200 shadow-sm flex-shrink-0"
                    />
                    <div className="flex flex-col">
                        <span className="font-semibold text-[#153D36] text-base">
                            {record.nameReader || 'Chưa cập nhật'}
                        </span>
                        <Tag
                            color="blue"
                            className="w-fit mt-1 border-none bg-blue-50 text-blue-600"
                        >
                            {record.idReader}
                        </Tag>
                    </div>
                </div>
            ),
        },
        {
            title: 'Liên hệ',
            key: 'contact',
            render: (_, record) => (
                <div className="flex flex-col gap-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <MailOutlined className="text-gray-400" />
                        <span>{record.email || '---'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <PhoneOutlined className="text-gray-400" />
                        <span>{record.phone || '---'}</span>
                    </div>
                </div>
            ),
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            key: 'address',
            render: (text) => (
                <div className="flex items-start gap-2 text-gray-600 max-w-[200px]">
                    <EnvironmentOutlined className="text-gray-400 mt-1" />
                    <span className="truncate">{text || '---'}</span>
                </div>
            ),
        },
        {
            title: 'Ngày lập thẻ',
            dataIndex: 'createDate',
            key: 'createDate',
            render: (date) => (
                <span className="text-gray-600">
                    {date ? new Date(date).toLocaleDateString('vi-VN') : '---'}
                </span>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            align: 'center',
            width: 120,
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Chỉnh sửa thông tin">
                        <Button
                            type="text"
                            icon={<EditOutlined className="text-blue-600" />}
                            onClick={() => handleEdit(record)}
                            className="hover:bg-blue-50"
                        />
                    </Tooltip>
                    <Tooltip title="Xoá độc giả">
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => setPendingDeleteId(record.idReader)}
                            className="hover:bg-red-50"
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const pendingReaderName = readers.find(
        (r) => r.idReader === pendingDeleteId
    )?.nameReader;

    return (
        <Card
            className="shadow-sm rounded-xl border-none"
            bodyStyle={{ padding: 0 }}
        >
            <Table
                columns={columns}
                dataSource={filteredReaders}
                rowKey="idReader"
                loading={loading}
                pagination={{
                    pageSize: 5,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '20'],
                    showTotal: (total) => `Tổng ${total} độc giả`,
                }}
                locale={{ emptyText: 'Không tìm thấy dữ liệu' }}
            />

            {selectedReader && (
                <UpdateReaderModal
                    open={isOpen}
                    onClose={() => setIsOpen(false)}
                    initialData={{
                        nameReader: selectedReader.nameReader || '',
                        email: selectedReader.email || '',
                        dob: selectedReader.dob || '',
                        sex: selectedReader.sex || '',
                        address: selectedReader.address || '',
                        phone: selectedReader.phone || '',
                        idTypeReader:
                            selectedReader.idTypeReader?.idTypeReader || '',
                        urlAvatar: selectedReader.urlAvatar,
                        readerPassword: selectedReader.ReaderPassword || '',
                        role_name:
                            selectedReader.role_name ||
                            selectedReader.role ||
                            'Reader',
                    }}
                    typeReaderOptions={typeReaderOptions}
                    onSubmit={handleUpdate}
                    isLoading={isSubmitting}
                />
            )}

            <Modal
                title="Xác nhận xoá"
                open={!!pendingDeleteId}
                onOk={confirmDelete}
                onCancel={() => setPendingDeleteId(null)}
                okText="Xoá ngay"
                cancelText="Huỷ bỏ"
                okButtonProps={{ danger: true }}
                centered
            >
                <div className="text-center py-4">
                    <p className="text-gray-600 mb-2">
                        Bạn có chắc chắn muốn xoá độc giả này khỏi hệ thống?
                    </p>
                    <div className="font-bold text-lg text-[#153D36] bg-gray-50 py-2 rounded">
                        {pendingReaderName || 'Độc giả này'}
                    </div>
                </div>
            </Modal>
        </Card>
    );
};

export default ReaderList;
