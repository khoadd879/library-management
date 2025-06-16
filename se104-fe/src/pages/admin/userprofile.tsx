import React, { useEffect, useState } from "react";
import {
  addRoleAPI,
  addRolePermissionAPI,
  deleteRoleAPI,
  getAllRolesAPI,
  getPermissionsByRoleAPI,
  deleteRolePermissionAPI,
} from "@/services/api";
import { message, Button, Input, Select, Checkbox, Modal } from "antd";

const { Option } = Select;

const ALL_PERMISSIONS = [
  "receiveBooks",
  "manageUsers",
  "borrowBooks",
  "viewLists",
  "viewReports",
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
      const data = Array.isArray(res) ? res : [];
      const permissionNames = data.map((p: any) => p.permissionName);
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
      title: `Xóa vai trò ${roleName}?`,
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
        (perm) => !currentPermissions.includes(perm)
      );
      const removed = currentPermissions.filter(
        (perm) => !editPermissions.includes(perm)
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
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Quản lý Vai Trò</h2>

      <div className="mb-4">
        <Input
          placeholder="Tên vai trò mới"
          value={newRoleName}
          onChange={(e) => setNewRoleName(e.target.value)}
          className="mb-2"
        />
        <Input.TextArea
          placeholder="Mô tả"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          rows={2}
          className="mb-2"
        />
        <Checkbox.Group
          options={ALL_PERMISSIONS}
          value={newRolePermissions}
          onChange={(val) => setNewRolePermissions(val as string[])}
        />
        <Button type="primary" onClick={handleAddRole} className="mt-2">
          Thêm Vai Trò
        </Button>
      </div>

      <div className="mb-6">
        <Select
          placeholder="Chọn vai trò để xem quyền"
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
      </div>

      {selectedRole && (
        <div>
          <h3 className="font-semibold mb-2">Quyền hiện tại:</h3>
          <Checkbox.Group
            options={ALL_PERMISSIONS}
            value={editPermissions}
            onChange={(val) => setEditPermissions(val as string[])}
          />
          <Button
            type="primary"
            onClick={handleUpdatePermissions}
            className="mt-2"
          >
            Lưu Quyền
          </Button>
        </div>
      )}

      <div className="mt-8">
        <h3 className="font-semibold mb-2">Danh sách Vai Trò:</h3>
        <ul>
          {roles.map((r) => (
            <li key={r.id} className="flex justify-between items-center py-1">
              <span>{r.roleName}</span>
              <Button danger onClick={() => handleDelete(r.roleName)}>
                Xóa
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RolePermissionUI;
