import { useEffect, useState } from "react";
import {
  getListReader,
  getTypeReadersAPI,
  updateReaderAPI,
} from "@/services/api";
import UpdateReaderModal from "../user/UpdateReaderModal";
import { message } from "antd";

const ReaderList = () => {
  const [readers, setReaders] = useState<IReader[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedReader, setSelectedReader] = useState<IReader | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [typeReaderOptions, setTypeReaderOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    const fetchReaders = async () => {
      try {
        const res = await getListReader();
        setReaders(res);
      } catch (err) {
        console.error("Lỗi khi tải độc giả:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReaders();
  }, []);
  useEffect(() => {
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

    fetchTypeReaderOptions();
  }, []);
  const handleEdit = (reader: IReader) => {
    setSelectedReader(reader);
    setIsOpen(true);
  };
  const handleUpdate = async (formData: FormData) => {
    if (!selectedReader) return;
    setIsSubmitting(true);
    try {
      formData.append("ReaderPassword", selectedReader.ReaderPassword);
      await updateReaderAPI(selectedReader.idReader, formData);
      const res = await getListReader();

      setReaders(res);
      setIsOpen(false);
      message.success("Cập nhật độc giả thành công!");
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-4">Đang tải danh sách độc giả...</div>;

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100 text-[#153D36] font-medium">
          <tr>
            <th className="px-4 py-3">Photo</th>
            <th className="px-4 py-3">Tên</th>
            <th className="px-4 py-3">Địa chỉ</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">SĐT</th>
            <th className="px-4 py-3">Ngày lập thẻ</th>
            <th className="px-4 py-3 text-center">Tuỳ chỉnh</th>
          </tr>
        </thead>
        <tbody>
          {readers.map((reader) => (
            <tr key={reader.idReader} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">
                {reader.urlAvatar ? (
                  <img
                    src={reader.urlAvatar}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-red-400 rounded-full" />
                )}
              </td>
              <td className="px-4 py-2 font-medium text-[#153D36]">
                {reader.nameReader}
              </td>
              <td className="px-4 py-2 text-gray-700">{reader.address}</td>
              <td className="px-4 py-2 text-gray-700">{reader.email}</td>
              <td className="px-4 py-2 text-gray-700">{reader.phone}</td>
              <td className="px-4 py-2 text-gray-700">
                {new Date(reader.createDate).toLocaleDateString("vi-VN")}
              </td>
              <td className="px-4 py-2 text-center">
                <button
                  className="mr-2 text-black"
                  onClick={() => handleEdit(reader)}
                >
                  ✏️
                </button>

                <button className="text-red-500">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedReader && (
        <UpdateReaderModal
          open={isOpen}
          onClose={() => setIsOpen(false)}
          initialData={{
            nameReader: selectedReader.nameReader,
            email: selectedReader.email,
            dob: selectedReader.dob,
            sex: selectedReader.sex,
            address: selectedReader.address,
            phone: selectedReader.phone,
            idTypeReader: selectedReader.idTypeReader.idTypeReader,
            urlAvatar: selectedReader.urlAvatar,
            readerPassword: selectedReader.ReaderPassword,
          }}
          typeReaderOptions={typeReaderOptions}
          onSubmit={handleUpdate}
          isLoading={isSubmitting}
        />
      )}
    </div>
  );
};

export default ReaderList;
