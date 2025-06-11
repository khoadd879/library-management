import React, { useEffect, useState } from "react";
import { addAuthorAPI, getTypeBooksAPI } from "@/services/api";
import AuthorForm from "@/components/admin/user/AuthorForm";
import { App } from "antd";

interface ITypeBookOption {
  value: string;
  label: string;
}

const AddUser = () => {
  const { message } = App.useApp(); // dùng app.message
  const [activeTab, setActiveTab] = useState<"docgia" | "tacgia">("tacgia");
  const [authorAvatarPreview, setAuthorAvatarPreview] = useState<string | null>(
    null
  );
  const [typeBookOptions, setTypeBookOptions] = useState<ITypeBookOption[]>([]);

  const [authorForm, setAuthorForm] = useState({
    IdTypeBook: "",
    NameAuthor: "",
    Nationality: "",
    Biography: "",
    AvatarImage: undefined as File | undefined,
  });
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await getTypeBooksAPI();
        const unique = Array.from(
          new Map(res?.map((item: any) => [item.idTypeBook, item])).values()
        ).map((item: any) => ({
          value: item.idTypeBook,
          label: item.typeBook,
        }));

        setTypeBookOptions(unique);
      } catch (err) {
        console.error("Lỗi lấy thể loại sách:", err);
        message.error("Không thể lấy danh sách thể loại sách.");
      }
    };

    fetchTypes();
  }, [message]);

  const handleAuthorChange = (
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
      | any
  ) => {
    const { name, value } = e.target;
    setAuthorForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitAuthor = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("IdTypeBook", authorForm.IdTypeBook);
      formData.append("NameAuthor", authorForm.NameAuthor);
      formData.append("Nationality", authorForm.Nationality);
      formData.append("Biography", authorForm.Biography);
      if (authorForm.AvatarImage) {
        formData.append("AvatarImage", authorForm.AvatarImage);
      }

      await addAuthorAPI(formData);
      message.success("Thêm tác giả thành công!");
      setAuthorForm({
        IdTypeBook: "",
        NameAuthor: "",
        Nationality: "",
        Biography: "",
        AvatarImage: undefined,
      });
      setAuthorAvatarPreview(null);
    } catch (err) {
      console.error(err);
      message.error("Thêm tác giả thất bại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f4f7f9] px-12 py-8">
      <h2 className="text-xl font-bold text-[#153D36] text-center mb-6">
        {activeTab === "docgia" ? "THÔNG TIN ĐỘC GIẢ" : "THÔNG TIN TÁC GIẢ"}
      </h2>

      <div className="flex justify-start mb-6">
        <button
          className={`px-4 py-2 rounded text-sm font-medium ${
            activeTab === "tacgia"
              ? "bg-[#153D36] text-white"
              : "bg-[#e5e7eb] text-[#153D36]"
          }`}
          onClick={() => setActiveTab("tacgia")}
        >
          Tác giả
        </button>
        <button
          className={`ml-2 px-4 py-2 rounded text-sm font-medium ${
            activeTab === "docgia"
              ? "bg-[#153D36] text-white"
              : "bg-[#e5e7eb] text-[#153D36]"
          }`}
          onClick={() => setActiveTab("docgia")}
        >
          Độc giả
        </button>
      </div>

      {activeTab === "tacgia" && (
        <AuthorForm
          form={authorForm}
          onChange={handleAuthorChange}
          onSubmit={handleSubmitAuthor}
          preview={authorAvatarPreview}
          setPreview={setAuthorAvatarPreview}
          typeBookOptions={typeBookOptions}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};

export default AddUser;
