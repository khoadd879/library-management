import { useEffect, useState, useMemo } from "react";
import {
  Table,
  Avatar,
  Button,
  Tag,
  Space,
  Tooltip,
  Modal,
  message,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import {
  deleteReaderAPI,
  getListReader,
  getTypeReadersAPI,
  updateReaderAPI,
} from "@/services/api";
import UpdateReaderModal from "../user/UpdateReaderModal";

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

  const fetchReaders = async () => {
    setLoading(true);
    try {
      const res = await getListReader();
      const listReader = res.data || [];
      const fil = listReader.filter(
        (r: any) => r.role_name === "Reader" || r.role === "Reader",
      );
      setReaders(fil);
    } catch (err) {
      console.error("Lỗi khi tải độc giả:", err);
      message.error("Không thể tải danh sách độc giả");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReaders();
  }, []);

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
        console.error("Lỗi khi tải loại độc giả:", err);
      }
    };
    fetchTypeReaderOptions();
  }, []);

  const filteredReaders = useMemo(() => {
    if (!keyword) return readers;
    const lowerKeyword = keyword.toLowerCase();
    return readers.filter(
      (reader) =>
        (reader.nameReader || "").toLowerCase().includes(lowerKeyword) ||
        (reader.email || "").toLowerCase().includes(lowerKeyword),
    );
  }, [readers, keyword]);

  const handleEdit = (reader: IReader) => {
    setSelectedReader(reader);
    setIsOpen(true);
  };

  const handleUpdate = async (formData: FormData) => {
    if (!selectedReader) return;
    setIsSubmitting(true);

    try {
      // 1. Gọi API
      // res có thể là data luôn (nếu interceptor trả về error.response)
      // hoặc là object response chuẩn
      const res: any = await updateReaderAPI(selectedReader.idReader, formData);

      // 2. Lấy phần dữ liệu cốt lõi
      const responseData = res?.data || res;

      // 3. CHECK LOGIC: Nếu Backend bảo thất bại (dù HTTP 200)
      if (responseData?.success === false || responseData?.statusCode === 400) {
        // 👉 LẤY ĐÚNG MESSAGE TỪ BACKEND
        const backendMsg =
          responseData?.message || "Lỗi cập nhật (không rõ nguyên nhân)";
        message.error(backendMsg);

        // 🛑 DỪNG NGAY: Không chạy xuống đoạn success, Modal vẫn mở để user sửa
        return;
      }

      // 4. Nếu vượt qua chốt chặn trên thì mới là thành công
      message.success("Cập nhật độc giả thành công!");
      setIsOpen(false); // Đóng modal
      fetchReaders(); // Load lại danh sách
    } catch (err: any) {
      console.error("Lỗi khi cập nhật:", err);
      // Xử lý lỗi mạng hoặc lỗi Server 500
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Cập nhật thất bại, vui lòng kiểm tra lại!";
      message.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await deleteReaderAPI(pendingDeleteId);
      message.success("Đã xoá độc giả thành công!");
      fetchReaders();
    } catch (err) {
      console.error("Lỗi xoá độc giả:", err);
      message.error("Không thể xoá độc giả!");
    } finally {
      setPendingDeleteId(null);
    }
  };

  const columns: ColumnsType<IReader> = [
    {
      title: "Độc giả",
      key: "info",
      fixed: "left",
      width: 220,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={record.urlAvatar || ""}
            size={40}
            icon={<UserOutlined />}
            className="border-2 border-emerald-100 flex-shrink-0"
          />
          <div className="min-w-0">
            <p className="font-semibold text-gray-800 truncate m-0 text-sm">
              {record.nameReader || "Chưa cập nhật"}
            </p>
            <p className="text-xs text-gray-400 m-0 truncate">
              {record.idTypeReader?.nameTypeReader || "Độc giả"}
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Email",
      key: "email",
      width: 200,
      render: (_, record) => (
        <div className="flex items-center gap-2 text-gray-600">
          <MailOutlined className="text-[#153D36] flex-shrink-0" />
          <span className="truncate text-sm">{record.email || "---"}</span>
        </div>
      ),
    },
    {
      title: "SĐT",
      key: "phone",
      width: 130,
      render: (_, record) => (
        <div className="flex items-center gap-2 text-gray-600">
          <PhoneOutlined className="text-[#153D36] flex-shrink-0" />
          <span className="text-sm">{record.phone || "---"}</span>
        </div>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createDate",
      key: "createDate",
      width: 120,
      render: (date) => (
        <div className="flex items-center gap-2 text-gray-600">
          <CalendarOutlined className="text-[#153D36] flex-shrink-0" />
          <span className="text-sm">
            {date ? new Date(date).toLocaleDateString("vi-VN") : "---"}
          </span>
        </div>
      ),
    },
    {
      title: "",
      key: "action",
      fixed: "right",
      width: 90,
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
              onClick={() => setPendingDeleteId(record.idReader)}
              className="hover:!bg-red-50"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const pendingReaderName = readers.find(
    (r) => r.idReader === pendingDeleteId,
  )?.nameReader;

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <Table
          columns={columns}
          dataSource={filteredReaders}
          rowKey="idReader"
          loading={loading}
          scroll={{ x: 700 }}
          size="middle"
          pagination={{
            pageSize: 8,
            showSizeChanger: false,
            showTotal: (total) => (
              <span className="text-gray-500 text-sm">
                Tổng{" "}
                <span className="font-semibold text-[#153D36]">{total}</span>{" "}
                độc giả
              </span>
            ),
          }}
          locale={{ emptyText: "Không tìm thấy dữ liệu" }}
          className="reader-table"
        />
      </div>

      {selectedReader && (
        <UpdateReaderModal
          open={isOpen}
          onClose={() => setIsOpen(false)}
          initialData={{
            nameReader: selectedReader.nameReader || "",
            email: selectedReader.email || "",
            dob: selectedReader.dob || "",
            sex: selectedReader.sex || "",
            address: selectedReader.address || "",
            phone: selectedReader.phone || "",
            idTypeReader: selectedReader.idTypeReader?.idTypeReader || "",
            urlAvatar: selectedReader.urlAvatar,
            readerPassword: selectedReader.ReaderPassword || "",
            role_name:
              selectedReader.role_name || selectedReader.role || "Reader",
          }}
          typeReaderOptions={typeReaderOptions}
          onSubmit={handleUpdate}
          isLoading={isSubmitting}
        />
      )}

      <Modal
        title={
          <span className="text-[#153D36] font-semibold">
            Xác nhận xoá độc giả
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
            Bạn có chắc muốn xoá độc giả này không?
          </p>
          <Tag color="red" className="text-base px-4 py-1">
            {pendingReaderName || "Độc giả này"}
          </Tag>
        </div>
      </Modal>
    </>
  );
};

export default ReaderList;
