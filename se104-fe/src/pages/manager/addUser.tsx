import React, { useEffect, useRef, useState } from "react";
import {
  addAuthorAPI,
  addReaderAPI,
  getTypeBooksAPI,
  getTypeReadersAPI,
} from "@/services/api";
import AuthorForm from "@/components/admin/user/AuthorForm";
import { App } from "antd";
import ReaderForm from "@/components/admin/user/ReaderForm";
import { User, PenTool, Users, PlusCircle } from "lucide-react"; // Cần cài lucide-react hoặc dùng icon tương tự

interface ITypeBookOption {
  value: string;
  label: string;
}
export interface ITypeReaderOption {
  value: string;
  label: string;
}

const AddUser = () => {
  const { message } = App.useApp();
  const [activeTab, setActiveTab] = useState<"docgia" | "tacgia">("tacgia");
  const [authorAvatarPreview, setAuthorAvatarPreview] = useState<string | null>(null);
  const [typeBookOptions, setTypeBookOptions] = useState<ITypeBookOption[]>([]);
  const [typeReaderOptions, setTypeReaderOptions] = useState<ITypeReaderOption[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef1 = useRef<HTMLInputElement | null>(null);

  // Logic giữ nguyên hoàn toàn
  const [authorForm, setAuthorForm] = useState({
    IdTypeBook: "",
    NameAuthor: "",
    Nationality: "",
    Biography: "",
    AvatarImage: undefined as File | undefined,
  });

  const [readerForm, setReaderForm] = useState({
    IdTypeReader: "",
    NameReader: "",
    Email: "",
    Dob: "",
    Sex: "",
    Address: "",
    Phone: "",
    ReaderPassword: "123456",
    AvatarImage: undefined as File | undefined,
  });

  const [readerAvatarPreview, setReaderAvatarPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTypeReaderOptions = async () => {
      try {
        const res = await getTypeReadersAPI();
        const options = (res.data || []).map((item: any) => ({
          value: item.idTypeReader,
          label: item.nameTypeReader,
        }));
        setTypeReaderOptions(options);
      } catch (err) {
        message.error("Không thể lấy danh sách loại độc giả.");
      }
    };
    fetchTypeReaderOptions();
  }, [message]);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await getTypeBooksAPI();
        const dataArray = res.data || [];
        const unique = Array.from(
          new Map(dataArray.map((item: any) => [item.idTypeBook, item])).values()
        ).map((item: any) => ({
          value: item.idTypeBook,
          label: item.nameTypeBook,
        }));
        setTypeBookOptions(unique);
      } catch (err) {
        message.error("Không thể lấy danh sách thể loại sách.");
      }
    };
    fetchTypes();
  }, [message]);

  const handleAuthorChange = (e: any) => {
    const { name, value } = e.target;
    setAuthorForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleReaderChange = (e: any) => {
    const { name, value, files } = e.target;
    if (name === "AvatarImage" && files?.length > 0) {
      const file = files[0];
      setReaderForm((prev) => ({ ...prev, AvatarImage: file }));
      setReaderAvatarPreview(URL.createObjectURL(file));
    } else {
      setReaderForm((prev) => ({ ...prev, [name]: value }));
    }
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
      if (authorForm.AvatarImage) formData.append("AvatarImage", authorForm.AvatarImage);
      await addAuthorAPI(formData);
      message.success("Thêm tác giả thành công!");
      setAuthorForm({ IdTypeBook: "", NameAuthor: "", Nationality: "", Biography: "", AvatarImage: undefined });
      setAuthorAvatarPreview(null);
    } catch (err) {
      message.error("Thêm tác giả thất bại!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReader = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("NameReader", readerForm.NameReader);
      formData.append("Email", readerForm.Email);
      formData.append("Dob", readerForm.Dob);
      formData.append("Sex", readerForm.Sex);
      formData.append("Address", readerForm.Address);
      formData.append("Phone", readerForm.Phone);
      formData.append("IdTypeReader", readerForm.IdTypeReader);
      formData.append("ReaderPassword", readerForm.ReaderPassword);
      if (readerForm.AvatarImage) formData.append("AvatarImage", readerForm.AvatarImage);
      const res = await addReaderAPI(formData);
      if (res && res.statusCode === 201) {
        setReaderForm({ NameReader: "", Email: "", Dob: "", Sex: "", Address: "", IdTypeReader: "", Phone: "", ReaderPassword: "123456", AvatarImage: undefined });
        setReaderAvatarPreview(null);
        message.success("Thêm độc giả thành công!");
      } else {
        message.error(res.data.message || "Vui lòng điền đầy đủ thông tin");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F0F2F5] px-6 py-10 lg:px-20">
      {/* Header Section */}
      <div className="max-w-5xl mx-auto mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#153D36] tracking-tight">
            Quản lý Thành viên
          </h1>
          <p className="text-gray-500 mt-1">Thêm mới tác giả hoặc độc giả vào hệ thống thư viện.</p>
        </div>

        {/* Custom Tab Switcher */}
        <div className="inline-flex p-1 bg-gray-200/80 rounded-xl backdrop-blur-sm">
          <button
            onClick={() => setActiveTab("tacgia")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
              activeTab === "tacgia"
                ? "bg-white text-[#153D36] shadow-sm active:scale-95"
                : "text-gray-600 hover:text-[#153D36] hover:bg-white/50"
            }`}
          >
            <PenTool size={18} />
            Tác giả
          </button>
          <button
            onClick={() => setActiveTab("docgia")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
              activeTab === "docgia"
                ? "bg-white text-[#153D36] shadow-sm active:scale-95"
                : "text-gray-600 hover:text-[#153D36] hover:bg-white/50"
            }`}
          >
            <Users size={18} />
            Độc giả
          </button>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl shadow-gray-200/50 overflow-hidden border border-gray-100">
        <div className="border-b border-gray-50 bg-gray-50/30 px-8 py-4 flex items-center gap-2">
            <PlusCircle size={20} className="text-[#153D36]" />
            <span className="font-bold text-[#153D36] uppercase tracking-wider text-sm">
                {activeTab === "docgia" ? "Biểu mẫu Độc giả" : "Biểu mẫu Tác giả"}
            </span>
        </div>
        
        <div className="p-8">
          <div className="transition-all duration-500 ease-in-out">
            {activeTab === "tacgia" ? (
              <AuthorForm
                form={authorForm}
                onChange={handleAuthorChange}
                onSubmit={handleSubmitAuthor}
                preview={authorAvatarPreview}
                setPreview={setAuthorAvatarPreview}
                typeBookOptions={typeBookOptions}
                isLoading={isLoading}
                fileInputRef={fileInputRef}
              />
            ) : (
              <ReaderForm
                form={readerForm}
                onChange={handleReaderChange}
                onSubmit={handleSubmitReader}
                preview={readerAvatarPreview}
                setPreview={setReaderAvatarPreview}
                typeReaderOptions={typeReaderOptions}
                isLoading={isLoading}
                fileInputRef1={fileInputRef1}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;