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
} from 'antd';
import {
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    UploadOutlined,
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

    useEffect(() => {
        if (open && initialData) {
            form.setFieldsValue({
                ...initialData,
                dob: initialData.dob ? dayjs(initialData.dob) : null,
                readerPassword: initialData.readerPassword || '123456',
            });
            setImageUrl(initialData.urlAvatar || null);
            setFileList([]);
        }
    }, [open, initialData, form]);

    const onFinish = (values: any) => {
        const formData = new FormData();

        formData.append('NameReader', values.nameReader);
        formData.append('Email', values.email);
        formData.append('Dob', values.dob ? values.dob.toISOString() : '');
        formData.append('Sex', values.sex);
        formData.append('Address', values.address);
        formData.append('Phone', values.phone);
        formData.append('IdTypeReader', values.idTypeReader);
        formData.append('ReaderPassword', values.readerPassword);

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
            const preview = URL.createObjectURL(file);
            setImageUrl(preview);
        } else {
            setImageUrl(initialData.urlAvatar || null);
        }
    };
    const beforeUpload = () => false;

    return (
        <Modal
            title={
                <span className="text-xl font-bold text-[#153D36]">
                    Cập nhật thông tin độc giả
                </span>
            }
            open={open}
            onCancel={onClose}
            footer={null}
            width={700}
            centered
            maskClosable={false}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ sex: 'Nam' }}
                className="mt-4"
            >
                <div className="flex flex-col items-center mb-6">
                    <Avatar
                        size={100}
                        src={imageUrl}
                        icon={<UserOutlined />}
                        className="mb-3 border-2 border-gray-200"
                    />
                    <Upload
                        name="avatar"
                        listType="text"
                        fileList={fileList}
                        onChange={handleUploadChange}
                        beforeUpload={beforeUpload}
                        maxCount={1}
                        showUploadList={false}
                    >
                        <Button icon={<UploadOutlined />}>
                            Đổi ảnh đại diện
                        </Button>
                    </Upload>
                </div>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Họ và tên"
                            name="nameReader"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập họ tên!',
                                },
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined />}
                                placeholder="Nhập họ tên"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập email!',
                                },
                                {
                                    type: 'email',
                                    message: 'Email không hợp lệ!',
                                },
                            ]}
                        >
                            <Input
                                prefix={<MailOutlined />}
                                placeholder="example@email.com"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Ngày sinh"
                            name="dob"
                            rules={[
                                { required: true, message: 'Chọn ngày sinh!' },
                            ]}
                        >
                            <DatePicker
                                className="w-full"
                                format="DD/MM/YYYY"
                                placeholder="Chọn ngày sinh"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Giới tính"
                            name="sex"
                            rules={[
                                { required: true, message: 'Chọn giới tính!' },
                            ]}
                        >
                            <Select placeholder="Chọn giới tính">
                                <Select.Option value="Nam">Nam</Select.Option>
                                <Select.Option value="Nữ">Nữ</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Số điện thoại"
                            name="phone"
                            rules={[
                                {
                                    required: true,
                                    message: 'Nhập số điện thoại!',
                                },
                            ]}
                        >
                            <Input
                                prefix={<PhoneOutlined />}
                                placeholder="09xxxxxxx"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Loại độc giả"
                            name="idTypeReader"
                            rules={[
                                {
                                    required: true,
                                    message: 'Chọn loại độc giả!',
                                },
                            ]}
                        >
                            <Select placeholder="Chọn loại độc giả">
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

                <Form.Item label="Địa chỉ" name="address">
                    <Input.TextArea
                        rows={2}
                        placeholder="Nhập địa chỉ..."
                        // Bạn có thể thêm icon prefix cho TextArea bằng cách wrap nó, nhưng TextArea mặc định ko hỗ trợ prefix
                    />
                </Form.Item>

                {/* Password field hidden logic if needed */}
                <Form.Item name="readerPassword" hidden>
                    <Input />
                </Form.Item>

                <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                    <Button onClick={onClose} disabled={isLoading}>
                        Hủy
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isLoading}
                        className="bg-[#153D36] hover:bg-[#12352e]"
                    >
                        Cập nhật
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default UpdateReaderModal;
