import React, { useEffect, useState } from "react";
import { getTypeBooksAPI, deleteTypeBookAPI } from "@/services/api";
import { message, Modal, Spin } from "antd";
import AddTypeBookModal from "./AddTypeBookModal";
import EditTypeBookModal from "./EditTypeBookModal";

interface Props {
  keyword: string;
}

interface ITypeBook {
  idTypeBook: string;
  nameTypeBook: string;
  description: string;
}

const TypeBookList = ({ keyword }: Props) => {
  const [typeBooks, setTypeBooks] = useState<ITypeBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<ITypeBook | null>(null);

  useEffect(() => {
    fetchTypeBooks();
  }, []);

  const fetchTypeBooks = async () => {
    setLoading(true);
    try {
      const res = await getTypeBooksAPI();
      setTypeBooks(res);
    } catch (err) {
      console.error("Lỗi khi tải loại sách:", err);
      message.error("Không thể tải danh sách loại sách.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = typeBooks.filter((tb) =>
    tb.nameTypeBook.toLowerCase().includes(keyword.toLowerCase())
  );

  const handleDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await deleteTypeBookAPI(pendingDeleteId);
      message.success("Đã xoá loại sách thành công!");
      await fetchTypeBooks();
    } catch (err) {
      console.error("Lỗi khi xoá:", err);
      message.error("Không thể xoá loại sách.");
    } finally {
      setPendingDeleteId(null);
    }
  };

  if (loading)
    return (
      <div className="p-4 text-center">
        <Spin tip="Đang tải loại sách..." />
      </div>
    );

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold text-[#153D36]">
          Danh sách loại sách
        </h2>
        <button
          className="px-3 py-1 bg-[#153D36] text-white rounded text-sm"
          onClick={() => setShowAddModal(true)}
        >
          ➕ Thêm
        </button>
      </div>

      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100 text-[#153D36] font-medium">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Tên loại sách</th>
            <th className="px-4 py-3 text-center">Tuỳ chọn</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((type) => (
            <tr key={type.idTypeBook} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{type.idTypeBook}</td>
              <td className="px-4 py-2 font-medium text-[#153D36]">
                {type.nameTypeBook}
              </td>
              <td className="px-4 py-2 text-center space-x-2">
                <button
                  className="text-black"
                  onClick={() => {
                    setSelectedBook(type);
                    setShowEditModal(true);
                  }}
                >
                  ✏️
                </button>
                <button
                  className="text-red-500"
                  onClick={() => setPendingDeleteId(type.idTypeBook)}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filtered.length === 0 && (
        <div className="p-4 text-center text-gray-500">
          Không có kết quả phù hợp.
        </div>
      )}

      {/* Modal xác nhận xoá */}
      <Modal
        title="Xác nhận xoá loại sách"
        open={!!pendingDeleteId}
        onOk={handleDelete}
        onCancel={() => setPendingDeleteId(null)}
        okText="Xoá"
        cancelText="Huỷ"
        okButtonProps={{ danger: true }}
      >
        <p>
          Bạn có chắc muốn xoá loại sách{" "}
          <strong>
            {
              typeBooks.find((tb) => tb.idTypeBook === pendingDeleteId)
                ?.nameTypeBook
            }
          </strong>
          ?
        </p>
      </Modal>

      {/* Modal thêm */}
      <AddTypeBookModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={fetchTypeBooks}
      />

      {/* Modal sửa */}
      {selectedBook && (
        <EditTypeBookModal
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSuccess={fetchTypeBooks}
          initialData={{
            idTypeBook: selectedBook.idTypeBook,
            nameTypeBook: selectedBook.nameTypeBook,
          }}
        />
      )}
    </div>
  );
};

export default TypeBookList;
