import { Spin } from "antd";
import { User, Globe, BookOpen, FileText, Camera, ShieldCheck } from "lucide-react";

const AuthorForm = ({
  form,
  onChange,
  onSubmit,
  preview,
  setPreview,
  typeBookOptions,
  isLoading,
  fileInputRef,
}: any) => {
  return (
    <form
      onSubmit={onSubmit}
      className="max-w-4xl mx-auto space-y-8"
    >
      {/* Avatar Upload Section */}
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
                <span className="text-[10px] uppercase font-bold tracking-wider mt-2">No Photo</span>
              </div>
            )}
            
            {/* Overlay when hover */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Camera className="text-white" size={24} />
            </div>
          </div>
        </div>

        <div className="mt-4 sm:mt-0 text-center sm:text-left space-y-2">
          <h3 className="text-lg font-bold text-gray-800">Ảnh đại diện tác giả</h3>
          <p className="text-sm text-gray-500 mb-3">Dùng định dạng .jpg, .png. Kích thước tối đa 2MB.</p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-[#153D36] rounded-xl hover:bg-[#153D36] hover:text-white hover:border-[#153D36] text-sm font-bold transition-all shadow-sm active:scale-95"
          >
            <Camera size={16} />
            Thay đổi ảnh
          </button>
        </div>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
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

      {/* Form Fields Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tên tác giả */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
            <User size={14} className="text-[#153D36]" /> Họ và tên
          </label>
          <div className="relative group">
            <input
              type="text"
              name="NameAuthor"
              value={form.NameAuthor}
              onChange={onChange}
              placeholder="Ví dụ: Nguyễn Nhật Ánh"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-[#153D36]/5 focus:border-[#153D36] focus:bg-white transition-all text-sm font-medium"
            />
          </div>
        </div>

        {/* Quốc tịch */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
            <Globe size={14} className="text-[#153D36]" /> Quốc tịch
          </label>
          <input
            type="text"
            name="Nationality"
            value={form.Nationality}
            onChange={onChange}
            placeholder="Ví dụ: Việt Nam"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-[#153D36]/5 focus:border-[#153D36] focus:bg-white transition-all text-sm font-medium"
          />
        </div>

        {/* Thể loại sách */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
            <BookOpen size={14} className="text-[#153D36]" /> Thể loại sáng tác chính
          </label>
          <div className="relative">
            <select
              name="IdTypeBook"
              value={form.IdTypeBook}
              onChange={onChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-[#153D36]/5 focus:border-[#153D36] focus:bg-white transition-all text-sm font-medium appearance-none cursor-pointer"
            >
              <option value="">-- Chọn thể loại sách --</option>
              {typeBookOptions?.map((opt: any) => (
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

        {/* Tiểu sử */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
            <FileText size={14} className="text-[#153D36]" /> Tiểu sử tác giả
          </label>
          <textarea
            name="Biography"
            value={form.Biography}
            onChange={onChange}
            rows={4}
            placeholder="Viết một vài dòng giới thiệu về cuộc đời và sự nghiệp của tác giả..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-4 focus:ring-[#153D36]/5 focus:border-[#153D36] focus:bg-white transition-all text-sm font-medium resize-none"
          />
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-6 flex justify-end border-t border-gray-100">
        <button
          type="submit"
          disabled={isLoading}
          className={`group relative overflow-hidden px-10 py-3.5 rounded-xl text-sm font-extrabold transition-all duration-300 shadow-lg shadow-[#153D36]/20 flex items-center gap-3 ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-[#153D36] text-white hover:bg-[#1a4a42] hover:-translate-y-0.5 active:translate-y-0"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Spin size="small" className="brightness-200" />
              <span>Đang xử lý...</span>
            </div>
          ) : (
            <>
              <ShieldCheck size={18} className="group-hover:animate-pulse" />
              <span>Lưu thông tin tác giả</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default AuthorForm;