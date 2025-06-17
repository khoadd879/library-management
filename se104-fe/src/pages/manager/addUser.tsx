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
    null
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
    null
  );

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTypeReaderOptions = async () => {
      try {
        const res = await getTypeReadersAPI();
        const options = res.map((item: any) => ({
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
        console.log(res);
        const unique = Array.from(
          new Map(res?.map((item: any) => [item.idTypeBook, item])).values()
        ).map((item: any) => ({
          value: item.idTypeBook,
          label: item.nameTypeBook,
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
  const handleReaderChange = (
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
      | any
  ) => {
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

      if (readerForm.AvatarImage) {
        formData.append("AvatarImage", readerForm.AvatarImage);
      }

      const res = await addReaderAPI(formData);
      console.log(res);
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
        message.error(res.data.message || "Vui lòng điền đầy đủ thông tin");
      }
    } catch (err) {
      console.error(err);
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
          fileInputRef={fileInputRef}
        />
      )}
      {activeTab === "docgia" && (
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
  );
};

export default AddUser;
