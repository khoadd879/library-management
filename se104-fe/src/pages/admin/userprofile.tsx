import { useState } from "react";
import { UserOutlined, EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
interface IUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  gender: string;
  password: string;
  joinDate: string;
  expireDate?: string;
  permissions: {
    receiveBooks: boolean;
    manageUsers: boolean;
    borrowBooks: boolean;
    viewLists: boolean;
    viewReports: boolean;
  };
  avatar?: string | null;
  dob?: string;
}

const AdminUserEdit = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<IUser>({
    id: "1",
    username: "nguyenvana",
    fullName: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0123456789",
    address: "Hà Nội",
    gender: "Nam",
    password: "123",
    joinDate: "15/03/2023",
    expireDate: "2025-12-31",
    permissions: {
      receiveBooks: true,
      manageUsers: false,
      borrowBooks: true,
      viewLists: true,
      viewReports: false,
    },
    avatar: null,
    dob: "",
  });
  const [editFields, setEditFields] = useState({
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    address: user.address || "",
    gender: user.gender || "Nam",
    password: "",
    dob: user.dob || "",
    joinDate: user.joinDate, // add joinDate to editFields state
    expireDate: user.expireDate || ""
  });
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  const handlePermissionChange = (permission: keyof IUser['permissions']) => {
    setUser(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: !prev.permissions[permission]
      }
    }));
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFields(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setUser(prev => ({
      ...prev,
      fullName: editFields.fullName,
      email: editFields.email,
      phone: editFields.phone,
      address: editFields.address,
      gender: editFields.gender,
      password: editFields.password ? editFields.password : prev.password,
      expireDate: editFields.expireDate,
      dob: editFields.dob,
      // username is not changed
    }));
    setIsEditing(false);
    // Gọi API lưu thay đổi
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    if (!y || !m || !d) return dateStr;
    return `${d}/${m}/${y}`;
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
        // Gọi API để cập nhật ảnh đại diện
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    const fileInput = document.getElementById('avatar-upload') as HTMLInputElement;
    fileInput.click();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-[#f4f7f9] min-h-screen">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h1>
          {isEditing ? (
            <div className="flex gap-2">
              <button 
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                <CloseOutlined /> Hủy
              </button>
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                <SaveOutlined /> Lưu
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              <EditOutlined /> Chỉnh sửa
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* User Info */}
          <div className="w-full md:w-1/3">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center border-4 border-white shadow-lg relative group">
                {(avatarUrl || user.avatar) ? (
                  <img
                    src={avatarUrl || user.avatar || undefined}
                    alt="User Avatar"
                    className="w-40 h-40 rounded-full object-cover"
                  />
                ) : (
                  <UserOutlined className="text-5xl text-gray-500" />
                )}
                {isEditing && (
                  <div
                    className="absolute inset-0 bg-black bg-opacity-10 rounded-full flex items-center justify-center cursor-pointer group-hover:bg-opacity-30 transition"
                    style={{ cursor: 'pointer' }}
                    onClick={handleAvatarClick}
                    title="Thay đổi ảnh đại diện"
                  >
                    <EditOutlined className="text-white text-2xl opacity-80" />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </div>
                )}
              </div>
              
              <div className="text-center w-full">
                <h2 className="text-2xl font-bold text-gray-800">
                  {isEditing ? (
                    <input
                      type="text"
                      name="fullName"
                      value={editFields.fullName}
                      onChange={handleFieldChange}
                      placeholder="Họ và tên"
                      className="w-full text-center border-b-2 border-blue-500 focus:outline-none"
                    />
                  ) : user.fullName}
                </h2>
              </div>
              
              <div className="w-full space-y-2">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={editFields.email}
                      onChange={handleFieldChange}
                      placeholder="Email"
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : <p className="p-2">{user.email}</p>}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Số điện thoại</p>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={editFields.phone}
                      onChange={handleFieldChange}
                      placeholder="Số điện thoại"
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : <p className="p-2">{user.phone}</p>}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Địa chỉ</p>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={editFields.address}
                      onChange={handleFieldChange}
                      placeholder="Địa chỉ"
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : <p className="p-2">{user.address}</p>}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Giới tính</p>
                  {isEditing ? (
                    <select
                      name="gender"
                      value={editFields.gender}
                      onChange={handleFieldChange}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </select>
                  ) : <p className="p-2">{user.gender}</p>}
                </div>
                <div className="w-full flex gap-2">
                  <div className="w-1/2">
                    <p className="text-sm font-medium text-gray-500">Ngày tham gia</p>
                    {isEditing ? (
                      <input
                        type="date"
                        name="joinDate"
                        value={editFields.joinDate}
                        onChange={handleFieldChange}
                        placeholder="Ngày tham gia"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : <p className="p-2">{formatDate(user.joinDate)}</p>}
                  </div>
                  <div className="w-1/2">
                    <p className="text-sm font-medium text-gray-500">Ngày hết hạn</p>
                    {isEditing ? (
                      <input
                        type="date"
                        name="expireDate"
                        value={editFields.expireDate}
                        onChange={handleFieldChange}
                        placeholder="Ngày hết hạn"
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : <p className="p-2">{formatDate(user.expireDate || "")}</p>}
                  </div>
                </div>
                                <div>
                  <p className="text-sm text-gray-500">Ngày sinh</p>
                  {isEditing ? (
                    <input
                      type="date"
                      name="dob"
                      value={editFields.dob}
                      onChange={handleFieldChange}
                      placeholder="Ngày sinh"
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : <p className="p-2">{editFields.dob ? formatDate(editFields.dob) : ""}</p>}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mật khẩu</p>
                  {isEditing ? (
                    <input
                      type="text"
                      name="password"
                      value={editFields.password === "" ? user.password : editFields.password}
                      onChange={handleFieldChange}
                      placeholder="Mật khẩu"
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : <p className="p-2">******</p>}
                </div>

              </div>
            </div>
          </div>

          {/* Permissions */}
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Phân quyền</h3>
            
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border ${isEditing ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Tiếp nhận sách</h4>
                  {isEditing ? (
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={user.permissions.receiveBooks}
                        onChange={() => handlePermissionChange('receiveBooks')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                  ) : (
                    <span className={`px-2 py-1 rounded text-sm ${user.permissions.receiveBooks ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.permissions.receiveBooks ? 'Có quyền' : 'Không có quyền'}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">Cho phép tiếp nhận sách mới vào thư viện</p>
              </div>

              <div className={`p-4 rounded-lg border ${isEditing ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Thêm độc giả/tác giả</h4>
                  {isEditing ? (
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={user.permissions.manageUsers}
                        onChange={() => handlePermissionChange('manageUsers')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                  ) : (
                    <span className={`px-2 py-1 rounded text-sm ${user.permissions.manageUsers ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.permissions.manageUsers ? 'Có quyền' : 'Không có quyền'}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">Cho phép thêm mới độc giả và tác giả</p>
              </div>

              <div className={`p-4 rounded-lg border ${isEditing ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Mượn trả sách</h4>
                  {isEditing ? (
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={user.permissions.borrowBooks}
                        onChange={() => handlePermissionChange('borrowBooks')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                  ) : (
                    <span className={`px-2 py-1 rounded text-sm ${user.permissions.borrowBooks ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.permissions.borrowBooks ? 'Có quyền' : 'Không có quyền'}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">Cho phép quản lý quá trình mượn và trả sách</p>
              </div>

              <div className={`p-4 rounded-lg border ${isEditing ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Danh sách</h4>
                  {isEditing ? (
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={user.permissions.viewLists}
                        onChange={() => handlePermissionChange('viewLists')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                  ) : (
                    <span className={`px-2 py-1 rounded text-sm ${user.permissions.viewLists ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.permissions.viewLists ? 'Có quyền' : 'Không có quyền'}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">Cho phép xem các danh sách sách, độc giả, tác giả</p>
              </div>

              <div className={`p-4 rounded-lg border ${isEditing ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Báo cáo</h4>
                  {isEditing ? (
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={user.permissions.viewReports}
                        onChange={() => handlePermissionChange('viewReports')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                  ) : (
                    <span className={`px-2 py-1 rounded text-sm ${user.permissions.viewReports ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.permissions.viewReports ? 'Có quyền' : 'Không có quyền'}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">Cho phép xem các báo cáo thống kê</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUserEdit;