import React from "react";

const AuthorDetail = () => {
  const author = {
    name: "J.K. Rowling",
    avatar: "https://th.bing.com/th/id/OIP.auqsJ2IYALrvSlS7oaw-OwHaKD?rs=1&pid=ImgDetMain",
    description: "J.K. Rowling is the author of the enduringly popular Harry Potter books. After the idea for Harry Potter came to her on a delayed train journey in 1990, she plotted out and started writing the series of seven books and the first was published as Harry Potter and the Philosopher's Stone in the UK in 1997. The series took another ten years to complete, concluding in 2007 with the publication of Harry Potter and the Deathly Hallows.'.",
  };

  const books = [
    {
      title: "Of Mice and Men",
      author: "John Steinbeck",
      image: "https://th.bing.com/th/id/OIP.auqsJ2IYALrvSlS7oaw-OwHaKD?rs=1&pid=ImgDetMain",
    },
    {
      title: "The Grapes of Wrath",
      author: "John Steinbeck",
      image: "https://th.bing.com/th/id/OIP.auqsJ2IYALrvSlS7oaw-OwHaKD?rs=1&pid=ImgDetMain",
    },
    {
      title: "East of Eden",
      author: "John Steinbeck",
      image: "https://th.bing.com/th/id/OIP.auqsJ2IYALrvSlS7oaw-OwHaKD?rs=1&pid=ImgDetMain",
    },
    {
      title: "Cannery Row",
      author: "John Steinbeck",
      image: "https://th.bing.com/th/id/OIP.auqsJ2IYALrvSlS7oaw-OwHaKD?rs=1&pid=ImgDetMain",
    },
  ];

  return (
    <div className="min-h-screen bg-white px-8 py-6">
      {/* Phần thông tin tác giả */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="md:w-1/5">
          <img 
            src={author.avatar} 
            alt={author.name} 
            className="w-full h-auto rounded-lg shadow-md"
          />
        </div>
        <div className="md:w-3/4">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{author.name}</h1>
          <p className="text-gray-600 text-justify">{author.description}</p>
        </div>
      </div>

      {/* Phần tiêu đề sách của tác giả */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-red-600">
          Sách của {author.name} <span className="text-xl">📚</span>
        </h2>
      </div>

      {/* Danh sách sách */}
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

export default AuthorDetail;