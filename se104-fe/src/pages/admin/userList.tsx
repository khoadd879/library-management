import { useEffect, useState } from "react";
import { Button, Table, Space, message, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import {
  deleteReaderAPI,
  getListReader,
  getTypeReadersAPI,
  updateReaderAPI,
} from "@/services/api";
import UpdateReaderModal from "@/components/admin/user/UpdateReaderModal";

const UserList = () => {
  const [users, setUsers] = useState<IReader[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IReader | null>(null);
  const [typeReaderOptions, setTypeReaderOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const fetchUsers = async () => {
    try {
      const res = await getListReader();
      setUsers(res);
    } catch (err) {
      console.error("Lỗi khi tải người dùng:", err);
      message.error("Lỗi khi tải người dùng.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTypeReaderOptions = async () => {
    try {
      const res = await getTypeReadersAPI();
      const options = res.map((item: any) => ({
        value: item.idTypeReader,
        label: item.nameTypeReader,
      }));
      setTypeReaderOptions(options);
    } catch (err) {
      console.error("Lỗi khi tải loại độc giả:", err);
    }
  };

  const handleEdit = (user: IReader) => {
    setSelectedUser(user);
    setIsOpen(true);
  };

  const handleUpdate = async (formData: FormData) => {
    if (!selectedUser) return;
    setIsSubmitting(true);
    try {
      formData.append("ReaderPassword", selectedUser.ReaderPassword);
      await updateReaderAPI(selectedUser.idReader, formData);
      message.success("Cập nhật người dùng thành công!");
      await fetchUsers();
      setIsOpen(false);
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      message.error("Cập nhật thất bại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: "Xác nhận xoá người dùng?",
      content: "Hành động này sẽ không thể hoàn tác.",
      okText: "Xoá",
      okButtonProps: { danger: true },
      cancelText: "Huỷ",
      onOk: async () => {
        try {
          await deleteReaderAPI(id);
          message.success("Đã xoá người dùng.");
          fetchUsers();
        } catch (err) {
          console.error("Lỗi khi xoá:", err);
          message.error("Không thể xoá người dùng.");
        }
      },
    });
  };

  useEffect(() => {
    fetchUsers();
    fetchTypeReaderOptions();
  }, []);

  const columns = [
    {
      title: "Tên",
      dataIndex: "nameReader",
      key: "nameReader",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: IReader) => (
        <Space>
          <Button onClick={() => handleEdit(record)}>Sửa</Button>
          <Button danger onClick={() => handleDelete(record.idReader)}>
            Xoá
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Danh sách người dùng</h2>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="idReader"
        loading={loading}
        bordered
      />

      {selectedUser && (
        <UpdateReaderModal
          open={isOpen}
          onClose={() => setIsOpen(false)}
          initialData={{
            nameReader: selectedUser.nameReader,
            email: selectedUser.email,
            dob: selectedUser.dob,
            sex: selectedUser.sex,
            address: selectedUser.address,
            phone: selectedUser.phone,
            idTypeReader: selectedUser.idTypeReader.idTypeReader,
            urlAvatar: selectedUser.urlAvatar,
            readerPassword: selectedUser.ReaderPassword,
          }}
          typeReaderOptions={typeReaderOptions}
          onSubmit={handleUpdate}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
};

export default UserList;
