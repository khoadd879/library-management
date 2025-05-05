const HomePage = () => {
  return (
    <div className="w-full min-h-screen bg-[#f4f7f9]">
      <div className="bg-[#153D36] px-12 py-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search..."
          className="w-[400px] px-4 py-2 rounded-full outline-none text-sm text-black bg-white border border-black"
        />

        <div className="text-xl text-white">🔔</div>
      </div>

      <div className="px-12 py-8">
        <div className="flex gap-6">
          <div className="w-2/3 flex flex-col gap-6">
            <div className="bg-white rounded-xl p-8 shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg text-[#154734]">
                  Nổi bật
                </h2>
                <a href="#" className="text-blue-500 text-sm">
                  Xem tất cả &gt;
                </a>
              </div>
              <div className="flex gap-4 overflow-x-auto">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="min-w-[140px] bg-white rounded-lg shadow p-2"
                  >
                    <div className="h-40 bg-gray-200 rounded mb-2" />
                    <p className="text-sm font-semibold text-[#154734]">
                      One Bullet Away
                    </p>
                    <p className="text-xs text-gray-500">Nathaniel Fick</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg text-[#154734]">
                  Lịch sử mượn sách
                </h2>
                <a href="#" className="text-blue-500 text-sm">
                  Xem tất cả &gt;
                </a>
              </div>
              <div className="flex gap-4 overflow-x-auto">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="min-w-[140px] bg-white rounded-lg shadow p-2"
                  >
                    <div className="h-40 bg-gray-200 rounded mb-2" />
                    <p className="text-sm font-semibold text-[#154734]">
                      Of Mice and Men
                    </p>
                    <p className="text-xs text-gray-500">John Steinbeck</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-1/3 flex flex-col gap-6">
            <div className="bg-white rounded-xl p-7 shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-lg text-[#154734]">
                  Tác giả
                </h2>
                <a href="#" className="text-blue-500 text-sm">
                  Xem tất cả &gt;
                </a>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center text-center  border rounded"
                  >
                    <div className="w-12 h-12 rounded-full bg-gray-300 " />
                    <p className="text-sm font-semibold text-[#154734]">
                      Dương Trọng Khang
                    </p>
                    <p className="text-xs text-gray-500">10 cuốn sách</p>
                    <a href="#" className="text-blue-500 text-xs mt-1">
                      Thông tin chi tiết
                    </a>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow">
              <div className="flex justify-between items-center ">
                <h2 className="font-semibold text-lg text-[#154734]">
                  Sách mới
                </h2>
                <a href="#" className="text-blue-500 text-sm">
                  Xem tất cả &gt;
                </a>
              </div>
              <div className="flex gap-4 overflow-x-auto flex-nowrap">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="min-w-[110px] bg-white rounded-lg shadow p-2.5"
                  >
                    <div className="h-40 bg-gray-200 rounded mb-2" />
                    <p className="text-sm font-semibold text-[#154734]">
                      Educated
                    </p>
                    <p className="text-xs text-gray-500">Tara Westover</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
