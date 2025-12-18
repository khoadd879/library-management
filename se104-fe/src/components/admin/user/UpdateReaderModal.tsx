import React, { useEffect, useState } from 'react';
import {
    Modal,
    Form,
    Input,
    Select,
    DatePicker,
    Button,
    Upload,
    Avatar,
    Row,
    Col,
    message,
} from 'antd';
import {
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    CameraOutlined,
    LockOutlined,
    EnvironmentOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import type { RcFile } from 'antd/es/upload';

interface IUpdateReaderModalProps {
    open: boolean;
    onClose: () => void;
    initialData: {
        nameReader: string;
        email: string;
        dob: string;
        sex: string;
        address: string;
        phone: string;
        idTypeReader: string;
        urlAvatar?: string | null;
        readerPassword?: string;
        role_name: string; // Quan trọng
    };
    typeReaderOptions: { value: string; label: string }[];
    onSubmit: (formData: FormData) => void;
    isLoading: boolean;
}

const UpdateReaderModal: React.FC<IUpdateReaderModalProps> = ({
    open,
    onClose,
    initialData,
    typeReaderOptions,
    onSubmit,
    isLoading,
}) => {
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [changePass, setChangePass] = useState(false); // State để toggle đổi pass

    useEffect(() => {
        if (open && initialData) {
            form.setFieldsValue({
                ...initialData,
                dob: initialData.dob ? dayjs(initialData.dob) : null,
                // Không fill password cũ để bảo mật, chỉ gửi lên nếu user nhập mới
                readerPassword: '',
            });
            setImageUrl(initialData.urlAvatar || null);
            setFileList([]);
            setChangePass(false);
        }
    }, [open, initialData, form]);

    const onFinish = (values: any) => {
        const formData = new FormData();

        // Append các trường cơ bản
        formData.append('NameReader', values.nameReader);
        formData.append('Email', values.email);
        formData.append('Dob', values.dob ? values.dob.toISOString() : '');
        formData.append('Sex', values.sex);
        formData.append('Address', values.address || ''); // Handle null address
        formData.append('Phone', values.phone);
        formData.append('IdTypeReader', values.idTypeReader);

        // Giữ nguyên RoleName cũ để không bị mất quyền
        formData.append('RoleName', initialData.role_name);

        // Chỉ gửi password nếu user có nhập mới
        if (values.readerPassword) {
            formData.append('ReaderPassword', values.readerPassword);
        } else {
            // Nếu không đổi pass, gửi lại pass cũ (nếu backend yêu cầu bắt buộc)
            // Hoặc backend nên tự xử lý: nếu chuỗi rỗng thì không update pass
            formData.append('ReaderPassword', initialData.readerPassword || '');
        }

        if (fileList.length > 0 && fileList[0].originFileObj) {
            formData.append('AvatarImage', fileList[0].originFileObj);
        }

        onSubmit(formData);
    };

    const handleUploadChange: UploadProps['onChange'] = ({
        fileList: newFileList,
    }) => {
        setFileList(newFileList);
        if (newFileList.length > 0 && newFileList[0].originFileObj) {
            const file = newFileList[0].originFileObj as RcFile;
            // Validate file size/type ở đây nếu cần
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('Ảnh phải nhỏ hơn 2MB!');
                return;
            }
            const preview = URL.createObjectURL(file);
            setImageUrl(preview);
        } else {
            setImageUrl(initialData.urlAvatar || null);
        }
    };

    // Chặn auto upload của antd
    const beforeUpload = () => false;

    return (
        <Modal
            title={
                <div className="flex flex-col gap-1">
                    <span className="text-xl font-bold text-[#153D36]">
                        Cập nhật hồ sơ
                    </span>
                    <span className="text-xs text-gray-500 font-normal">
                        Chỉnh sửa thông tin thành viên thư viện
                    </span>
                </div>
            }
            open={open}
            onCancel={onClose}
            footer={null}
            width={720}
            centered
            maskClosable={false}
            className="rounded-xl overflow-hidden"
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ sex: 'Nam' }}
                className="mt-6"
                requiredMark={false} // Tắt dấu sao đỏ mặc định, dùng rule message
            >
                {/* Phần Avatar căn giữa */}
                <div className="flex flex-col items-center mb-8 group">
                    <Upload
                        name="avatar"
                        listType="picture-circle"
                        className="avatar-uploader"
                        showUploadList={false}
                        beforeUpload={beforeUpload}
                        onChange={handleUploadChange}
                        fileList={fileList}
                    >
                        <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-gray-100 shadow-md group-hover:border-blue-200 transition-all cursor-pointer">
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt="avatar"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                    <UserOutlined className="text-4xl text-gray-300" />
                                </div>
                            )}
                            {/* Overlay icon Camera khi hover */}
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <CameraOutlined className="text-white text-2xl" />
                            </div>
                        </div>
                    </Upload>
                    <span className="text-xs text-gray-400 mt-2">
                        Nhấn vào ảnh để thay đổi
                    </span>
                </div>

                <div className="px-4">
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                label={
                                    <span className="font-semibold text-gray-700">
                                        Họ và tên
                                    </span>
                                }
                                name="nameReader"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập họ tên!',
                                    },
                                ]}
                            >
                                <Input
                                    prefix={
                                        <UserOutlined className="text-gray-400" />
                                    }
                                    placeholder="Nhập họ tên đầy đủ"
                                    size="large"
                                    className="rounded-lg"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={
                                    <span className="font-semibold text-gray-700">
                                        Email
                                    </span>
                                }
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập email!',
                                    },
                                    {
                                        type: 'email',
                                        message: 'Email không đúng định dạng!',
                                    },
                                ]}
                            >
                                <Input
                                    prefix={
                                        <MailOutlined className="text-gray-400" />
                                    }
                                    placeholder="example@domain.com"
                                    size="large"
                                    className="rounded-lg"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                label={
                                    <span className="font-semibold text-gray-700">
                                        Số điện thoại
                                    </span>
                                }
                                name="phone"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Nhập số điện thoại!',
                                    },
                                ]}
                            >
                                <Input
                                    prefix={
                                        <PhoneOutlined className="text-gray-400" />
                                    }
                                    placeholder="09xxxxxxx"
                                    size="large"
                                    className="rounded-lg"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={
                                    <span className="font-semibold text-gray-700">
                                        Loại độc giả
                                    </span>
                                }
                                name="idTypeReader"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Chọn loại độc giả!',
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="Chọn hạng thành viên"
                                    size="large"
                                    className="rounded-lg"
                                >
                                    {typeReaderOptions.map((opt) => (
                                        <Select.Option
                                            key={opt.value}
                                            value={opt.value}
                                        >
                                            {opt.label}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item
                                label={
                                    <span className="font-semibold text-gray-700">
                                        Ngày sinh
                                    </span>
                                }
                                name="dob"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Chọn ngày sinh!',
                                    },
                                ]}
                            >
                                <DatePicker
                                    className="w-full rounded-lg"
                                    size="large"
                                    format="DD/MM/YYYY"
                                    placeholder="DD/MM/YYYY"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label={
                                    <span className="font-semibold text-gray-700">
                                        Giới tính
                                    </span>
                                }
                                name="sex"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Chọn giới tính!',
                                    },
                                ]}
                            >
                                <Select
                                    placeholder="Chọn giới tính"
                                    size="large"
                                    className="rounded-lg"
                                >
                                    <Select.Option value="Nam">
                                        Nam
                                    </Select.Option>
                                    <Select.Option value="Nữ">Nữ</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        label={
                            <span className="font-semibold text-gray-700">
                                Địa chỉ thường trú
                            </span>
                        }
                        name="address"
                    >
                        <Input.TextArea
                            rows={2}
                            placeholder="Số nhà, tên đường, phường/xã..."
                            className="rounded-lg"
                        />
                    </Form.Item>

                    {/* Phần đổi mật khẩu (Optional) */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-700 flex items-center gap-2">
                                <LockOutlined /> Đổi mật khẩu
                            </span>
                            <Button
                                type="link"
                                size="small"
                                onClick={() => setChangePass(!changePass)}
                            >
                                {changePass ? 'Hủy' : 'Thay đổi'}
                            </Button>
                        </div>

                        {changePass && (
                            <Form.Item
                                name="readerPassword"
                                help="Để trống nếu không muốn thay đổi"
                                className="mb-0"
                            >
                                <Input.Password
                                    placeholder="Nhập mật khẩu mới..."
                                    size="large"
                                    className="rounded-lg"
                                />
                            </Form.Item>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-gray-100 px-4">
                    <Button
                        onClick={onClose}
                        disabled={isLoading}
                        size="large"
                        className="rounded-lg px-6"
                    >
                        Đóng
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isLoading}
                        size="large"
                        className="bg-[#153D36] hover:bg-[#12352e] rounded-lg px-8 border-none shadow-lg shadow-[#153d36]/20"
                    >
                        Lưu thay đổi
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default UpdateReaderModal;
