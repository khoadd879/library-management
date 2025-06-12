import { useEffect, useState } from "react";
import { getListReader } from "@/services/api";

const ReaderList = () => {
  const [readers, setReaders] = useState<IReader[]>([]);
  const [loading, setLoading] = useState(true);

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
                <button className="mr-2 text-black">✏️</button>
                <button className="text-red-500">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReaderList;
