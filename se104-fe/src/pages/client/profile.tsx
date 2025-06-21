import { UserOutlined, EditOutlined } from "@ant-design/icons";
import { useState, useRef, useEffect } from "react";
import {
  getTypeReadersAPI,
  updateReaderAPI,
  getListReader,
  getReaderByIdAPI,
} from "@/services/api";
import { message, Modal } from "antd";

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
  const [showAvatarModal, setShowAvatarModal] = useState(false);
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
            idTypeReader: user.idTypeReader?.idTypeReader ?? "",
            nameReader: user.nameReader ?? "",
            sex: user.sex ?? "",
            address: user.address ?? "",
            email: user.email ?? "",
            dob: user.dob ? formatDate(user.dob) : "2005-06-20",
            phone: user.phone ?? "",
            reader_username: user.readerAccount ?? "",
            reader_password: "", // Mật khẩu không được hiển thị
            avatar: user.urlAvatar ?? "",
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

  // Fetch mật khẩu người dùng
  useEffect(() => {
    const fetchPassword = async () => {
      const idUser = localStorage.getItem("idUser");
      if (!idUser) {
        console.error("Không tìm thấy idUser trong localStorage.");
        return;
      }

      try {
        const res = await getReaderByIdAPI(idUser);
        console.log("Mật khẩu người dùng:", res.password);
        setPassword(res.password || "");
      } catch (error) {
        console.error("Lỗi khi lấy thông tin mật khẩu người dùng:", error);
      }
    };

    fetchPassword();
  }, []);

  // Click chỉnh sửa
  const handleEditClick = () => {
    setIsEditing(true);
    setFormData({
      nameReader: userData?.nameReader ?? "",
      gender: userData?.sex ?? "",
      address: userData?.address ?? "",
      email: userData?.email ?? "",
      phone: userData?.phone ?? "",
      password: userData?.reader_password ?? "", // Nếu mật khẩu null, hiển thị trường nhập rỗng
      sex: userData?.sex ?? "",
      dob: userData?.dob ? formatDate(userData.dob) : "2005-06-20",
      idTypeReader: userData?.idTypeReader ?? "",
    });
    setDob(userData?.dob ? formatDate(userData.dob) : "2005-06-20");
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
      form.append("IdTypeReader", selectedTypeReader || "");
      form.append("NameReader", formData.nameReader || "");
      form.append("Sex", formData.gender || "");
      form.append("Address", formData.address || "");
      form.append("Email", formData.email || "");
      form.append("Dob", dob ? new Date(dob).toISOString() : "");
      form.append("Phone", formData.phone || "");
      if (formData.password) {
        form.append("ReaderPassword", formData.password);
      }
      if (avatarFile instanceof File) {
        form.append("AvatarImage", avatarFile);
      }
      await updateReaderAPI(idUSer, form);

      message.success("Cập nhật thông tin thành công!");
      window.dispatchEvent(new Event("user-profile-updated"));
      // Lấy lại thông tin user mới nhất từ backend
      const res = await getListReader();
      const user = res.find((reader: IReader) => reader.idReader === idUSer);
      if (user) {
        setUserData({
          idTypeReader: user.idTypeReader.idTypeReader ?? "",
          nameReader: user.nameReader ?? "",
          sex: user.sex ?? "",
          address: user.address ?? "",
          email: user.email ?? "",
          dob: user.dob ? formatDate(user.dob) : "2005-06-20",
          phone: user.phone ?? "",
          reader_username: user.readerAccount ?? "",
          reader_password: "", // Reset mật khẩu sau khi lưu
          avatar: user.urlAvatar ?? "",
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
    } else if (!isEditing && (avatarPreview || userData?.avatar)) {
      setShowAvatarModal(true);
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
    <div className="p-6 max-w-4xl mx-auto bg-gradient-to-br from-[#f4f7f9] to-[#e0f7fa] min-h-screen animate-fade-in">
      <div className="flex flex-col md:flex-row gap-8 bg-white p-8 rounded-2xl shadow-2xl animate-fade-in-up">
        {/* Avatar */}
        <div className="flex flex-col items-center w-full md:w-1/3 space-y-4">
          <div className="relative group">
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="User Avatar"
                className="w-40 h-40 rounded-full object-cover border-4 border-gradient-to-br from-blue-400 to-purple-400 shadow-xl transition-all duration-300 group-hover:scale-105 cursor-pointer"
                onClick={handleAvatarClick}
              />
            ) : userData?.avatar && typeof userData.avatar === "string" ? (
              <img
                src={userData.avatar}
                alt="User Avatar"
                className="w-40 h-40 rounded-full object-cover border-4 border-gradient-to-br from-blue-400 to-purple-400 shadow-xl transition-all duration-300 group-hover:scale-105 cursor-pointer"
                onClick={handleAvatarClick}
              />
            ) : (
              <div
                className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center border-4 border-gradient-to-br from-blue-400 to-purple-400 shadow-xl cursor-pointer group-hover:scale-105 transition-all duration-300"
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
          {/* Avatar Modal */}
          <Modal
            open={showAvatarModal}
            onCancel={() => setShowAvatarModal(false)}
            footer={null}
            centered
            styles={{ body: { padding: 0, background: "transparent" } }}
            width={400}
            className="avatar-modal"
          >
            <div className="flex flex-col items-center justify-center p-4">
              {avatarPreview || userData?.avatar ? (
                <img
                  src={
                    avatarPreview ||
                    (typeof userData?.avatar === "string"
                      ? userData.avatar
                      : undefined)
                  }
                  alt="Avatar lớn"
                  className="w-80 h-80 object-cover rounded-full border-4 border-gradient-to-br from-blue-400 to-purple-400 shadow-2xl bg-white"
                />
              ) : (
                <div className="w-80 h-80 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center border-4 border-gradient-to-br from-blue-400 to-purple-400 shadow-2xl">
                  <UserOutlined className="text-7xl text-gray-400" />
                </div>
              )}
            </div>
          </Modal>

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

            {isEditing &&
              password &&
              typeof password === "string" &&
              password.trim() !== "" && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập mật khẩu mới"
                  />
                </div>
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
                  renderReadOnlyField(
                    userData?.dob ?? "2005-06-20",
                    "Ngày sinh"
                  )
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
