import React from "react";
import { Spin } from "antd";
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Phone, 
  Camera, 
  ShieldCheck, 
  Contact, 
  VenusAndMars 
} from "lucide-react";

interface ReaderFormProps {
  form: any;
  onChange: (
    e: React.ChangeEvent<any> | { target: { name: string; value: any } }
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  preview: string | null;
  setPreview: (url: string | null) => void;
  typeReaderOptions: { value: string; label: string }[];
  isLoading: boolean;
  fileInputRef1: React.RefObject<HTMLInputElement | null>;
}

const ReaderForm = ({
  form,
  onChange,
  onSubmit,
  preview,
  setPreview,
  typeReaderOptions,
  isLoading,
  fileInputRef1,
}: ReaderFormProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Avatar Section - Đồng bộ với AuthorForm */}
      <div className="flex flex-col items-center sm:flex-row sm:gap-8 bg-gray-50/50 p-6 rounded-2xl border border-dashed border-gray-200">
        <div className="relative group">
          <div className="w-32 h-32 bg-white rounded-2xl overflow-hidden border-4 border-white shadow-lg ring-1 ring-gray-100 relative">
            {preview ? (
              <img
                src={preview}
                alt="avatar"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="flex flex-col justify-center items-center h-full text-gray-400 bg-gray-50">
                <User size={40} strokeWidth={1} />
                <span className="text-[10px] uppercase font-bold tracking-wider mt-2">Độc giả</span>
              </div>
            )}
            <div 
              onClick={() => fileInputRef1.current?.click()}
              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Camera className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="mt-4 sm:mt-0 text-center sm:text-left space-y-2">
          <h3 className="text-lg font-bold text-gray-800">Ảnh chân dung độc giả</h3>
          <p className="text-sm text-gray-500 mb-3">Tải ảnh lên để in thẻ thư viện.</p>
          <button
            type="button"
            onClick={() => fileInputRef1.current?.click()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-[#153D36] rounded-xl hover:bg-[#153D36] hover:text-white hover:border-[#153D36] text-sm font-bold transition-all shadow-sm active:scale-95"
          >
            <Camera size={16} />
            Chọn ảnh thẻ
          </button>
        </div>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef1}
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setPreview(URL.createObjectURL(file));
              onChange({ target: { name: "AvatarImage", value: file } });
            }
          }}
        />
      </div>

      {/* Form Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        
        {/* Loại độc giả - Chiếm 2 cột để nổi bật */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
            <Contact size={14} className="text-[#153D36]" /> Đối tượng độc giả
          </label>
          <div className="relative">
            <select
              name="IdTypeReader"
              value={form.IdTypeReader}
              onChange={onChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-[#153D36]/5 focus:border-[#153D36] focus:bg-white transition-all text-sm font-medium appearance-none cursor-pointer"
            >
              <option value="">-- Chọn loại độc giả --</option>
              {typeReaderOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>

        {/* Họ và tên */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
            <User size={14} className="text-[#153D36]" /> Họ và tên
          </label>
          <input
            type="text"
            name="NameReader"
            value={form.NameReader}
            onChange={onChange}
            placeholder="Nguyễn Văn A"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-[#153D36]/5 focus:border-[#153D36] focus:bg-white transition-all text-sm font-medium"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
            <Mail size={14} className="text-[#153D36]" /> Địa chỉ Email
          </label>
          <input
            type="email"
            name="Email"
            value={form.Email}
            onChange={onChange}
            placeholder="example@gmail.com"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-[#153D36]/5 focus:border-[#153D36] focus:bg-white transition-all text-sm font-medium"
          />
        </div>

        {/* Ngày sinh */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
            <Calendar size={14} className="text-[#153D36]" /> Ngày sinh
          </label>
          <input
            type="date"
            name="Dob"
            value={form.Dob}
            onChange={onChange}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-[#153D36]/5 focus:border-[#153D36] focus:bg-white transition-all text-sm font-medium"
          />
        </div>

        {/* Giới tính */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
            <VenusAndMars size={14} className="text-[#153D36]" /> Giới tính
          </label>
          <div className="relative">
            <select
              name="Sex"
              value={form.Sex}
              onChange={onChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-[#153D36]/5 focus:border-[#153D36] focus:bg-white transition-all text-sm font-medium appearance-none"
            >
              <option value="">-- Chọn giới tính --</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
               <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>

        {/* Số điện thoại */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
            <Phone size={14} className="text-[#153D36]" /> Số điện thoại
          </label>
          <input
            type="text"
            name="Phone"
            value={form.Phone}
            onChange={onChange}
            placeholder="09xx xxx xxx"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-[#153D36]/5 focus:border-[#153D36] focus:bg-white transition-all text-sm font-medium"
          />
        </div>

        {/* Địa chỉ */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
            <MapPin size={14} className="text-[#153D36]" /> Địa chỉ liên lạc
          </label>
          <input
            type="text"
            name="Address"
            value={form.Address}
            onChange={onChange}
            placeholder="Số nhà, tên đường, quận/huyện..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-[#153D36]/5 focus:border-[#153D36] focus:bg-white transition-all text-sm font-medium"
          />
        </div>
      </div>

      {/* Submit Button Section */}
      <div className="pt-8 flex justify-end border-t border-gray-100">
        <button
          type="submit"
          disabled={isLoading}
          className={`group relative overflow-hidden px-10 py-4 rounded-xl text-sm font-extrabold transition-all duration-300 shadow-lg shadow-[#153D36]/20 flex items-center gap-3 ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-[#153D36] text-white hover:bg-[#1a4a42] hover:-translate-y-1 active:translate-y-0"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <Spin size="small" className="brightness-200" />
              <span>Đang tạo tài khoản...</span>
            </div>
          ) : (
            <>
              <ShieldCheck size={18} className="group-hover:scale-110 transition-transform" />
              <span>Đăng ký độc giả mới</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ReaderForm;