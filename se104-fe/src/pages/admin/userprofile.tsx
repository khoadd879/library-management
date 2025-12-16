import { useEffect, useState } from 'react';
import {
    addRoleAPI,
    addRolePermissionAPI,
    deleteRoleAPI,
    getAllRolesAPI,
    getPermissionsByRoleAPI,
    deleteRolePermissionAPI,
} from '@/services/api';
import {
    message,
    Button,
    Input,
    Checkbox,
    Modal,
    Card,
    Space,
    Typography,
    Spin,
    Badge,
} from 'antd';
import {
    PlusOutlined,
    DeleteOutlined,
    SaveOutlined,
    EditOutlined,
    CheckSquareOutlined,
    BorderOutlined,
    SecurityScanOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

// Danh sách các key chính xác từ Database (cột permission_name)
const ALL_PERMISSIONS = [
    'borrowBooks',
    'chat',
    'manageUsers',
    'parameter',
    'receiveBooks',
    'viewLists',
    'viewReports',
];

// Map key sang tên hiển thị (description)
const permissionLabels: Record<string, string> = {
    borrowBooks: 'Mượn trả sách',
    chat: 'Trò chuyện',
    manageUsers: 'Quản lý người dùng',
    parameter: 'Tham số hệ thống',
    receiveBooks: 'Tiếp nhận sách',
    viewLists: 'Xem danh sách (Thêm độc giả/tác giả)',
    viewReports: 'Xem báo cáo',
};

const RolePermissionUI = () => {
    const [roles, setRoles] = useState<any[]>([]);
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [currentPermissions, setCurrentPermissions] = useState<string[]>([]);
    const [editPermissions, setEditPermissions] = useState<string[]>([]);

    const [newRoleName, setNewRoleName] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newRolePermissions, setNewRolePermissions] = useState<string[]>([]);

    const [activeTab, setActiveTab] = useState<'create' | 'manage'>('manage');
    const [loading, setLoading] = useState(false);
    const [loadingPerms, setLoadingPerms] = useState(false);

    const fetchRoles = async () => {
        setLoading(true);
        try {
            const res = await getAllRolesAPI();

            const data = res.data || res || [];
            const list = Array.isArray(data) ? data : [];
            const filtered = list.filter((r: any) => r.roleName !== 'Reader');
            setRoles(filtered);
        } catch (err) {
            console.error(err);
            message.error('Không thể tải danh sách vai trò.');
        } finally {
            setLoading(false);
        }
    };

    const fetchPermissions = async (roleName: string) => {
        setLoadingPerms(true);
        setCurrentPermissions([]);
        setEditPermissions([]);

        try {
            const res = await getPermissionsByRoleAPI(roleName);
            console.log('API Response cho role:', roleName, res);

            // Xử lý dữ liệu trả về từ API
            // Giả sử API trả về mảng object dạng: [{ permissionName: "borrowBooks", ... }, ...]
            const apiData = res.data?.data || res.data || [];

            if (Array.isArray(apiData)) {
                // Bước quan trọng: Chỉ lấy giá trị của cột permissionName
                const mappedKeys = apiData.map((item: any) => {
                    // Đảm bảo item.permissionName khớp với cột trong DB bạn chụp
                    return item.permissionName;
                });

                console.log('Các quyền đã có (Keys):', mappedKeys);

                // Cập nhật state để Checkbox tự động "tick"
                setCurrentPermissions(mappedKeys);
                setEditPermissions(mappedKeys);
            }
        } catch (err) {
            console.error(err);
            message.error('Lỗi tải quyền hạn.');
        } finally {
            setLoadingPerms(false);
        }
    };

    const handleUpdatePermissions = async () => {
        if (!selectedRole) return;
        if (editPermissions.length === 0) {
            message.warning('Vai trò cần có ít nhất một quyền.');
            return;
        }

        setLoadingPerms(true);
        try {
            const added = editPermissions.filter(
                (p) => !currentPermissions.includes(p)
            );
            const removed = currentPermissions.filter(
                (p) => !editPermissions.includes(p)
            );

            const promises = [
                ...added.map((p) => addRolePermissionAPI(selectedRole, p)),
                ...removed.map((p) => deleteRolePermissionAPI(selectedRole, p)),
            ];

            await Promise.all(promises);
            message.success('Cập nhật quyền thành công!');

            // Refresh lại
            await fetchPermissions(selectedRole);
        } catch (err) {
            console.error(err);
            message.error('Có lỗi xảy ra khi lưu.');
        } finally {
            setLoadingPerms(false);
        }
    };

    const handleSelectAll = (checked: boolean) => {
        setEditPermissions(checked ? [...ALL_PERMISSIONS] : []);
    };

    const handleAddRole = async () => {
        if (!newRoleName.trim()) return message.warning('Nhập tên vai trò');
        setLoading(true);
        try {
            await addRoleAPI(newRoleName, newDescription);
            for (const perm of newRolePermissions)
                await addRolePermissionAPI(newRoleName, perm);
            message.success('Tạo vai trò thành công');
            setNewRoleName('');
            setNewDescription('');
            setNewRolePermissions([]);
            fetchRoles();
            setActiveTab('manage');
        } catch (e) {
            message.error('Thất bại');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRole = (name: string) => {
        Modal.confirm({
            title: `Xóa vai trò ${name}?`,
            content: 'Hành động này không thể hoàn tác.',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await deleteRoleAPI(name);
                    message.success('Đã xóa');
                    if (selectedRole === name) setSelectedRole(null);
                    fetchRoles();
                } catch (e) {
                    message.error('Lỗi xóa');
                }
            },
        });
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const colors = {
        primary: '#153D36',
        secondary: '#27AE60',
        bgSelected: '#F0FDF4',
        borderSelected: '#27AE60',
        textMuted: '#64748B',
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 font-sans">
            <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header Section */}
                <div className="px-8 py-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white">
                    <div>
                        <Title
                            level={3}
                            style={{
                                color: colors.primary,
                                margin: 0,
                                fontWeight: 700,
                            }}
                        >
                            <SecurityScanOutlined className="mr-2" /> Quản trị
                            Phân Quyền
                        </Title>
                        <Text type="secondary" className="mt-1 block">
                            Quản lý vai trò và phân cấp quyền truy cập hệ thống
                        </Text>
                    </div>

                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <Button
                            type="text"
                            onClick={() => setActiveTab('manage')}
                            className={
                                activeTab === 'manage'
                                    ? 'bg-white shadow-sm text-green-700 font-medium'
                                    : 'text-gray-500'
                            }
                        >
                            <EditOutlined /> Quản lý quyền
                        </Button>
                        <Button
                            type="text"
                            onClick={() => setActiveTab('create')}
                            className={
                                activeTab === 'create'
                                    ? 'bg-white shadow-sm text-green-700 font-medium'
                                    : 'text-gray-500'
                            }
                        >
                            <PlusOutlined /> Tạo vai trò mới
                        </Button>
                    </div>
                </div>

                <div className="p-6">
                    {activeTab === 'manage' ? (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[650px]">
                            {/* --- CỘT TRÁI: DANH SÁCH ROLE --- */}
                            <div className="lg:col-span-4 flex flex-col h-full border-r border-gray-100 pr-6">
                                <div className="mb-4 flex items-center justify-between">
                                    <Text
                                        strong
                                        className="text-gray-500 uppercase text-xs"
                                    >
                                        Danh sách vai trò
                                    </Text>
                                    <Badge
                                        count={roles.length}
                                        style={{
                                            backgroundColor: colors.secondary,
                                        }}
                                    />
                                </div>

                                <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                                    {loading ? (
                                        <div className="text-center py-10">
                                            <Spin />
                                        </div>
                                    ) : (
                                        roles.map((role) => (
                                            <div
                                                key={role.roleName}
                                                onClick={() => {
                                                    setSelectedRole(
                                                        role.roleName
                                                    );
                                                    fetchPermissions(
                                                        role.roleName
                                                    );
                                                }}
                                                className={`
                                                group relative p-4 rounded-xl cursor-pointer transition-all duration-200 border
                                                ${
                                                    selectedRole ===
                                                    role.roleName
                                                        ? `bg-[${colors.bgSelected}] border-green-500 shadow-md`
                                                        : 'bg-white border-gray-200 hover:border-green-300 hover:shadow-sm'
                                                }
                                            `}
                                                style={
                                                    selectedRole ===
                                                    role.roleName
                                                        ? {
                                                              backgroundColor:
                                                                  colors.bgSelected,
                                                              borderColor:
                                                                  colors.secondary,
                                                          }
                                                        : {}
                                                }
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div
                                                            className={`font-bold text-lg ${
                                                                selectedRole ===
                                                                role.roleName
                                                                    ? 'text-green-800'
                                                                    : 'text-gray-700'
                                                            }`}
                                                        >
                                                            {role.roleName}
                                                        </div>
                                                        <div className="text-sm text-gray-500 mt-1 line-clamp-1">
                                                            {role.description ||
                                                                'Chưa có mô tả'}
                                                        </div>
                                                    </div>
                                                    {role.roleName !==
                                                        'Admin' && (
                                                        <Button
                                                            type="text"
                                                            danger
                                                            icon={
                                                                <DeleteOutlined />
                                                            }
                                                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteRole(
                                                                    role.roleName
                                                                );
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* --- CỘT PHẢI: CHECKBOXES --- */}
                            <div className="lg:col-span-8 flex flex-col h-full">
                                {selectedRole ? (
                                    <>
                                        <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center mb-6 pb-4 border-b border-gray-100">
                                            <div>
                                                <Text className="text-xs font-bold text-gray-400 uppercase">
                                                    Đang chỉnh sửa cho
                                                </Text>
                                                <div className="text-3xl font-bold text-green-800 mt-1">
                                                    {selectedRole}
                                                </div>
                                            </div>
                                            <Space>
                                                <Button
                                                    size="middle"
                                                    icon={
                                                        <CheckSquareOutlined />
                                                    }
                                                    onClick={() =>
                                                        handleSelectAll(true)
                                                    }
                                                >
                                                    Chọn hết
                                                </Button>
                                                <Button
                                                    size="middle"
                                                    icon={<BorderOutlined />}
                                                    onClick={() =>
                                                        handleSelectAll(false)
                                                    }
                                                >
                                                    Bỏ chọn
                                                </Button>
                                            </Space>
                                        </div>

                                        <div className="flex-1 overflow-y-auto relative pr-2">
                                            {loadingPerms && (
                                                <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center backdrop-blur-sm">
                                                    <Spin
                                                        size="large"
                                                        tip="Đang đồng bộ quyền..."
                                                    />
                                                </div>
                                            )}

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {ALL_PERMISSIONS.map((perm) => {
                                                    const isChecked =
                                                        editPermissions.includes(
                                                            perm
                                                        );
                                                    return (
                                                        <div
                                                            key={perm}
                                                            onClick={() => {
                                                                if (isChecked)
                                                                    setEditPermissions(
                                                                        (
                                                                            prev
                                                                        ) =>
                                                                            prev.filter(
                                                                                (
                                                                                    p
                                                                                ) =>
                                                                                    p !==
                                                                                    perm
                                                                            )
                                                                    );
                                                                else
                                                                    setEditPermissions(
                                                                        (
                                                                            prev
                                                                        ) => [
                                                                            ...prev,
                                                                            perm,
                                                                        ]
                                                                    );
                                                            }}
                                                            className={`
                                                                relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                                                                flex items-center gap-4 group hover:shadow-md
                                                                ${
                                                                    isChecked
                                                                        ? 'bg-green-50 border-green-500'
                                                                        : 'bg-white border-gray-100 hover:border-green-200'
                                                                }
                                                            `}
                                                        >
                                                            {/* Custom Checkbox Size */}
                                                            <div className="flex-shrink-0">
                                                                <Checkbox
                                                                    checked={
                                                                        isChecked
                                                                    }
                                                                    className="scale-125"
                                                                    style={{
                                                                        accentColor:
                                                                            colors.secondary,
                                                                    }}
                                                                />
                                                            </div>

                                                            {/* Tách phần text ra để không bị dính */}
                                                            <div className="flex flex-col">
                                                                <span
                                                                    className={`font-bold text-base ${
                                                                        isChecked
                                                                            ? 'text-green-900'
                                                                            : 'text-gray-700 group-hover:text-green-700'
                                                                    }`}
                                                                >
                                                                    {
                                                                        permissionLabels[
                                                                            perm
                                                                        ]
                                                                    }
                                                                </span>
                                                                <span className="text-xs font-mono text-gray-400 mt-1 bg-gray-100 px-2 py-0.5 rounded w-fit">
                                                                    {perm}
                                                                </span>
                                                            </div>

                                                            {isChecked && (
                                                                <div className="absolute top-2 right-2 text-green-500 opacity-20">
                                                                    <SecurityScanOutlined
                                                                        style={{
                                                                            fontSize: 40,
                                                                        }}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center bg-white">
                                            <div className="text-sm text-gray-500 italic">
                                                *Thay đổi sẽ có hiệu lực ngay
                                                lập tức.
                                            </div>
                                            <Button
                                                type="primary"
                                                size="large"
                                                icon={<SaveOutlined />}
                                                onClick={
                                                    handleUpdatePermissions
                                                }
                                                loading={loadingPerms}
                                                style={{
                                                    background:
                                                        colors.secondary,
                                                    borderColor:
                                                        colors.secondary,
                                                    paddingLeft: 30,
                                                    paddingRight: 30,
                                                }}
                                                className="shadow-lg shadow-green-200 hover:shadow-xl"
                                            >
                                                Lưu Thay Đổi
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-300">
                                        <SecurityScanOutlined
                                            style={{
                                                fontSize: 64,
                                                marginBottom: 16,
                                                opacity: 0.5,
                                            }}
                                        />
                                        <Text
                                            type="secondary"
                                            className="text-lg"
                                        >
                                            Chọn một vai trò để bắt đầu phân
                                            quyền
                                        </Text>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-3xl mx-auto py-10">
                            <Card
                                title="Tạo Vai Trò Mới"
                                bordered={false}
                                className="shadow-lg border border-gray-100 rounded-xl"
                            >
                                <div className="space-y-6">
                                    <div>
                                        <Text strong>
                                            Tên vai trò{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Text>
                                        <Input
                                            size="large"
                                            placeholder="Nhập tên vai trò..."
                                            value={newRoleName}
                                            onChange={(e) =>
                                                setNewRoleName(e.target.value)
                                            }
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Text strong>Mô tả</Text>
                                        <Input.TextArea
                                            rows={2}
                                            placeholder="Mô tả vai trò..."
                                            value={newDescription}
                                            onChange={(e) =>
                                                setNewDescription(
                                                    e.target.value
                                                )
                                            }
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="pt-4">
                                        <Button
                                            type="primary"
                                            size="large"
                                            block
                                            onClick={handleAddRole}
                                            loading={loading}
                                            style={{
                                                background: colors.secondary,
                                            }}
                                        >
                                            Xác nhận tạo mới
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RolePermissionUI;
