import { useEffect, useState } from "react";
import { getAllBooksAndCommentsAPI } from "@/services/api";
import { useNavigate } from "react-router-dom";
import { Spin, message } from "antd";

const NewBooks = () => {
  const [books, setBooks] = useState<IBook[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
         const idUser = localStorage.getItem("idUser");
      if(!idUser){
        message.warning("Không có User");
        return;
      }
        const data = await getAllBooksAndCommentsAPI(idUser);
        const res = data.data;
        if (Array.isArray(res)) {
          // Lọc sách có reprintYear là 2024 hoặc 2025
          const currentYear = 2025;
          const filtered = res.filter(
            (b) =>
              b.reprintYear === currentYear || b.reprintYear === currentYear - 1
          );
          // Sắp xếp mới nhất lên đầu
          filtered.sort((a, b) => b.reprintYear - a.reprintYear);
          setBooks(filtered);
        } else {
          setBooks([]);
        }
      } catch (err) {
        setBooks([]);
        message.error("Lỗi khi tải sách mới.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const filteredBooks = books.filter((b) =>
    b.nameBook.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8fafc] to-slate-100 pb-12">
      {/* Header Section with gradient */}
      <div className="relative bg-gradient-to-r from-[#153D36] via-[#1A4A42] to-[#153D36] pt-10 pb-16 px-4 md:px-12 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg">
                <svg className="w-7 h-7 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                  Sách mới nhất
                </h2>
                <p className="text-emerald-200/70 mt-1 text-sm">
                  Khám phá những cuốn sách mới được cập nhật
                </p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex gap-3">
              <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
                <span className="text-emerald-300 font-black text-xl">{books.length}</span>
                <span className="text-white/60 text-sm ml-2">cuốn sách</span>
              </div>
            </div>
          </div>
          
          {/* Search */}
          <div className="mt-6">
            <div className="relative max-w-md">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Tìm kiếm sách..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl text-slate-700 outline-none text-sm bg-white/95 backdrop-blur-md shadow-lg border-0 focus:ring-2 focus:ring-emerald-400 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-12 -mt-6 relative z-20">
        <div className="bg-white shadow-xl rounded-2xl p-6 min-h-[400px] border border-slate-100">
          {loading ? (
            <div className="flex flex-col justify-center items-center min-h-[300px] gap-4">
              <Spin size="large" />
              <p className="text-slate-400 text-sm">Đang tải sách mới...</p>
            </div>
          ) : filteredBooks.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
              {filteredBooks.map((book, index) => (
                <div
                  key={book.idBook}
                  className="group rounded-2xl bg-white border-2 border-slate-100 hover:border-emerald-200 p-3 hover:shadow-2xl transition-all duration-500 cursor-pointer hover:-translate-y-2"
                  onClick={() => navigate(`/detail/${book.idBook}`)}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  {/* Book Cover */}
                  <div className="relative w-full h-44 bg-gradient-to-br from-slate-100 to-slate-50 rounded-xl overflow-hidden mb-3">
                    {book.image ? (
                      <img
                        src={book.image}
                        alt={book.nameBook}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    )}
                    {/* Year Badge */}
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded-lg text-[10px] font-black shadow-lg ${
                      book.reprintYear === 2025 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-amber-500 text-white'
                    }`}>
                      {book.reprintYear}
                    </div>
                    {/* New Badge */}
                    {book.reprintYear === 2025 && (
                      <div className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white rounded-lg text-[10px] font-black shadow-lg animate-pulse">
                        MỚI
                      </div>
                    )}
                  </div>
                  
                  {/* Book Info */}
                  <h3 className="text-sm font-bold truncate text-slate-800 group-hover:text-[#153D36] transition-colors">
                    {book.nameBook}
                  </h3>
                  <p className="text-xs text-slate-500 truncate mt-1">
                    {book.authors?.[0]?.nameAuthor || "Không rõ tác giả"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p className="text-slate-400 text-lg font-medium">Không tìm thấy sách</p>
              <p className="text-slate-300 text-sm">Thử tìm kiếm với từ khóa khác</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewBooks;
