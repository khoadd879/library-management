import { UserOutlined, EditOutlined } from "@ant-design/icons";
import { useState, useRef, useEffect } from "react";
import {
  getTypeReadersAPI,
  updateReaderAPI,
  getListReader,
} from "@/services/api";
import { message } from "antd";

const ProfilePage = () => {
  const [userData, setUserData] = useState<IUserProfileRequest | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [typeReaderOptions, setTypeReaderOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedTypeReader, setSelectedTypeReader] = useState<string>("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formatDate = (isoDate: string): string => {
    return isoDate.split("T")[0];
  };

  const [formData, setFormData] = useState({
    nameReader: "",
    gender: "",
    address: "",
    email: "",
    phone: "",
    password: "",
    sex: "",
    dob: "",
    idTypeReader: "",
  });

  const idUSer = localStorage.getItem("idUser");

  // Fetch loại độc giả
  useEffect(() => {
    const fetchTypeReaders = async () => {
      try {
        const res = await getTypeReadersAPI();
        console.log("Loại độc giả:", res);
        const arr = Array.isArray(res) ? res : res.data?.data || [];
        const options = arr.map((item: any) => ({
          value: item.idTypeReader,
          label: item.nameTypeReader,
        }));
        setTypeReaderOptions(options);
        if (userData?.idTypeReader) {
          setSelectedTypeReader(userData.idTypeReader);
        } else if (options.length > 0) {
          setSelectedTypeReader(options[0].value);
        }
      } catch (err) {
        console.error("Lỗi khi lấy loại độc giả:", err);
        setTypeReaderOptions([]);
      }
    };
    fetchTypeReaders();
  }, [userData]);

  // Fetch thông tin người dùng
  useEffect(() => {
    const fetchUserData = async () => {
      const idUser = localStorage.getItem("idUser");
      if (!idUser) {
        console.error("Không tìm thấy idUser trong localStorage.");
        return;
      }

      try {
        const res = await getListReader();
        const user = res.find((reader: IReader) => reader.idReader === idUser);
        if (user) {
          setUserData({
            idTypeReader: user.idTypeReader.idTypeReader,
            nameReader: user.nameReader,
            sex: user.sex,
            address: user.address,
            email: user.email,
            dob: formatDate(user.dob),
            phone: user.phone,
            reader_username: user.readerAccount,
            reader_password: "", // Mật khẩu không được hiển thị
            avatar: user.urlAvatar,
          });
        } else {
          console.error("Không tìm thấy thông tin người dùng.");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };

    fetchUserData();
  }, []);

  // Click chỉnh sửa
  const handleEditClick = () => {
    setIsEditing(true);

    setFormData({
      nameReader: userData?.nameReader || "",
      gender: userData?.sex || "",
      address: userData?.address || "",
      email: userData?.email || "",
      phone: userData?.phone || "",
      password: "",
      sex: userData?.sex || "",
      dob: userData?.dob || "",
      idTypeReader: userData?.idTypeReader || "",
    });
    setDob(userData?.dob ? formatDate(userData.dob) : "");
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  // Lưu thông tin
  const handleSaveClick = async () => {
    if (!idUSer) {
      console.error("Không tìm thấy idUser trong localStorage.");
      return;
    }
    try {
      const form = new FormData();
      form.append("nameReader", formData.nameReader || "");
      form.append("sex", formData.gender || "");
      form.append("address", formData.address || "");
      form.append("email", formData.email || "");
      form.append("phone", formData.phone || "");
      form.append("dob", dob ? new Date(dob).toISOString() : "");
      form.append("idTypeReader", selectedTypeReader);
      if (password) {
        form.append("reader_password", password);
      }
      if (avatarFile) {
        form.append("AvatarImage", avatarFile); // Đúng key backend yêu cầu
      }
      await updateReaderAPI(idUSer, form);
      message.success("Cập nhật thông tin thành công!");
      // Lấy lại thông tin user mới nhất từ backend
      const res = await getListReader();
      const user = res.find((reader: IReader) => reader.idReader === idUSer);
      if (user) {
        setUserData({
          idTypeReader: user.idTypeReader.idTypeReader,
          nameReader: user.nameReader,
          sex: user.sex,
          address: user.address,
          email: user.email,
          dob: formatDate(user.dob),
          phone: user.phone,
          reader_username: user.readerAccount,
          reader_password: "",
          avatar: user.urlAvatar,
        });
        setAvatarFile(null);
        setAvatarPreview(null);
      }
      setIsEditing(false);
    } catch (error) {
      message.error("Cập nhật thất bại. Vui lòng thử lại.");
      console.error("Lỗi khi cập nhật thông tin:", error);
    }
  };

  // Sự kiện nhập liệu
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const renderEditableField = (
    name: string,
    value: string,
    placeholder: string
  ) => {
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

  const renderReadOnlyField = (
    value?: string,
    placeholder: string = "Chưa cập nhật"
  ) => {
    return value ? (
      <span>{value}</span>
    ) : (
      <span className="text-gray-400 italic">{placeholder}</span>
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-[#f4f7f9] min-h-screen">
      <div className="flex flex-col md:flex-row gap-8 bg-white p-8 rounded-xl shadow-lg">
        {/* Avatar */}
        <div className="flex flex-col items-center w-full md:w-1/3 space-y-4">
          <div className="relative group">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="User Avatar"
                className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg transition-all duration-300 group-hover:opacity-80 cursor-pointer"
                onClick={handleAvatarClick}
              />
            ) : userData?.avatar && typeof userData.avatar === "string" ? (
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
                  name="nameReader"
                  value={formData.nameReader}
                  onChange={handleInputChange}
                  className="text-center border-b-2 border-blue-500 focus:outline-none"
                  placeholder="Họ và tên"
                />
              ) : (
                renderReadOnlyField(
                  userData?.nameReader ?? undefined,
                  "Họ và tên"
                )
              )}
            </h2>
          </div>

          <div className="w-full space-y-2 pt-4 border-t border-gray-100">
            <div>
              <p className="text-sm text-gray-500">Loại độc giả</p>
              <p className="font-medium">
                {isEditing ? (
                  <select
                    name="idTypeReader"
                    value={selectedTypeReader}
                    onChange={(e) => setSelectedTypeReader(e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Chọn loại độc giả</option>
                    {typeReaderOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  typeReaderOptions.find(
                    (opt) => opt.value === selectedTypeReader
                  )?.label || "Chưa cập nhật"
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Thông tin cá nhân */}
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Thông tin cá nhân
            </h3>
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
              value={
                isEditing
                  ? renderEditableField("email", formData.email, "Email")
                  : renderReadOnlyField(userData?.email ?? undefined, "Email")
              }
              fullWidth
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InfoItem
                label="Số điện thoại"
                value={
                  isEditing
                    ? renderEditableField(
                        "phone",
                        formData.phone,
                        "Số điện thoại"
                      )
                    : renderReadOnlyField(
                        userData?.phone ?? undefined,
                        "Số điện thoại"
                      )
                }
              />

              <InfoItem
                label="Giới tính"
                value={
                  isEditing ? (
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
                  ) : (
                    renderReadOnlyField(userData?.sex ?? undefined, "Giới tính")
                  )
                }
              />
            </div>

            <InfoItem
              label="Địa chỉ"
              value={
                isEditing ? (
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Địa chỉ"
                  />
                ) : (
                  renderReadOnlyField(userData?.address ?? undefined, "Địa chỉ")
                )
              }
              fullWidth
            />

            {isEditing && (
              <InfoItem
                label="Mật khẩu"
                value={
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập mật khẩu mới"
                  />
                }
                fullWidth
              />
            )}

            <InfoItem
              label="Ngày sinh"
              value={
                isEditing ? (
                  <input
                    type="date"
                    name="dob"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="YYYY-MM-DD"
                  />
                ) : (
                  renderReadOnlyField(userData?.dob ?? undefined, "Ngày sinh")
                )
              }
              fullWidth
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component hiển thị label và value
const InfoItem = ({
  label,
  value,
  fullWidth = false,
}: {
  label: string;
  value: React.ReactNode;
  fullWidth?: boolean;
}) => (
  <div className={`${fullWidth ? "col-span-1 md:col-span-2" : ""}`}>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="bg-gray-50 p-3 rounded-lg text-gray-800 break-words">
      {value}
    </div>
  </div>
);

export default ProfilePage;
