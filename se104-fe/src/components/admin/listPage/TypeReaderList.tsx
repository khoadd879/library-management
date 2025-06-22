import React, { useEffect, useState } from "react";
import { getTypeReadersAPI, deleteTypeReaderAPI } from "@/services/api";
import { Spin, message, Modal } from "antd";
import AddTypeReaderModal from "./AddTypeReaderModal";
import EditTypeReaderModal from "./EditTypeReaderModal";

interface ITypeReader {
  idTypeReader: string;
  nameTypeReader: string;
  description: string;
}

interface Props {
  keyword: string;
}

const TypeReaderList = ({ keyword }: Props) => {
  const [typeReaders, setTypeReaders] = useState<ITypeReader[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReader, setSelectedReader] = useState<ITypeReader | null>(
    null
  );
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchTypeReaders();
  }, []);

  const fetchTypeReaders = async () => {
    setLoading(true);
    try {
      const res = await getTypeReadersAPI();
      setTypeReaders(res);
    } catch (error) {
      console.error("Lỗi khi tải loại độc giả:", error);
      message.error("Không thể tải danh sách loại độc giả!");
    } finally {
      setLoading(false);
    }
  };

  const filtered = typeReaders.filter((type) =>
    type.nameTypeReader.toLowerCase().includes(keyword.toLowerCase())
  );

  const handleDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await deleteTypeReaderAPI(pendingDeleteId);
      message.success("Đã xoá loại độc giả thành công!");
      await fetchTypeReaders();
    } catch (err) {
      console.error("Lỗi khi xoá:", err);
      message.error("Không thể xoá loại độc giả.");
    } finally {
      setPendingDeleteId(null);
    }
  };

  if (loading)
    return (
      <div className="p-4 text-center">
        <Spin tip="Đang tải loại độc giả..." />
      </div>
    );

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold text-[#153D36]">
          Danh sách loại độc giả
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
            <th className="px-4 py-3">Tên loại độc giả</th>
            <th className="px-4 py-3 text-center">Tuỳ chọn</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((type) => (
            <tr key={type.idTypeReader} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{type.idTypeReader}</td>
              <td className="px-4 py-2 font-medium text-[#153D36]">
                {type.nameTypeReader}
              </td>
              <td className="px-4 py-2 text-center space-x-2">
                <button
                  className="text-black"
                  onClick={() => {
                    setSelectedReader(type);
                    setShowEditModal(true);
                  }}
                >
                  ✏️
                </button>
                <button
                  className="text-red-500"
                  onClick={() => setPendingDeleteId(type.idTypeReader)}
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
          Không có loại độc giả phù hợp.
        </div>
      )}

      <Modal
        title="Xác nhận xoá loại độc giả"
        open={!!pendingDeleteId}
        onOk={handleDelete}
        onCancel={() => setPendingDeleteId(null)}
        okText="Xoá"
        cancelText="Huỷ"
        okButtonProps={{ danger: true }}
      >
        <p>
          Bạn có chắc muốn xoá loại độc giả{" "}
          <strong>
            {
              typeReaders.find((tr) => tr.idTypeReader === pendingDeleteId)
                ?.nameTypeReader
            }
          </strong>
          ?
        </p>
      </Modal>

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
