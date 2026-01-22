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
import { FaUserPlus, FaPenFancy, FaUsers } from "react-icons/fa";

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
  const [authorAvatarPreview, setAuthorAvatarPreview] = useState<string | null>(
    null,
  );
  const [typeBookOptions, setTypeBookOptions] = useState<ITypeBookOption[]>([]);
  const [typeReaderOptions, setTypeReaderOptions] = useState<
    ITypeReaderOption[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef1 = useRef<HTMLInputElement | null>(null);

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

  const [readerAvatarPreview, setReaderAvatarPreview] = useState<string | null>(
    null,
  );
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
          new Map(
            dataArray.map((item: any) => [item.idTypeBook, item]),
          ).values(),
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
      if (authorForm.AvatarImage)
        formData.append("AvatarImage", authorForm.AvatarImage);
      const res = await addAuthorAPI(formData);
      if (res && res.statusCode === 201) {
        message.success("Thêm tác giả thành công!");
        setAuthorForm({
          IdTypeBook: "",
          NameAuthor: "",
          Nationality: "",
          Biography: "",
          AvatarImage: undefined,
        });
        setAuthorAvatarPreview(null);
      } else {
        message.error(res?.message || "Thêm tác giả thất bại!");
      }
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.message ||
        "Thêm tác giả thất bại!";
      message.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReader = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!readerForm.AvatarImage) {
      message.error("Vui lòng chọn ảnh đại diện!");
      return;
    }
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
      if (readerForm.AvatarImage)
        formData.append("AvatarImage", readerForm.AvatarImage);
      const res = await addReaderAPI(formData);
      if (res && res.statusCode === 201) {
        setReaderForm({
          NameReader: "",
          Email: "",
          Dob: "",
          Sex: "",
          Address: "",
          IdTypeReader: "",
          Phone: "",
          ReaderPassword: "123456",
          AvatarImage: undefined,
        });
        setReaderAvatarPreview(null);
        message.success("Thêm độc giả thành công!");
      } else {
        message.error(res?.message || "Vui lòng điền đầy đủ thông tin");
      }
    } catch (err: any) {
      const errorMsg = err?.message || "Thêm độc giả thất bại!";
      message.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    {
      key: "tacgia",
      label: "Tác giả",
      icon: <FaPenFancy className="text-lg" />,
    },
    {
      key: "docgia",
      label: "Độc giả",
      icon: <FaUsers className="text-lg" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#153D36] via-[#1A4A42] to-[#0D2621] px-8 py-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-1">
            Thêm mới thành viên
          </h1>
          <p className="text-emerald-200/80 text-sm">
            Thêm mới tác giả hoặc độc giả vào hệ thống thư viện
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mb-8 inline-flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex items-center gap-3 px-6 py-3.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                activeTab === tab.key
                  ? "bg-gradient-to-r from-[#153D36] to-[#1A4A42] text-white shadow-lg shadow-emerald-500/20"
                  : "text-gray-600 hover:bg-gray-50 hover:text-[#153D36]"
              }`}
            >
              <span
                className={`${activeTab === tab.key ? "text-emerald-300" : "text-gray-400"}`}
              >
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <FaUserPlus className="text-white text-lg" />
              </div>
              <div>
                <h3 className="text-white font-semibold">
                  {activeTab === "docgia"
                    ? "Biểu mẫu Độc giả"
                    : "Biểu mẫu Tác giả"}
                </h3>
                <p className="text-emerald-100 text-sm">
                  Điền thông tin để thêm mới
                </p>
              </div>
            </div>
          </div>

          {/* Form Content */}
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
    </div>
  );
};

export default AddUser;
