import {
    UserOutlined,
    EditOutlined,
    MailOutlined,
    PhoneOutlined,
    HomeOutlined,
    ManOutlined,
    WomanOutlined,
    CalendarOutlined,
    SaveOutlined,
    CloseOutlined,
    IdcardOutlined,
    CameraOutlined,
    WalletOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';
import { useState, useRef, useEffect } from 'react';
import {
    getTypeReadersAPI,
    updateReaderAPI,
    getListReader,
} from '@/services/api';
import { message, Modal, Tag, Spin } from 'antd';
import dayjs from 'dayjs';

const ProfilePage = () => {
    // --- STATE & LOGIC GIỮ NGUYÊN NHƯ CŨ ---
    const [userData, setUserData] = useState<
        (IUserProfileRequest & { createDate?: string; role?: string }) | null
    >(null);

    const [isEditing, setIsEditing] = useState(false);
    const [typeReaderOptions, setTypeReaderOptions] = useState<
        { value: string; label: string }[]
    >([]);
    const [selectedTypeReader, setSelectedTypeReader] = useState<string>('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [dob, setDob] = useState('');
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const formatDate = (isoDate: string): string => {
        return isoDate.split('T')[0];
    };

    // Format hiển thị đẹp hơn cho UI
    const displayDate = (isoDate: string): string => {
        return dayjs(isoDate).format('DD/MM/YYYY');
    };

    const [formData, setFormData] = useState({
        nameReader: '',
        gender: '',
        address: '',
        email: '',
        phone: '',
        password: '',
        sex: '',
        dob: '',
        idTypeReader: '',
    });

    const [totalDebt, setTotalDebt] = useState<number>(0);
    const [debtLoading, setDebtLoading] = useState(false);
    const [debtError, setDebtError] = useState<string | null>(null);

    const idUSer = localStorage.getItem('idUser');

    // --- LOGIC FUNCTIONS (Validate, Fetch, Save) GIỮ NGUYÊN ---
    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.nameReader.trim())
            newErrors.nameReader = 'Vui lòng nhập họ và tên';
        if (!selectedTypeReader)
            newErrors.idTypeReader = 'Vui lòng chọn loại độc giả';
        if (!formData.email.trim()) {
            newErrors.email = 'Vui lòng nhập email';
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }
        if (!formData.phone.trim())
            newErrors.phone = 'Vui lòng nhập số điện thoại';
        if (!formData.gender) newErrors.gender = 'Vui lòng chọn giới tính';
        if (!dob) newErrors.dob = 'Vui lòng chọn ngày sinh';
        if (!formData.address.trim())
            newErrors.address = 'Vui lòng nhập địa chỉ';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    useEffect(() => {
        const fetchTypeReaders = async () => {
            try {
                const res = await getTypeReadersAPI();
                let arr: any[] = [];
                if (Array.isArray(res)) arr = res;
                else if (res.data && Array.isArray(res.data)) arr = res.data;
                else if (res?.data?.data && Array.isArray(res.data.data))
                    arr = res.data.data;

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
                console.error('Lỗi khi lấy loại độc giả:', err);
                setTypeReaderOptions([]);
            }
        };
        fetchTypeReaders();
    }, [userData]);

    useEffect(() => {
        const fetchUserData = async () => {
            const idUser = localStorage.getItem('idUser');
            if (!idUser) return;
            try {
                const res = await getListReader();
                const listReaders = res.data;
                const user = listReaders.find(
                    (reader: IReader) => reader.idReader === idUser
                );
                if (user) {
                    setUserData({
                        idTypeReader: user.idTypeReader?.idTypeReader ?? '',
                        nameReader: user.nameReader ?? '',
                        sex: user.sex ?? '',
                        address: user.address ?? '',
                        email: user.email ?? '',
                        dob: user.dob ? formatDate(user.dob) : '2005-06-20',
                        phone: user.phone ?? '',
                        reader_username: user.readerAccount ?? '',
                        reader_password: '',
                        avatar: user.urlAvatar ?? '',
                        createDate: user.createDate ?? '',
                        role: user.role ?? '',
                    } as IUserProfileRequest & { createDate?: string; role?: string });
                }
            } catch (error) {
                console.error('Lỗi khi lấy thông tin người dùng:', error);
            }
        };
        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchDebt = async () => {
            if (!idUSer) return;
            setDebtLoading(true);
            setDebtError(null);
            try {
                const res = await getListReader();
                const listReaders = res.data;
                const user = listReaders.find(
                    (reader: IReader) => reader.idReader === idUSer
                );
                if (user && typeof user.totalDebt === 'number') {
                    setTotalDebt(user.totalDebt);
                } else {
                    setTotalDebt(0);
                }
            } catch (err) {
                setDebtError('Lỗi');
            } finally {
                setDebtLoading(false);
            }
        };
        fetchDebt();
    }, [idUSer]);

    const handleEditClick = () => {
        setIsEditing(true);
        setFormData({
            nameReader: userData?.nameReader ?? '',
            gender: userData?.sex ?? '',
            address: userData?.address ?? '',
            email: userData?.email ?? '',
            phone: userData?.phone ?? '',
            password: '',
            sex: userData?.sex ?? '',
            dob: userData?.dob ? formatDate(userData.dob) : '2005-06-20',
            idTypeReader: userData?.idTypeReader ?? '',
        });
        setDob(userData?.dob ? formatDate(userData.dob) : '2005-06-20');
        setErrors({});
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setErrors({});
        setAvatarFile(null);
        setAvatarPreview(null);
    };

    const handleSaveClick = async () => {
        if (!validateForm()) return;
        if (!idUSer) return;
        try {
            const form = new FormData();
            form.append('IdTypeReader', selectedTypeReader || '');
            form.append('NameReader', formData.nameReader || '');
            form.append('Sex', formData.gender || '');
            form.append('Address', formData.address || '');
            form.append('Email', formData.email || '');
            form.append('Dob', dob ? new Date(dob).toISOString() : '');
            form.append('Phone', formData.phone || '');

            // Key RoleName cho Swagger
            form.append('RoleName', userData?.role || '');

            if (formData.password)
                form.append('ReaderPassword', formData.password);
            if (avatarFile instanceof File)
                form.append('AvatarImage', avatarFile);

            await updateReaderAPI(idUSer, form);

            message.success('Cập nhật hồ sơ thành công!');
            window.dispatchEvent(new Event('user-profile-updated'));

            const res = await getListReader();
            const listReaders = res.data;
            const user = listReaders.find(
                (reader: IReader) => reader.idReader === idUSer
            );
            if (user) {
                setUserData({
                    idTypeReader: user.idTypeReader.idTypeReader ?? '',
                    nameReader: user.nameReader ?? '',
                    sex: user.sex ?? '',
                    address: user.address ?? '',
                    email: user.email ?? '',
                    dob: user.dob ? formatDate(user.dob) : '2005-06-20',
                    phone: user.phone ?? '',
                    reader_username: user.readerAccount ?? '',
                    reader_password: '',
                    avatar: user.urlAvatar ?? '',
                    createDate: user.createDate ?? '',
                    role: user.role ?? '',
                });
                setAvatarFile(null);
                setAvatarPreview(null);
            }
            setIsEditing(false);
        } catch (error) {
            message.error('Có lỗi xảy ra, vui lòng thử lại.');
            console.error(error);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
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

    // --- HELPER RENDERS UI MỚI ---

    // Hàm render Badge Role màu sắc
    const renderRoleBadge = (role: string) => {
        let color = 'blue';
        if (role?.toLowerCase().includes('admin')) color = 'gold';
        if (
            role?.toLowerCase().includes('staff') ||
            role?.toLowerCase().includes('thủ thư')
        )
            color = 'green';

        return (
            <Tag
                color={color}
                className="px-3 py-1 text-sm rounded-full font-semibold border-0 shadow-sm"
            >
                {role || 'Thành viên'}
            </Tag>
        );
    };

    // Component input custom có Icon
    const CustomInput = ({
        icon,
        name,
        value,
        onChange,
        placeholder,
        type = 'text',
        error,
        isEdit,
    }: any) => {
        if (!isEdit)
            return (
                <span className="font-medium text-gray-800">
                    {value || 'Chưa cập nhật'}
                </span>
            );

        return (
            <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    {icon}
                </div>
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className={`w-full pl-10 pr-3 py-2.5 bg-gray-50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 outline-none ${
                        error
                            ? 'border-red-500 ring-1 ring-red-200'
                            : 'border-gray-200'
                    }`}
                    placeholder={placeholder}
                />
                {error && (
                    <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#F0F2F5] p-4 md:p-8 flex justify-center items-start animate-fade-in font-sans">
            <div className="max-w-6xl w-full flex flex-col md:flex-row gap-6">
                {/* ================= LEFT COLUMN: IDENTITY CARD ================= */}
                <div className="w-full md:w-[350px] flex flex-col gap-6">
                    {/* Main Profile Card */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center relative overflow-hidden">
                        {/* Background Decoration */}
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-[#153D36] to-[#0D2621] opacity-100 z-0"></div>

                        <div className="relative z-10 mt-12 mb-4 group">
                            <div className="relative">
                                {avatarPreview ? (
                                    <img
                                        src={avatarPreview}
                                        alt="User Avatar"
                                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg cursor-pointer"
                                        onClick={handleAvatarClick}
                                    />
                                ) : userData?.avatar &&
                                  typeof userData.avatar === 'string' ? (
                                    <img
                                        src={userData.avatar}
                                        alt="User Avatar"
                                        className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg cursor-pointer bg-white"
                                        onClick={handleAvatarClick}
                                    />
                                ) : (
                                    <div
                                        className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-white shadow-lg cursor-pointer"
                                        onClick={handleAvatarClick}
                                    >
                                        <UserOutlined className="text-4xl text-gray-400" />
                                    </div>
                                )}

                                {/* Camera Icon Overlay on Hover/Edit */}
                                <div
                                    className={`absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 transition-opacity duration-300 cursor-pointer ${
                                        isEditing
                                            ? 'group-hover:opacity-100'
                                            : ''
                                    }`}
                                    onClick={handleAvatarClick}
                                >
                                    <CameraOutlined className="text-2xl" />
                                </div>

                                {isEditing && (
                                    <div
                                        className="absolute bottom-0 right-0 bg-[#153D36] text-white p-2 rounded-full shadow-md border-2 border-white cursor-pointer hover:bg-[#1E4D45] transition"
                                        onClick={handleAvatarClick}
                                    >
                                        <EditOutlined className="text-xs" />
                                    </div>
                                )}
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleAvatarChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>

                        <div className="text-center z-10 w-full">
                            {isEditing ? (
                                <div className="mb-2 px-4">
                                    <input
                                        type="text"
                                        name="nameReader"
                                        value={formData.nameReader}
                                        onChange={handleInputChange}
                                        className="text-center w-full text-xl font-bold text-gray-800 bg-transparent border-b-2 border-blue-500 focus:outline-none pb-1 placeholder-gray-300"
                                        placeholder="Nhập tên..."
                                    />
                                    {errors.nameReader && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.nameReader}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                                    {userData?.nameReader ||
                                        'Chưa cập nhật tên'}
                                </h2>
                            )}
                            <div className="flex justify-center mt-2">
                                {renderRoleBadge(userData?.role || '')}
                            </div>
                        </div>
                    </div>

                    {/* Stats / Mini Details Card */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4">
                        {/* Loại độc giả */}
                        <div className="flex justify-between items-center pb-4 border-b border-dashed border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                                    <IdcardOutlined />
                                </div>
                                <span className="text-gray-500 text-sm">
                                    Loại thẻ
                                </span>
                            </div>
                            <div className="font-semibold text-gray-700">
                                {isEditing ? (
                                    <div className="w-40">
                                        <select
                                            name="idTypeReader"
                                            value={selectedTypeReader}
                                            onChange={(e) =>
                                                setSelectedTypeReader(
                                                    e.target.value
                                                )
                                            }
                                            className="w-full text-sm p-1.5 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                        >
                                            <option value="">Chọn loại</option>
                                            {typeReaderOptions.map((opt) => (
                                                <option
                                                    key={opt.value}
                                                    value={opt.value}
                                                >
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.idTypeReader && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.idTypeReader}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    typeReaderOptions.find(
                                        (opt) =>
                                            opt.value === selectedTypeReader
                                    )?.label || 'N/A'
                                )}
                            </div>
                        </div>

                        {/* Ngày tham gia */}
                        <div className="flex justify-between items-center pb-4 border-b border-dashed border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                    <ClockCircleOutlined />
                                </div>
                                <span className="text-gray-500 text-sm">
                                    Ngày tham gia
                                </span>
                            </div>
                            <span className="font-semibold text-gray-700">
                                {userData?.createDate
                                    ? displayDate(userData.createDate)
                                    : '--/--/----'}
                            </span>
                        </div>

                        {/* Tổng nợ */}
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-50 rounded-lg text-red-500">
                                    <WalletOutlined />
                                </div>
                                <span className="text-gray-500 text-sm">
                                    Dư nợ
                                </span>
                            </div>
                            <span
                                className={`font-bold ${
                                    totalDebt > 0
                                        ? 'text-red-500'
                                        : 'text-green-500'
                                }`}
                            >
                                {debtLoading ? (
                                    <Spin size="small" />
                                ) : (
                                    `${totalDebt.toLocaleString()} đ`
                                )}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ================= RIGHT COLUMN: SETTINGS FORM ================= */}
                <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">
                                Thông tin cá nhân
                            </h3>
                            <p className="text-gray-400 text-sm mt-1">
                                Quản lý thông tin chi tiết của bạn
                            </p>
                        </div>

                        {!isEditing ? (
                            <button
                                onClick={handleEditClick}
                                className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all active:scale-95"
                            >
                                <EditOutlined /> <span>Chỉnh sửa</span>
                            </button>
                        ) : (
                            <div className="flex gap-3">
                                <button
                                    onClick={handleCancelClick}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-600 font-medium rounded-xl hover:bg-gray-200 transition-all active:scale-95"
                                >
                                    <CloseOutlined /> <span>Hủy</span>
                                </button>
                                <button
                                    onClick={handleSaveClick}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-[#153D36] text-white font-medium rounded-xl hover:bg-[#1E4D45] shadow-lg shadow-emerald-200 transition-all active:scale-95"
                                >
                                    <SaveOutlined /> <span>Lưu lại</span>
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {/* Email */}
                        <div className="col-span-2">
                            <Label text="Địa chỉ Email" />
                            <CustomInput
                                isEdit={isEditing}
                                icon={<MailOutlined />}
                                name="email"
                                value={
                                    isEditing ? formData.email : userData?.email
                                }
                                onChange={handleInputChange}
                                placeholder="example@email.com"
                                error={errors.email}
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <Label text="Số điện thoại" />
                            <CustomInput
                                isEdit={isEditing}
                                icon={<PhoneOutlined />}
                                name="phone"
                                value={
                                    isEditing ? formData.phone : userData?.phone
                                }
                                onChange={handleInputChange}
                                placeholder="0909..."
                                error={errors.phone}
                            />
                        </div>

                        {/* Gender */}
                        <div>
                            <Label text="Giới tính" />
                            {isEditing ? (
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        {formData.gender === 'Nam' ? (
                                            <ManOutlined />
                                        ) : (
                                            <WomanOutlined />
                                        )}
                                    </div>
                                    <select
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-3 py-2.5 bg-gray-50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none appearance-none ${
                                            errors.gender
                                                ? 'border-red-500'
                                                : 'border-gray-200'
                                        }`}
                                    >
                                        <option value="">Chọn giới tính</option>
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                    </select>
                                    {errors.gender && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.gender}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <span className="font-medium text-gray-800 flex items-center gap-2">
                                    {userData?.sex === 'Nam' ? (
                                        <ManOutlined className="text-blue-500" />
                                    ) : (
                                        <WomanOutlined className="text-pink-500" />
                                    )}
                                    {userData?.sex || 'Chưa cập nhật'}
                                </span>
                            )}
                        </div>

                        {/* Birthday */}
                        <div className="col-span-1">
                            <Label text="Ngày sinh" />
                            {isEditing ? (
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <CalendarOutlined />
                                    </div>
                                    <input
                                        type="date"
                                        name="dob"
                                        value={dob}
                                        onChange={(e) => setDob(e.target.value)}
                                        className={`w-full pl-10 pr-3 py-2.5 bg-gray-50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none ${
                                            errors.dob
                                                ? 'border-red-500'
                                                : 'border-gray-200'
                                        }`}
                                    />
                                </div>
                            ) : (
                                <span className="font-medium text-gray-800">
                                    {userData?.dob
                                        ? dayjs(userData.dob).format(
                                              'DD/MM/YYYY'
                                          )
                                        : 'Chưa cập nhật'}
                                </span>
                            )}
                        </div>

                        {/* Password (Edit only) */}
                        {isEditing && (
                            <div className="col-span-1 animate-fade-in-up">
                                <Label text="Mật khẩu mới (Tùy chọn)" />
                                <CustomInput
                                    isEdit={true}
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Nhập để đổi mật khẩu"
                                />
                            </div>
                        )}

                        {/* Address */}
                        <div className="col-span-2">
                            <Label text="Địa chỉ thường trú" />
                            {isEditing ? (
                                <div className="relative">
                                    <div className="absolute top-3 left-3 text-gray-400">
                                        <HomeOutlined />
                                    </div>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        rows={3}
                                        className={`w-full pl-10 pr-3 py-2 bg-gray-50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none ${
                                            errors.address
                                                ? 'border-red-500'
                                                : 'border-gray-200'
                                        }`}
                                        placeholder="Số nhà, tên đường..."
                                    />
                                </div>
                            ) : (
                                <p className="font-medium text-gray-800 leading-relaxed">
                                    {userData?.address || 'Chưa cập nhật'}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Avatar Modal */}
            <Modal
                open={showAvatarModal}
                onCancel={() => setShowAvatarModal(false)}
                footer={null}
                centered
                width={450}
                className="rounded-3xl overflow-hidden"
            >
                <div className="flex flex-col items-center justify-center p-6">
                    <h3 className="text-lg font-bold mb-4 text-gray-700">
                        Ảnh đại diện
                    </h3>
                    {avatarPreview || userData?.avatar ? (
                        <img
                            src={
                                avatarPreview ||
                                (typeof userData?.avatar === 'string'
                                    ? userData.avatar
                                    : undefined)
                            }
                            alt="Avatar Full"
                            className="w-80 h-80 object-cover rounded-full border-4 border-gray-100 shadow-xl"
                        />
                    ) : (
                        <div className="w-80 h-80 rounded-full bg-gray-100 flex items-center justify-center">
                            <UserOutlined className="text-6xl text-gray-300" />
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

// Sub-component Label cho gọn code
const Label = ({ text }: { text: string }) => (
    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        {text}
    </label>
);

export default ProfilePage;
