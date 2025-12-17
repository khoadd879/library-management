import React, { useEffect, useState } from 'react';
import {
    Modal,
    Form,
    Input,
    Select,
    Button,
    Upload,
    Avatar,
    Row,
    Col,
    message,
} from 'antd';
import {
    UserOutlined,
    GlobalOutlined,
    BookOutlined,
    UploadOutlined,
    FileTextOutlined,
} from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import type { RcFile } from 'antd/es/upload';

interface IUpdateAuthorModalProps {
    open: boolean;
    onClose: () => void;
    initialData: {
        nameAuthor: string;
        nationality: string;
        idTypeBook: string;
        biography: string;
        urlAvatar?: string | null;
    };
    typeBookOptions: { value: string; label: string }[];
    onSubmit: (data: FormData) => void;
    isLoading: boolean;
}

const UpdateAuthorModal: React.FC<IUpdateAuthorModalProps> = ({
    open,
    onClose,
    initialData,
    typeBookOptions,
    onSubmit,
    isLoading,
}) => {
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    // Reset form khi mở modal
    useEffect(() => {
        if (open) {
            form.setFieldsValue({
                ...initialData,
                // Fallback nếu null để tránh lỗi uncontrolled component
                nationality: initialData.nationality || '',
                biography: initialData.biography || '',
            });
            setImageUrl(initialData.urlAvatar || null);
            setFileList([]);
        }
    }, [open, initialData, form]);

    const handleUploadChange: UploadProps['onChange'] = ({
        fileList: newFileList,
    }) => {
        setFileList(newFileList);
        if (newFileList.length > 0 && newFileList[0].originFileObj) {
            const file = newFileList[0].originFileObj as RcFile;
            // Validate ảnh (ví dụ < 2MB)
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                message.error('Ảnh phải nhỏ hơn 2MB!');
                return;
            }
            const preview = URL.createObjectURL(file);
            setImageUrl(preview);
        } else {
            // Nếu xoá ảnh thì quay về ảnh cũ (hoặc null)
            setImageUrl(initialData.urlAvatar || null);
        }
    };

    const onFinish = (values: any) => {
        const formData = new FormData();
        formData.append('NameAuthor', values.nameAuthor);
        formData.append('Nationality', values.nationality);
        formData.append('IdTypeBook', values.idTypeBook);
        formData.append('Biography', values.biography);

        if (fileList.length > 0 && fileList[0].originFileObj) {
            formData.append('AvatarImage', fileList[0].originFileObj);
        }

        onSubmit(formData);
    };

    const beforeUpload = () => false; // Chặn auto upload

    return (
        <Modal
            title={
                <div className="flex flex-col">
                    <span className="text-xl font-bold text-[#153D36]">
                        Cập nhật tác giả
                    </span>
                    <span className="text-xs text-gray-500 font-normal">
                        Chỉnh sửa thông tin chi tiết
                    </span>
                </div>
            }
            open={open}
            onCancel={onClose}
            footer={null}
            width={650}
            centered
            maskClosable={false}
            className="rounded-xl overflow-hidden"
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                className="mt-6"
                requiredMark={false}
            >
                {/* Phần Upload Avatar */}
                <div className="flex flex-col items-center mb-6">
                    <div className="relative group mb-3">
                        <Avatar
                            size={100}
                            src={imageUrl}
                            icon={<UserOutlined />}
                            className="border-4 border-gray-100 shadow-sm"
                        />
                    </div>
                    <Upload
                        name="avatar"
                        fileList={fileList}
                        onChange={handleUploadChange}
                        beforeUpload={beforeUpload}
                        maxCount={1}
                        showUploadList={false}
                    >
                        <Button icon={<UploadOutlined />} size="middle">
                            Thay đổi ảnh
                        </Button>
                    </Upload>
                </div>

                {/* Form Inputs */}
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label={
                                <span className="font-semibold text-gray-700">
                                    Tên tác giả
                                </span>
                            }
                            name="nameAuthor"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên tác giả!',
                                },
                            ]}
                        >
                            <Input
                                prefix={
                                    <UserOutlined className="text-gray-400" />
                                }
                                placeholder="Nhập tên tác giả"
                                size="large"
                                className="rounded-lg"
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label={
                                <span className="font-semibold text-gray-700">
                                    Quốc tịch
                                </span>
                            }
                            name="nationality"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập quốc tịch!',
                                },
                            ]}
                        >
                            <Input
                                prefix={
                                    <GlobalOutlined className="text-gray-400" />
                                }
                                placeholder="Nhập quốc tịch"
                                size="large"
                                className="rounded-lg"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    label={
                        <span className="font-semibold text-gray-700">
                            Thể loại sở trường
                        </span>
                    }
                    name="idTypeBook"
                    rules={[
                        { required: true, message: 'Vui lòng chọn thể loại!' },
                    ]}
                >
                    <Select
                        placeholder="Chọn thể loại sách"
                        size="large"
                        suffixIcon={<BookOutlined className="text-gray-400" />}
                        className="rounded-lg"
                        options={typeBookOptions} // Dùng prop options trực tiếp gọn hơn
                        showSearch
                        filterOption={(input, option) =>
                            (option?.label ?? '')
                                .toLowerCase()
                                .includes(input.toLowerCase())
                        }
                    />
                </Form.Item>

                <Form.Item
                    label={
                        <span className="font-semibold text-gray-700">
                            Tiểu sử
                        </span>
                    }
                    name="biography"
                >
                    <Input.TextArea
                        rows={4}
                        placeholder="Nhập tiểu sử tác giả..."
                        className="rounded-lg"
                        showCount
                        maxLength={1000}
                    />
                </Form.Item>

                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                    <Button
                        onClick={onClose}
                        size="large"
                        className="rounded-lg px-6"
                        disabled={isLoading}
                    >
                        Hủy
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isLoading}
                        size="large"
                        className="bg-[#153D36] hover:bg-[#12352e] rounded-lg px-8 border-none shadow-md"
                    >
                        Cập nhật
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default UpdateAuthorModal;
