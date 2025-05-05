import React from "react";

const FeaturedBooks = () => {
  return (
    <div className="min-h-screen bg-[#f4f7f9] px-4 md:px-12 py-6 w-full">
      <div className="bg-[#153D36] px-6 py-4 rounded-t-lg flex justify-between items-center text-white">
        <h2 className="text-xl font-semibold">Sách nổi bật</h2>
        <input
          type="text"
          placeholder="Search..."
          className="w-[300px] px-4 py-1.5 rounded-full text-black outline-none text-sm bg-white"
        />
      </div>

      <div className="bg-white shadow-md rounded-b-lg p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="rounded-lg shadow-sm bg-white p-2 hover:shadow-md transition"
            >
              <div className="w-full h-48 bg-gray-200 rounded overflow-hidden mb-2">
                <img
                  src={`https://th.bing.com/th/id/OIP.auqsJ2IYALrvSlS7oaw-OwHaKD?rs=1&pid=ImgDetMain`}
                  alt={`Book ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm font-semibold">One Bullet Away</p>
              <p className="text-xs text-gray-500">Nathaniel Fick</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedBooks;
