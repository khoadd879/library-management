import { useCurrentApp } from "@/components/context/app.context";
import { UserOutlined, EditOutlined } from "@ant-design/icons";
import { useState, useRef } from "react";

interface IUserProfile {
  username?: string;
  fullName?: string;
  gender?: string;
  createdAt?: string | Date;
  cardExpiryDate?: string | Date;
  address?: string;
  email?: string;
  phone?: string;
  avatar?: string | null;
}

const ProfilePage = () => {
  const { user } = useCurrentApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    address: "",
    email: "",
    phone: ""
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ép kiểu an toàn và cung cấp giá trị mặc định
  const userProfile = user as IUserProfile | undefined;

  const userData = {
    fullName: userProfile?.fullName,
    gender: userProfile?.gender,
    joinDate: userProfile?.createdAt 
      ? new Date(userProfile.createdAt).toLocaleDateString() 
      : undefined,
    expiryDate: userProfile?.cardExpiryDate
      ? new Date(userProfile.cardExpiryDate).toLocaleDateString()
      : undefined,
    address: userProfile?.address,
    email: userProfile?.email,
    phone: userProfile?.phone,
    avatar: userProfile?.avatar ?? null,
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setFormData({
      fullName: userData.fullName || "",
      gender: userData.gender || "",
      address: userData.address || "",
      email: userData.email || "",
      phone: userData.phone || ""
    });
  };

  const handleSaveClick = () => {
    // Xử lý lưu dữ liệu ở đây
    setIsEditing(false);
    // Gọi API hoặc cập nhật context
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Xử lý upload ảnh ở đây
      const reader = new FileReader();
      reader.onload = (event) => {
        // Cập nhật avatar preview
        // Trong thực tế, bạn cần upload lên server và lưu URL
      };
      reader.readAsDataURL(file);
    }
  };

  const renderEditableField = (name: string, value: string, placeholder: string) => {
    return (
      <input
        type="text"
        name={name}
        value={value}
        onChange={handleInputChange}
        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder={placeholder}
      />
    );
  };

  const renderReadOnlyField = (value?: string, placeholder: string = "Chưa cập nhật") => {
    return value ? (
      <span>{value}</span>
    ) : (
      <span className="text-gray-400 italic">{placeholder}</span>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-[#f4f7f9] min-h-screen">
      <div className="flex flex-col md:flex-row gap-8 bg-white p-8 rounded-xl shadow-lg">
        {/* Phần Avatar */}
        <div className="flex flex-col items-center w-full md:w-1/3 space-y-4">
          <div className="relative group">
            {userData.avatar ? (
              <img 
                src={userData.avatar} 
                alt="User Avatar"
                className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg transition-all duration-300 group-hover:opacity-80 cursor-pointer"
                onClick={handleAvatarClick}
              />
            ) : (
              <div 
                className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center border-4 border-white shadow-lg cursor-pointer"
                onClick={handleAvatarClick}
              >
                <UserOutlined className="text-5xl text-gray-500" />
              </div>
            )}
            {isEditing && (
              <button 
                className="absolute bottom-2 right-2 bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600 transition"
                onClick={handleAvatarClick}
              >
                <EditOutlined />
              </button>
            )}
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">
              {isEditing ? (
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="text-center border-b-2 border-blue-500 focus:outline-none"
                  placeholder="Họ và tên"
                />
              ) : renderReadOnlyField(userData.fullName, "Họ và tên")}
            </h2>
          </div>
          
          <div className="w-full space-y-2 pt-4 border-t border-gray-100">
            <div>
              <p className="text-sm text-gray-500">Ngày lập thẻ</p>
              <p className="font-medium">
                {renderReadOnlyField(userData.joinDate)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ngày hết thẻ</p>
              <p className="font-medium">
                {renderReadOnlyField(userData.expiryDate)}
              </p>
            </div>
          </div>
        </div>

        {/* Phần Thông tin */}
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <h3 className="text-xl font-semibold text-gray-800">Thông tin cá nhân</h3>
            {!isEditing ? (
              <button 
                onClick={handleEditClick}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                <EditOutlined /> Chỉnh sửa
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={handleCancelClick}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                >
                  Hủy
                </button>
                <button 
                  onClick={handleSaveClick}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  Lưu thay đổi
                </button>
              </div>
            )}
          </div>

          <div className="space-y-5">
            <InfoItem 
              label="Email" 
              value={isEditing ? (
                renderEditableField("email", formData.email, "Email")
              ) : renderReadOnlyField(userData.email, "Email")}
              fullWidth
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InfoItem 
                label="Số điện thoại" 
                value={isEditing ? (
                  renderEditableField("phone", formData.phone, "Số điện thoại")
                ) : renderReadOnlyField(userData.phone, "Số điện thoại")}
              />
              
              <InfoItem 
                label="Giới tính" 
                value={isEditing ? (
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                  </select>
                ) : renderReadOnlyField(userData.gender, "Giới tính")}
              />
            </div>

            <InfoItem 
              label="Địa chỉ" 
              value={isEditing ? (
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Địa chỉ"
                />
              ) : renderReadOnlyField(userData.address, "Địa chỉ")}
              fullWidth
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Component hiển thị thông tin
const InfoItem = ({ 
  label, 
  value, 
  fullWidth = false 
}: { 
  label: string; 
  value: React.ReactNode; 
  fullWidth?: boolean 
}) => (
  <div className={`${fullWidth ? 'col-span-1 md:col-span-2' : ''}`}>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="bg-gray-50 p-3 rounded-lg text-gray-800 break-words">
      {value}
    </div>
  </div>
);

export default ProfilePage;