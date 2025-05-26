import React, { useEffect, useState } from "react";
import { message, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { addReaderAPI, addAuthorAPI } from "@/services/api";

const AddUser = () => {
  const [activeTab, setActiveTab] = useState<"docgia" | "tacgia">("docgia");
  const [ngayLapThe, setNgayLapThe] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [readerForm, setReaderForm] = useState<IAddReaderPayload>({
    idTypeReader: "1",
    nameReader: "",
    sex: "",
    address: "",
    email: "",
    dob: "",
    phone: "",
    readerPassword: "123456",
    totalDebt: 0,
    AvatarImage: undefined as any,
  });

  const [authorForm, setAuthorForm] = useState<IAddAuthor>({
    idTypeBook: "",
    nameAuthor: "",
    nationality: "",
    biography: "",
  });

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setNgayLapThe(today);
  }, []);

  const handleReaderChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setReaderForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAuthorChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setAuthorForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitReader = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("idTypeReader", readerForm.idTypeReader);
      formData.append("nameReader", readerForm.nameReader);
      formData.append("sex", readerForm.sex);
      formData.append("address", readerForm.address);
      formData.append("email", readerForm.email);
      formData.append("dob", new Date(readerForm.dob).toISOString());
      formData.append("phone", readerForm.phone);
      formData.append("readerPassword", readerForm.readerPassword);
      formData.append("totalDebt", readerForm.totalDebt.toString());
      if (readerForm.AvatarImage) {
        formData.append("AvatarImage", readerForm.AvatarImage);
      }

      const res = await addReaderAPI(formData);
      message.success("Thêm độc giả thành công!");
      console.log("Link ảnh từ BE:", res?.data?.imageUrl || "Không có");

      setReaderForm({
        idTypeReader: "1",
        nameReader: "",
        sex: "",
        address: "",
        email: "",
        dob: "",
        phone: "",
        readerPassword: "123456",
        totalDebt: 0,
        AvatarImage: undefined as any,
      });
      setAvatarPreview(null);
    } catch (error) {
      console.error(error);
      message.error("Thêm độc giả thất bại!");
    }
  };

  const handleSubmitAuthor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addAuthorAPI(authorForm);
      message.success("Thêm tác giả thành công!");
      setAuthorForm({
        idTypeBook: "",
        nameAuthor: "",
        nationality: "",
        biography: "",
      });
    } catch (error) {
      console.error(error);
      message.error("Thêm tác giả thất bại!");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#f4f7f9]">
      <div className="bg-[#153D36] px-12 py-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search..."
          className="w-[400px] px-4 py-2 rounded-full outline-none text-sm text-black bg-white"
        />
        <div className="text-xl text-white">🔔</div>
      </div>

      <div className="px-12 py-8">
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

        {activeTab === "docgia" ? (
          <form
            onSubmit={handleSubmitReader}
            className="bg-white p-8 rounded-xl shadow max-w-3xl mx-auto space-y-4"
          >
            <div className="flex gap-4 items-center">
              <div className="w-24 h-24 bg-gray-300 rounded-full overflow-hidden">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm flex justify-center items-center h-full text-gray-500">
                    Chưa có ảnh
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Upload
                  beforeUpload={() => false}
                  onChange={({ file }) => {
                    if (file && file.originFileObj) {
                      setReaderForm((prev) => ({
                        ...prev,
                        AvatarImage: file.originFileObj as File,
                      }));

                      setAvatarPreview(URL.createObjectURL(file.originFileObj));
                    }
                  }}
                  showUploadList={false}
                  accept="image/*"
                >
                  <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                </Upload>
              </div>
            </div>

            <input
              type="text"
              name="nameReader"
              value={readerForm.nameReader}
              onChange={handleReaderChange}
              placeholder="Họ và tên"
              className="w-full px-4 py-2 border rounded outline-none text-sm"
            />
            <input
              type="email"
              name="email"
              value={readerForm.email}
              onChange={handleReaderChange}
              placeholder="Email"
              className="w-full px-4 py-2 border rounded outline-none text-sm"
            />
            <input
              type="date"
              name="dob"
              value={readerForm.dob}
              onChange={handleReaderChange}
              className="w-full px-4 py-2 border rounded outline-none text-sm"
            />
            <select
              name="sex"
              value={readerForm.sex}
              onChange={handleReaderChange}
              className="w-full px-4 py-2 border rounded outline-none text-sm"
            >
              <option value="">-- Chọn giới tính --</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
            <input
              type="text"
              name="address"
              value={readerForm.address}
              onChange={handleReaderChange}
              placeholder="Địa chỉ"
              className="w-full px-4 py-2 border rounded outline-none text-sm"
            />
            <input
              type="text"
              name="phone"
              value={readerForm.phone}
              onChange={handleReaderChange}
              placeholder="Số điện thoại"
              className="w-full px-4 py-2 border rounded outline-none text-sm"
            />
            <input
              type="date"
              value={ngayLapThe}
              readOnly
              className="w-full px-4 py-2 border rounded outline-none text-sm bg-gray-100 text-gray-700"
            />
            <div className="pt-4 flex justify-center">
              <button
                type="submit"
                className="bg-[#153D36] text-white px-6 py-2 rounded text-sm font-semibold"
              >
                Thêm độc giả
              </button>
            </div>
          </form>
        ) : (
          <form
            onSubmit={handleSubmitAuthor}
            className="bg-white p-8 rounded-xl shadow max-w-3xl mx-auto space-y-4"
          >
            <input
              type="text"
              name="nameAuthor"
              value={authorForm.nameAuthor}
              onChange={handleAuthorChange}
              placeholder="Tên tác giả"
              className="w-full px-4 py-2 border rounded outline-none text-sm"
            />
            <input
              type="text"
              name="nationality"
              value={authorForm.nationality}
              onChange={handleAuthorChange}
              placeholder="Quốc tịch"
              className="w-full px-4 py-2 border rounded outline-none text-sm"
            />
            <select
              name="idTypeBook"
              value={authorForm.idTypeBook}
              onChange={handleAuthorChange}
              className="w-full px-4 py-2 border rounded outline-none text-sm"
            >
              <option value="">-- Chọn thể loại sách --</option>
              <option value="1">Tiểu thuyết</option>
              <option value="2">Trinh thám</option>
              <option value="3">Sách giáo dục</option>
            </select>
            <textarea
              name="biography"
              value={authorForm.biography}
              onChange={handleAuthorChange}
              placeholder="Tiểu sử"
              className="w-full px-4 py-2 border rounded outline-none text-sm"
            />
            <div className="pt-4 flex justify-center">
              <button
                type="submit"
                className="bg-[#153D36] text-white px-6 py-2 rounded text-sm font-semibold"
              >
                Thêm tác giả
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddUser;
