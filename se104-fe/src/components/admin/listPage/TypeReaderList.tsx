import { useEffect, useState, useMemo } from 'react';
import { getTypeReadersAPI, deleteTypeReaderAPI } from '@/services/api';
import {
    Spin,
    message,
    Modal,
    Table,
    Button,
    Space,
    Tooltip,
    Tag,
} from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    SolutionOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import AddTypeReaderModal from './AddTypeReaderModal';
import EditTypeReaderModal from './EditTypeReaderModal';

interface ITypeReader {
    idTypeReader: string;
    nameTypeReader: string;
    description?: string;
}

interface Props {
    keyword: string;
}

const TypeReaderList = ({ keyword }: Props) => {
    const [typeReaders, setTypeReaders] = useState<ITypeReader[]>([]);
    const [loading, setLoading] = useState(true);

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedReader, setSelectedReader] = useState<ITypeReader | null>(null);
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

    const fetchTypeReaders = async () => {
        setLoading(true);
        try {
            const res = await getTypeReadersAPI();
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

    const filteredData = useMemo(() => {
        if (!keyword) return typeReaders;
        return typeReaders.filter((type) =>
            (type.nameTypeReader || '')
                .toLowerCase()
                .includes(keyword.toLowerCase())
        );
    }, [typeReaders, keyword]);

    const handleEdit = (type: ITypeReader) => {
        setSelectedReader(type);
        setShowEditModal(true);
    };

    const confirmDelete = async () => {
        if (!pendingDeleteId) return;
        try {
            await deleteTypeReaderAPI(pendingDeleteId);
            message.success('Đã xoá loại độc giả thành công!');
            fetchTypeReaders();
        } catch (err) {
            console.error('Lỗi khi xoá:', err);
            message.error('Không thể xoá loại độc giả này.');
        } finally {
            setPendingDeleteId(null);
        }
    };

    const pendingName = typeReaders.find(
        (t) => t.idTypeReader === pendingDeleteId
    )?.nameTypeReader;

    const columns: ColumnsType<ITypeReader> = [
        {
            title: 'Tên loại độc giả',
            dataIndex: 'nameTypeReader',
            key: 'nameTypeReader',
            sorter: (a, b) => a.nameTypeReader.localeCompare(b.nameTypeReader),
            render: (text) => (
                <div className="flex items-center gap-2">
                    <SolutionOutlined className="text-[#153D36]" />
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
                            onClick={() => setPendingDeleteId(record.idTypeReader)}
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
                    Hiển thị <span className="font-semibold text-[#153D36]">{filteredData.length}</span> loại
                </span>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    className="bg-[#153D36] border-none rounded-lg h-9 px-5 shadow-sm hover:!bg-[#12352e]"
                    onClick={() => setShowAddModal(true)}
                >
                    Thêm mới
                </Button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    rowKey="idTypeReader"
                    scroll={{ x: 500 }}
                    size="middle"
                    pagination={{
                        pageSize: 8,
                        showSizeChanger: false,
                        showTotal: (total) => (
                            <span className="text-gray-500 text-sm">
                                Tổng <span className="font-semibold text-[#153D36]">{total}</span> loại
                            </span>
                        ),
                    }}
                    locale={{ emptyText: 'Không tìm thấy dữ liệu' }}
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
                        Bạn có chắc muốn xoá loại độc giả này không?
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
            <AddTypeReaderModal
                open={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSuccess={fetchTypeReaders}
            />

            {/* Edit Modal */}
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
        </>
    );
};

export default TypeReaderList;
