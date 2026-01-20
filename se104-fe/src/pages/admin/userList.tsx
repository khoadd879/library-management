import { useEffect, useState } from "react";
import { Button, Table, Space, message, Modal, Spin } from "antd";
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
    setLoading(true);
    try {
      const res = await getListReader();
      setUsers(res.data);
    } catch (err) {
      console.error("Lỗi khi tải người dùng:", err);
      message.error("Lỗi khi tải người dùng.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTypeReaderOptions = async () => {
    try {
      const data = await getTypeReadersAPI();
      const res = data.data;
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
      formData.append("ReaderPassword", selectedUser.ReaderPassword || "");
      const res: any = await updateReaderAPI(selectedUser.idReader, formData);
      const responseData = res?.data || res;

      if (responseData?.success === false || responseData?.statusCode === 400) {
        const backendMsg =
          responseData?.message || "Lỗi cập nhật (không rõ nguyên nhân)";
        message.error(backendMsg);

        return;
      }

      message.success("Cập nhật người dùng thành công!");
      setIsOpen(false);
      await fetchUsers();
    } catch (err: any) {
      console.error("Lỗi cập nhật:", err);
      const errorMsg =
        err?.response?.data?.message || err?.message || "Cập nhật thất bại!";
      message.error(errorMsg);
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
        setLoading(true);
        try {
          await deleteReaderAPI(id);
          message.success("Đã xoá người dùng.");
          fetchUsers();
        } catch (err) {
          console.error("Lỗi khi xoá:", err);
          message.error("Không thể xoá người dùng.");
        } finally {
          setLoading(false);
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
      render: (text: string) => (
        <span className="font-medium text-gray-800">{text}</span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text: string) => <span className="text-gray-600">{text}</span>,
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (text: string) => (
        <span className="text-[#27AE60] font-semibold">{text}</span>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: IReader) => (
        <Space>
          <Button
            type="primary"
            className="!bg-[#27AE60] !border-[#2e7d32] hover:!bg-[#4caf50] hover:!border-[#4caf50]"
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button
            danger
            className="hover:!bg-red-600"
            onClick={() => handleDelete(record.idReader)}
          >
            Xoá
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-[#f1f8e9] to-[#e8f5e9]">
      <div className="bg-white rounded-xl shadow-lg p-6 border border-[#e0e0e0]">
        <h2 className="text-2xl font-bold mb-6 text-[#27AE60]">
          Danh sách người dùng
        </h2>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="idReader"
          loading={false}
          bordered
          className="rounded-lg overflow-hidden"
          pagination={{
            pageSize: 8,
            showSizeChanger: false,
            className: "px-4 py-2 bg-[#f5f5f5] rounded-b-lg",
          }}
        />
      </div>
      {(loading || isSubmitting) && (
        <div className="fixed inset-0 z-50 bg-white/70 flex items-center justify-center">
          <Spin
            size="large"
            // tip={loading ? 'Đang tải dữ liệu...' : 'Đang xử lý...'}
            className="text-[#2e7d32]"
          />
        </div>
      )}
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
