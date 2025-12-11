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
    Tag,
    Space,
    Typography,
} from 'antd';
import {
    PlusOutlined,
    DeleteOutlined,
    SaveOutlined,
    EditOutlined,
    UserOutlined,
    KeyOutlined,
    UnorderedListOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;

const ALL_PERMISSIONS = [
    'receiveBooks',
    'manageUsers',
    'borrowBooks',
    'viewLists',
    'viewReports',
    'parameter',
    'chat',
];

const permissionLabels: Record<string, string> = {
    receiveBooks: 'Tiếp nhận sách',
    manageUsers: 'Quản lý người dùng',
    borrowBooks: 'Mượn trả sách',
    viewLists: 'Xem danh sách',
    viewReports: 'Xem báo cáo',
    parameter: 'Tham số hệ thống',
    chat: 'Trò chuyện',
};

const RolePermissionUI = () => {
    const [roles, setRoles] = useState<any[]>([]);
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [currentPermissions, setCurrentPermissions] = useState<string[]>([]);
    const [editPermissions, setEditPermissions] = useState<string[]>([]);
    const [newRoleName, setNewRoleName] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newRolePermissions, setNewRolePermissions] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState('create');

    const fetchRoles = async () => {
        try {
            const res = await getAllRolesAPI();
            console.log(res);
            const res1 =
                res.data?.filter((r: any) => r.roleName !== 'Reader') || [];
            setRoles(res1);
        } catch (err) {
            message.error('Không thể tải vai trò.');
            console.log(err);
        }
    };

    const fetchPermissions = async (roleName: string) => {
        try {
            const res = await getPermissionsByRoleAPI(roleName);
            const permissionNames = (Array.isArray(res) ? res : []).map(
                (p: any) => p.permissionName
            );
            setCurrentPermissions(permissionNames);
            setEditPermissions(permissionNames);
        } catch (err) {
            message.error('Lỗi khi tải quyền.');
        }
    };

    const handleAddRole = async () => {
        if (!newRoleName.trim()) {
            message.warning('Vui lòng nhập tên vai trò');
            return;
        }

        try {
            await addRoleAPI(newRoleName, newDescription);
            for (const perm of newRolePermissions) {
                await addRolePermissionAPI(newRoleName, perm);
            }
            message.success('Đã thêm vai trò mới');
            setNewRoleName('');
            setNewDescription('');
            setNewRolePermissions([]);
            fetchRoles();
        } catch (err) {
            message.error('Thêm vai trò thất bại');
        }
    };

    const handleDelete = async (roleName: string) => {
        Modal.confirm({
            title: `Xóa vai trò "${roleName}"?`,
            content: 'Bạn có chắc chắn muốn xóa vai trò này?',
            okText: 'Xóa',
            cancelText: 'Hủy',
            okButtonProps: {
                danger: true,
                style: { background: '#ff4d4f', borderColor: '#ff4d4f' },
            },
            onOk: async () => {
                try {
                    await deleteRoleAPI(roleName);
                    message.success('Đã xóa vai trò');
                    fetchRoles();
                } catch (err) {
                    message.error('Xóa thất bại');
                }
            },
        });
    };

    const handleUpdatePermissions = async () => {
        if (!selectedRole) return;

        if (editPermissions.length === 0) {
            message.warning('Vui lòng chọn ít nhất một quyền');
            return;
        }

        try {
            const added = editPermissions.filter(
                (p) => !currentPermissions.includes(p)
            );
            const removed = currentPermissions.filter(
                (p) => !editPermissions.includes(p)
            );

            for (const perm of added) {
                await addRolePermissionAPI(selectedRole, perm);
            }

            for (const perm of removed) {
                await deleteRolePermissionAPI(selectedRole, perm);
            }

            message.success('Cập nhật quyền thành công');
            fetchPermissions(selectedRole);
        } catch (err) {
            message.error('Lỗi cập nhật quyền');
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    const primaryColor = '#153D36';
    const lightPrimary = '#E8F5F2';
    const secondaryColor = '#27AE60';

    return (
        <div
            className="p-6 max-w-6xl mx-auto min-h-screen"
            style={{ background: '#f5f5f5' }}
        >
            <div
                className="bg-white p-6 rounded-xl shadow-sm"
                style={{ borderTop: `4px solid ${primaryColor}` }}
            >
                <div className="flex justify-between items-center mb-6">
                    <Title
                        level={2}
                        className="mb-0"
                        style={{ color: primaryColor }}
                    >
                        <Space>
                            <KeyOutlined />
                            <span>Quản lý Phân Quyền</span>
                        </Space>
                    </Title>

                    <Space>
                        <Button
                            type={
                                activeTab === 'create' ? 'primary' : 'default'
                            }
                            icon={<PlusOutlined />}
                            onClick={() => setActiveTab('create')}
                            style={
                                activeTab === 'create'
                                    ? {
                                          background: secondaryColor,
                                          borderColor: secondaryColor,
                                      }
                                    : {}
                            }
                        >
                            Tạo vai trò
                        </Button>
                        <Button
                            type={
                                activeTab === 'manage' ? 'primary' : 'default'
                            }
                            icon={<EditOutlined />}
                            onClick={() => setActiveTab('manage')}
                            style={
                                activeTab === 'manage'
                                    ? {
                                          background: secondaryColor,
                                          borderColor: secondaryColor,
                                      }
                                    : {}
                            }
                        >
                            Quản lý quyền
                        </Button>
                    </Space>
                </div>

                {activeTab === 'create' ? (
                    <Card
                        title={
                            <Space>
                                <UserOutlined />
                                <span>Tạo Vai Trò Mới</span>
                            </Space>
                        }
                        variant="borderless"
                        className="shadow-sm"
                        styles={{
                            header: {
                                background: lightPrimary,
                                borderBottom: `1px solid ${lightPrimary}`,
                                color: primaryColor,
                            },
                        }}
                    >
                        <div className="space-y-6">
                            <div>
                                <Text
                                    strong
                                    className="block mb-2"
                                    style={{ color: primaryColor }}
                                >
                                    Thông tin vai trò
                                </Text>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Input
                                            placeholder="Tên vai trò*"
                                            value={newRoleName}
                                            onChange={(e) =>
                                                setNewRoleName(e.target.value)
                                            }
                                            size="large"
                                            prefix={<EditOutlined />}
                                        />
                                    </div>
                                    <div>
                                        <Input.TextArea
                                            placeholder="Mô tả (tuỳ chọn)"
                                            value={newDescription}
                                            onChange={(e) =>
                                                setNewDescription(
                                                    e.target.value
                                                )
                                            }
                                            rows={1}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <Text
                                    strong
                                    className="block mb-2"
                                    style={{ color: primaryColor }}
                                >
                                    Phân Quyền
                                </Text>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {ALL_PERMISSIONS.map((perm) => (
                                            <div
                                                key={perm}
                                                className="flex items-center"
                                            >
                                                <Checkbox
                                                    value={perm}
                                                    checked={newRolePermissions.includes(
                                                        perm
                                                    )}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setNewRolePermissions(
                                                                [
                                                                    ...newRolePermissions,
                                                                    perm,
                                                                ]
                                                            );
                                                        } else {
                                                            setNewRolePermissions(
                                                                newRolePermissions.filter(
                                                                    (p) =>
                                                                        p !==
                                                                        perm
                                                                )
                                                            );
                                                        }
                                                    }}
                                                    className="mr-2"
                                                >
                                                    <Tag
                                                        color={
                                                            newRolePermissions.includes(
                                                                perm
                                                            )
                                                                ? secondaryColor
                                                                : 'default'
                                                        }
                                                        style={{
                                                            borderRadius: '4px',
                                                            padding: '2px 8px',
                                                        }}
                                                    >
                                                        {permissionLabels[
                                                            perm
                                                        ] || perm}
                                                    </Tag>
                                                </Checkbox>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3">
                                <Button
                                    size="large"
                                    onClick={() => {
                                        setNewRoleName('');
                                        setNewDescription('');
                                        setNewRolePermissions([]);
                                    }}
                                >
                                    Đặt lại
                                </Button>
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={handleAddRole}
                                    size="large"
                                    style={{
                                        background: secondaryColor,
                                        borderColor: secondaryColor,
                                    }}
                                >
                                    Tạo Vai Trò
                                </Button>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Danh sách vai trò */}
                        <Card
                            title={
                                <Space>
                                    <UnorderedListOutlined />
                                    <span>Danh Sách Vai Trò</span>
                                </Space>
                            }
                            variant="borderless"
                            className="shadow-sm"
                            styles={{
                                header: {
                                    background: lightPrimary,
                                    borderBottom: `1px solid ${lightPrimary}`,
                                    color: primaryColor,
                                },
                            }}
                        >
                            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                                {roles.map((r) => (
                                    <div
                                        key={r.roleName}
                                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                            selectedRole === r.roleName
                                                ? `border-[${secondaryColor}] bg-[${lightPrimary}]`
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                        onClick={() => {
                                            setSelectedRole(r.roleName);
                                            fetchPermissions(r.roleName);
                                        }}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <Text
                                                    strong
                                                    className="text-gray-800"
                                                >
                                                    {r.roleName}
                                                </Text>
                                                {r.description && (
                                                    <Text
                                                        type="secondary"
                                                        className="block text-sm mt-1"
                                                    >
                                                        {r.description}
                                                    </Text>
                                                )}
                                            </div>
                                            <Button
                                                danger
                                                icon={<DeleteOutlined />}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(r.roleName);
                                                }}
                                                size="small"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        {/* Cập nhật quyền */}
                        <div className="lg:col-span-2">
                            <Card
                                title={
                                    <Space>
                                        <KeyOutlined />
                                        <span>Phân Quyền Chi Tiết</span>
                                    </Space>
                                }
                                variant="borderless"
                                className="shadow-sm h-full"
                                styles={{
                                    header: {
                                        background: lightPrimary,
                                        borderBottom: `1px solid ${lightPrimary}`,
                                        color: primaryColor,
                                    },
                                }}
                            >
                                {selectedRole ? (
                                    <div className="space-y-6">
                                        <div>
                                            <Text strong className="block mb-1">
                                                Vai trò đang chọn:
                                            </Text>
                                            <Tag
                                                color={secondaryColor}
                                                style={{
                                                    fontSize: '14px',
                                                    padding: '4px 10px',
                                                }}
                                            >
                                                {selectedRole}
                                            </Tag>
                                        </div>

                                        <div>
                                            <Text
                                                strong
                                                className="block mb-3"
                                                style={{ color: primaryColor }}
                                            >
                                                Danh sách quyền hạn
                                            </Text>
                                            <div className="bg-gray-50 p-4 rounded-lg">
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                    {ALL_PERMISSIONS.map(
                                                        (perm) => (
                                                            <div
                                                                key={perm}
                                                                className="flex items-center"
                                                            >
                                                                <Checkbox
                                                                    value={perm}
                                                                    checked={editPermissions.includes(
                                                                        perm
                                                                    )}
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        if (
                                                                            e
                                                                                .target
                                                                                .checked
                                                                        ) {
                                                                            setEditPermissions(
                                                                                [
                                                                                    ...editPermissions,
                                                                                    perm,
                                                                                ]
                                                                            );
                                                                        } else {
                                                                            setEditPermissions(
                                                                                editPermissions.filter(
                                                                                    (
                                                                                        p
                                                                                    ) =>
                                                                                        p !==
                                                                                        perm
                                                                                )
                                                                            );
                                                                        }
                                                                    }}
                                                                    className="mr-2"
                                                                >
                                                                    <Tag
                                                                        color={
                                                                            editPermissions.includes(
                                                                                perm
                                                                            )
                                                                                ? secondaryColor
                                                                                : 'default'
                                                                        }
                                                                        style={{
                                                                            borderRadius:
                                                                                '4px',
                                                                            padding:
                                                                                '2px 8px',
                                                                        }}
                                                                    >
                                                                        {permissionLabels[
                                                                            perm
                                                                        ] ||
                                                                            perm}
                                                                    </Tag>
                                                                </Checkbox>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end">
                                            <Button
                                                type="primary"
                                                icon={<SaveOutlined />}
                                                onClick={
                                                    handleUpdatePermissions
                                                }
                                                size="large"
                                                style={{
                                                    background: secondaryColor,
                                                    borderColor: secondaryColor,
                                                }}
                                                disabled={
                                                    editPermissions.length === 0
                                                }
                                            >
                                                Cập Nhật Quyền
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="text-gray-400 mb-4">
                                            <KeyOutlined
                                                style={{ fontSize: '32px' }}
                                            />
                                        </div>
                                        <Text type="secondary">
                                            Vui lòng chọn một vai trò từ danh
                                            sách để phân quyền
                                        </Text>
                                    </div>
                                )}
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RolePermissionUI;
