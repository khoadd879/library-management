import React from "react";

const Favorite = () => {
  const books = [
    {
      title: "One Bullet Away",
      author: "Nathaniel Fick",
      image:
        "https://th.bing.com/th/id/OIP.auqsJ2IYALrvSlS7oaw-OwHaKD?rs=1&pid=ImgDetMain",
    },
    {
      title: "Of Mice and Men",
      author: "John Steinbeck",
      image:
        "https://th.bing.com/th/id/OIP.auqsJ2IYALrvSlS7oaw-OwHaKD?rs=1&pid=ImgDetMain",
    },
    {
      title: "One Day",
      author: "David Nicholls",
      image:
        "https://th.bing.com/th/id/OIP.auqsJ2IYALrvSlS7oaw-OwHaKD?rs=1&pid=ImgDetMain",
    },
    {
      title: "Evvie Drake Starts Over",
      author: "Linda Holmes",
      image:
        "https://th.bing.com/th/id/OIP.auqsJ2IYALrvSlS7oaw-OwHaKD?rs=1&pid=ImgDetMain",
    },
  ];
  return (
    <div className="min-h-screen bg-white px-8 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-red-600">
          Yêu thích <span className="text-xl">❤️</span>
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {[...Array(2)]
          .flatMap(() => books)
          .map((book, index) => (
            <div
              key={index}
              className="bg-white rounded shadow hover:shadow-lg transition p-2"
            >
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-[300px] object-cover rounded mb-2"
              />
              <p className="text-sm font-semibold">{book.title}</p>
              <p className="text-xs text-gray-500">{book.author}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Favorite;
