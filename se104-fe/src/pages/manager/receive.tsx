import React, { useState, useEffect } from "react";
import { message, Spin } from "antd";
import { addBookAPI, getListAuthor, getTypeBooksAPI } from "@/services/api";

const ReceiveBook = () => {
  const [today, setToday] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [bookImage, setBookImage] = useState<File | null>(null);
  const [authors, setAuthors] = useState<{ id: string; nameAuthor: string }[]>(
    []
  );
  const [typeBooks, setTypeBooks] = useState<
    { value: string; label: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    nameHeaderBook: "",
    describeBook: "",
    idTypeBook: "",
    idAuthors: [] as string[],
    publisher: "",
    reprintYear: new Date().getFullYear(),
    valueOfBook: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const current = new Date();
        const formatted = current.toISOString().slice(0, 10);
        setToday(formatted);

        const authorRes = await getListAuthor();
        console.log(authorRes);
        if (authorRes) {
          const mappedAuthors = authorRes.map((a: any) => ({
            id: a.idAuthor,
            nameAuthor: a.nameAuthor,
          }));
          setAuthors(mappedAuthors);
        }

        const typeBookRes = await getTypeBooksAPI();
        console.log(typeBookRes);
        const unique = Array.from(
          new Map(
            typeBookRes.map((item: any) => [item.idTypeBook, item])
          ).values()
        ).map((item: any) => ({
          value: item.idTypeBook,
          label: item.nameTypeBook,
        }));
        setTypeBooks(unique);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu", err);
        message.error("Không thể tải dữ liệu tác giả hoặc thể loại sách.");
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("IdTypeBook", form.idTypeBook);
      formData.append("NameHeaderBook", form.nameHeaderBook);
      formData.append("DescribeBook", form.describeBook);
      form.idAuthors.forEach((id) => formData.append("Authors", id));
      formData.append("bookCreateRequest.Publisher", form.publisher);
      formData.append(
        "bookCreateRequest.ReprintYear",
        form.reprintYear.toString()
      );
      formData.append(
        "bookCreateRequest.ValueOfBook",
        Number(form.valueOfBook).toString()
      );

      if (bookImage) formData.append("BookImage", bookImage);

      await addBookAPI(formData);
      setForm({
        nameHeaderBook: "",
        describeBook: "",
        idTypeBook: "",
        idAuthors: [],
        publisher: "",
        reprintYear: new Date().getFullYear(),
        valueOfBook: "",
      });
      setBookImage(null);
      setPreviewImage(null);

      message.success("Thêm sách thành công!");
    } catch (err) {
      console.error(err);
      message.error("Thêm sách thất bại!");
    } finally {
      setIsLoading(false);
    }
  };

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
        <h2 className="text-2xl font-bold text-[#153D36] text-center mb-6">
          THÔNG TIN SÁCH
        </h2>

        <div className="flex justify-center gap-10">
          <div className="w-1/4 flex items-start justify-center">
            {previewImage ? (
              <img
                src={previewImage}
                alt="Book"
                className="rounded-lg shadow-lg w-48"
              />
            ) : (
              <div className="rounded-lg shadow-lg w-48 h-64 bg-gray-200 flex items-center justify-center">
                <span className="text-sm text-gray-500">Chưa có ảnh</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="w-1/2 space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">
                Tên sách
              </label>
              <input
                type="text"
                name="NameHeaderBook"
                value={form.nameHeaderBook}
                onChange={(e) =>
                  setForm({ ...form, nameHeaderBook: e.target.value })
                }
                placeholder="Tên sách"
                className="w-full px-4 py-2 border rounded outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Nhà xuất bản
              </label>
              <input
                type="text"
                name="bookCreateRequest.Publisher"
                value={form.publisher}
                onChange={(e) =>
                  setForm({ ...form, publisher: e.target.value })
                }
                placeholder="Nhà xuất bản"
                className="w-full px-4 py-2 border rounded outline-none text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Năm tái bản
                </label>
                <input
                  type="number"
                  name="bookCreateRequest.ReprintYear"
                  value={form.reprintYear}
                  onChange={(e) =>
                    setForm({ ...form, reprintYear: +e.target.value })
                  }
                  placeholder="Năm tái bản"
                  className="w-full px-4 py-2 border rounded outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Thể loại
                </label>
                <select
                  name="IdTypeBook"
                  value={form.idTypeBook}
                  onChange={(e) =>
                    setForm({ ...form, idTypeBook: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded outline-none text-sm"
                >
                  <option value="">-- Chọn thể loại --</option>
                  {typeBooks.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Trị giá
              </label>
              <input
                type="number"
                name="bookCreateRequest.ValueOfBook"
                value={form.valueOfBook}
                onChange={(e) =>
                  setForm({ ...form, valueOfBook: e.target.value })
                }
                placeholder="Trị giá"
                className="w-full px-4 py-2 border rounded outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Ngày nhận
              </label>
              <input
                type="date"
                value={today}
                readOnly
                className="w-full px-4 py-2 border rounded outline-none text-sm bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Mô tả</label>
              <textarea
                name="DescribeBook"
                value={form.describeBook}
                onChange={(e) =>
                  setForm({ ...form, describeBook: e.target.value })
                }
                placeholder="Mô tả"
                rows={4}
                className="w-full px-4 py-2 border rounded outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Tác giả
              </label>
              <select
                name="Authors"
                multiple
                value={form.idAuthors}
                onChange={(e) =>
                  setForm({
                    ...form,
                    idAuthors: Array.from(e.target.selectedOptions).map(
                      (opt) => opt.value
                    ),
                  })
                }
                className="w-full px-4 py-2 border rounded outline-none text-sm h-[100px] overflow-y-auto"
              >
                {authors.map((author) => (
                  <option key={author.id} value={author.id}>
                    {author.nameAuthor}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">
                Ảnh bìa sách
              </label>
              <input
                type="file"
                name="BookImage"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setBookImage(file);
                    setPreviewImage(URL.createObjectURL(file));
                  }
                }}
                className="text-sm"
              />
            </div>

            <div className="text-center pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-2 rounded text-sm font-semibold flex items-center justify-center gap-2 ${
                  isLoading
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-[#27AE60] text-white"
                }`}
              >
                {isLoading ? <Spin size="small" /> : "Thêm sách"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReceiveBook;
