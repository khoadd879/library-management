import React from "react";

const History = () => {
  const mockData = Array(10).fill({
    image:
      "https://th.bing.com/th/id/OIP.auqsJ2IYALrvSlS7oaw-OwHaKD?rs=1&pid=ImgDetMain",
    title: "Diệt Slime Suốt 300 Năm, Tôi Level Max Lúc Nào Chẳng Hay",
    code: "A69420",
    genre: "Thiếu nhi",
    borrowed: "01/03/2000",
    returned: "01/03/2300",
  });
  return (
    <div className="min-h-screen bg-[#d3edd8] px-4 md:px-10 py-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-[#153D36]">
        Lịch sử mượn sách
      </h2>

      <div className="overflow-x-auto rounded-xl shadow">
        <table className="min-w-full bg-white">
          <thead className="bg-[#153D36] text-white text-left">
            <tr>
              <th className="px-4 py-3">Tên sách</th>
              <th className="px-4 py-3">Mã sách</th>
              <th className="px-4 py-3">Thể loại</th>
              <th className="px-4 py-3">Ngày mượn</th>
              <th className="px-4 py-3">Ngày trả</th>
            </tr>
          </thead>
          <tbody>
            {mockData.map((item, index) => (
              <tr
                key={index}
                className="border-b hover:bg-[#e3f6e8] transition duration-200"
              >
                <td className="px-4 py-3 flex items-center gap-2">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-10 h-14 object-cover rounded"
                  />
                  <span className="text-sm">{item.title}</span>
                </td>
                <td className="px-4 py-3 text-sm">{item.code}</td>
                <td className="px-4 py-3 text-sm">{item.genre}</td>
                <td className="px-4 py-3 text-sm">{item.borrowed}</td>
                <td className="px-4 py-3 text-sm">{item.returned}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;
