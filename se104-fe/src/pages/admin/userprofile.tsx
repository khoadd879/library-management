import React, { useEffect, useState } from "react";
import {
  addRoleAPI,
  addRolePermissionAPI,
  deleteRoleAPI,
  getAllRolesAPI,
  getPermissionsByRoleAPI,
  deleteRolePermissionAPI,
} from "@/services/api";
import {
  message,
  Button,
  Input,
  Select,
  Checkbox,
  Modal,
  Card,
  Divider,
} from "antd";

const { Option } = Select;

const ALL_PERMISSIONS = [
  "receiveBooks", //
  "manageUsers",
  "borrowBooks", //
  "viewLists", //
  "viewReports", //
  "parameter",
  "chat",
];

const RolePermissionUI = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [currentPermissions, setCurrentPermissions] = useState<string[]>([]);
  const [editPermissions, setEditPermissions] = useState<string[]>([]);
  const [newRoleName, setNewRoleName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newRolePermissions, setNewRolePermissions] = useState<string[]>([]);

  const fetchRoles = async () => {
    try {
      const res = await getAllRolesAPI();
      setRoles(res);
    } catch (err) {
      message.error("Không thể tải vai trò.");
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
      message.error("Lỗi khi tải quyền.");
    }
  };

  const handleAddRole = async () => {
    try {
      await addRoleAPI(newRoleName, newDescription);
      for (const perm of newRolePermissions) {
        await addRolePermissionAPI(newRoleName, perm);
      }
      message.success("Đã thêm vai trò mới");
      setNewRoleName("");
      setNewDescription("");
      setNewRolePermissions([]);
      fetchRoles();
    } catch (err) {
      message.error("Thêm vai trò thất bại");
    }
  };

  const handleDelete = async (roleName: string) => {
    Modal.confirm({
      title: `Xóa vai trò "${roleName}"?`,
      onOk: async () => {
        try {
          await deleteRoleAPI(roleName);
          message.success("Đã xóa vai trò");
          fetchRoles();
        } catch (err) {
          message.error("Xóa thất bại");
        }
      },
    });
  };

  const handleUpdatePermissions = async () => {
    if (!selectedRole) return;
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

      message.success("Cập nhật quyền thành công");
      fetchPermissions(selectedRole);
    } catch (err) {
      message.error("Lỗi cập nhật quyền");
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white shadow-md rounded-md space-y-6">
      <h2 className="text-2xl font-bold text-center">
        Quản lý Vai Trò và Quyền
      </h2>

      <Card title="Tạo Vai Trò Mới" bordered={false}>
        <Input
          placeholder="Tên vai trò"
          value={newRoleName}
          onChange={(e) => setNewRoleName(e.target.value)}
          style={{ marginBottom: "8px" }}
        />
        <Input.TextArea
          placeholder="Mô tả"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          style={{ marginBottom: "8px" }}
          rows={2}
        />
        <Checkbox.Group
          options={ALL_PERMISSIONS}
          value={newRolePermissions}
          onChange={(val) => setNewRolePermissions(val as string[])}
        />
        <div className="mt-4">
          <Button type="primary" onClick={handleAddRole}>
            Thêm Vai Trò
          </Button>
        </div>
      </Card>

      <Card title="Cập Nhật Quyền">
        <Select
          placeholder="Chọn vai trò"
          style={{ width: "100%" }}
          onChange={(val) => {
            setSelectedRole(val);
            fetchPermissions(val);
          }}
        >
          {roles.map((r) => (
            <Option key={r.id} value={r.roleName}>
              {r.roleName}
            </Option>
          ))}
        </Select>

        {selectedRole && (
          <div className="mt-4">
            <h4 className="mb-2 font-medium">Danh sách quyền:</h4>
            <Checkbox.Group
              options={ALL_PERMISSIONS}
              value={editPermissions}
              onChange={(val) => setEditPermissions(val as string[])}
            />
            <div className="mt-3">
              <Button type="primary" onClick={handleUpdatePermissions}>
                Lưu Quyền
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Danh sách vai trò */}
      <Card title="Danh Sách Vai Trò" bordered={false}>
        <ul className="divide-y">
          {roles.map((r) => (
            <li key={r.id} className="flex justify-between py-2">
              <span>{r.roleName}</span>
              <Button
                danger
                size="small"
                onClick={() => handleDelete(r.roleName)}
              >
                Xóa
              </Button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default RolePermissionUI;
