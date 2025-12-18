import { useEffect, useState, useMemo } from 'react';
import { getTypeReadersAPI, deleteTypeReaderAPI } from '@/services/api';
import {
    Spin,
    message,
    Modal,
    Table,
    Button,
    Card,
    Space,
    Tooltip,
    Tag,
    Typography,
} from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    SolutionOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import AddTypeReaderModal from './AddTypeReaderModal';
import EditTypeReaderModal from './EditTypeReaderModal';

const { Text } = Typography;
const { confirm } = Modal;

interface ITypeReader {
    idTypeReader: string;
    nameTypeReader: string;
    description?: string;
}

interface Props {
    keyword: string;
}

const TypeReaderList = ({ keyword }: Props) => {
    // --- State ---
    const [typeReaders, setTypeReaders] = useState<ITypeReader[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedReader, setSelectedReader] = useState<ITypeReader | null>(
        null
    );

    // 1. Fetch Data
    const fetchTypeReaders = async () => {
        setLoading(true);
        try {
            const res = await getTypeReadersAPI();
            // Fix lỗi logic: Phải fallback về mảng rỗng [] chứ không phải string ''
            const data = Array.isArray(res) ? res : res.data || [];
            setTypeReaders(data);
        } catch (error) {
            console.error('Lỗi khi tải loại độc giả:', error);
            message.error('Không thể tải danh sách loại độc giả!');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTypeReaders();
    }, []);

    // 2. Filter Logic (useMemo)
    const filteredData = useMemo(() => {
        if (!keyword) return typeReaders;
        return typeReaders.filter((type) =>
            (type.nameTypeReader || '')
                .toLowerCase()
                .includes(keyword.toLowerCase())
        );
    }, [typeReaders, keyword]);

    // 3. Handlers
    const handleEdit = (type: ITypeReader) => {
        setSelectedReader(type);
        setShowEditModal(true);
    };

    // Sử dụng Modal.confirm của Antd cho chuyên nghiệp và gọn code
    const showDeleteConfirm = (id: string, name: string) => {
        confirm({
            title: 'Xác nhận xoá loại độc giả',
            icon: <ExclamationCircleOutlined className="text-red-500" />,
            content: (
                <div>
                    Bạn có chắc muốn xoá loại độc giả{' '}
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
                    await deleteTypeReaderAPI(id);
                    message.success('Đã xoá loại độc giả thành công!');
                    fetchTypeReaders();
                } catch (err) {
                    console.error('Lỗi khi xoá:', err);
                    message.error('Không thể xoá loại độc giả này.');
                }
            },
        });
    };

    // 4. Columns Configuration
    const columns: ColumnsType<ITypeReader> = [
        {
            title: 'ID',
            dataIndex: 'idTypeReader',
            key: 'idTypeReader',
            width: 300,
            render: (text) => (
                <Text type="secondary" className="text-xs">
                    {text}
                </Text>
            ),
        },
        {
            title: 'Tên loại độc giả',
            dataIndex: 'nameTypeReader',
            key: 'nameTypeReader',
            sorter: (a, b) => a.nameTypeReader.localeCompare(b.nameTypeReader),
            render: (text) => (
                <Tag
                    icon={<SolutionOutlined />}
                    color="geekblue"
                    className="text-sm py-1 px-3 font-medium"
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
                                    record.idTypeReader,
                                    record.nameTypeReader
                                )
                            }
                            className="hover:bg-red-50"
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
        <div className="space-y-4">
            {/* Header Toolbar */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2">
                    <SolutionOutlined className="text-xl text-[#153D36]" />
                    <h2 className="text-lg font-bold text-[#153D36] m-0">
                        Quản lý Loại độc giả
                    </h2>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    className="bg-[#153D36] border-none rounded-lg h-10 px-6 shadow-md hover:!bg-[#12352e]"
                    onClick={() => setShowAddModal(true)}
                >
                    Thêm mới
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
                    rowKey="idTypeReader"
                    pagination={{
                        pageSize: 8,
                        showTotal: (total) => `Tổng ${total} loại`,
                        showSizeChanger: false,
                    }}
                    locale={{ emptyText: 'Không tìm thấy dữ liệu' }}
                />
            </Card>

            {/* Modals */}
            <AddTypeReaderModal
                open={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSuccess={fetchTypeReaders}
            />

            {selectedReader && (
                <EditTypeReaderModal
                    open={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    onSuccess={fetchTypeReaders}
                    initialData={{
                        idTypeReader: selectedReader.idTypeReader,
                        nameTypeReader: selectedReader.nameTypeReader,
                    }}
                />
            )}
        </div>
    );
};

export default TypeReaderList;
