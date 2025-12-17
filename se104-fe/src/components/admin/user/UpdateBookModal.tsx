import React, { useEffect, useState } from 'react';
import {
    Modal,
    Form,
    Input,
    InputNumber,
    Select,
    Upload,
    Button,
    Row,
    Col,
    Divider,
} from 'antd';
import {
    UploadOutlined,
    BookOutlined,
    UserOutlined,
    DollarOutlined,
    CalendarOutlined,
    FileTextOutlined,
    BankOutlined,
} from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';

const { TextArea } = Input;

interface IUpdateBookModalProps {
    open: boolean;
    onClose: () => void;
    initialData: {
        idBook: string;
        nameHeaderBook: string;
        describeBook: string;
        idTypeBook: string;
        idAuthors: string[];
        publisher: string;
        reprintYear: number;
        valueOfBook: number;
        imageUrl?: string;
    };
    authors: { id: string; nameAuthor: string }[];
    typeBooks: { value: string; label: string }[];
    onSubmit: (idBook: string, formData: FormData) => Promise<void>;
    isLoading: boolean;
}

const UpdateBookModal = ({
    open,
    onClose,
    initialData,
    authors,
    typeBooks,
    onSubmit,
    isLoading,
}: IUpdateBookModalProps) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // Đồng bộ dữ liệu khi mở Modal
    useEffect(() => {
        if (open) {
            form.setFieldsValue(initialData);
            setPreviewImage(initialData.imageUrl || null);
            setFileList([]);
        }
    }, [open, initialData, form]);

    const handleFinish = async (values: any) => {
        const formData = new FormData();
        formData.append('IdTypeBook', values.idTypeBook);
        formData.append('NameHeaderBook', values.nameHeaderBook);
        formData.append('DescribeBook', values.describeBook || '');

        // Xử lý mảng tác giả
        values.idAuthors.forEach((id: string) =>
            formData.append('IdAuthors', id)
        );

        // Xử lý object lồng nhau theo Swagger yêu cầu
        formData.append('bookUpdateRequest.Publisher', values.publisher);
        formData.append(
            'bookUpdateRequest.ReprintYear',
            values.reprintYear.toString()
        );
        formData.append(
            'bookUpdateRequest.ValueOfBook',
            values.valueOfBook.toString()
        );

        if (fileList[0]?.originFileObj) {
            formData.append('BookImage', fileList[0].originFileObj);
        }

        await onSubmit(initialData.idBook, formData);
    };

    const uploadProps: UploadProps = {
        onRemove: () => {
            setFileList([]);
            setPreviewImage(initialData.imageUrl || null);
        },
        beforeUpload: (file) => {
            setFileList([file]);
            const reader = new FileReader();
            reader.onload = (e) => setPreviewImage(e.target?.result as string);
            reader.readAsDataURL(file);
            return false; // Ngăn auto upload
        },
        fileList,
        maxCount: 1,
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 text-[#153D36]">
                    <BookOutlined />
                    <span>Cập nhật thông tin sách</span>
                </div>
            }
            open={open}
            onCancel={onClose}
            footer={null}
            width={750}
            centered
            destroyOnClose
            bodyStyle={{ padding: '20px 24px' }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={initialData}
                className="mt-4"
            >
                <Row gutter={24}>
                    {/* Cột trái: Ảnh bìa */}
                    <Col span={8}>
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-full aspect-[2/3] bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden shadow-inner">
                                {previewImage ? (
                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-gray-400 text-xs">
                                        Chưa có ảnh
                                    </span>
                                )}
                            </div>
                            <Upload {...uploadProps} showUploadList={false}>
                                <Button
                                    icon={<UploadOutlined />}
                                    className="w-full"
                                >
                                    Thay ảnh bìa
                                </Button>
                            </Upload>
                        </div>
                    </Col>

                    {/* Cột phải: Thông tin chi tiết */}
                    <Col span={16}>
                        <Form.Item
                            label="Tên sách"
                            name="nameHeaderBook"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên sách',
                                },
                            ]}
                        >
                            <Input
                                prefix={
                                    <BookOutlined className="text-gray-400" />
                                }
                                placeholder="Tên đầu sách"
                            />
                        </Form.Item>

                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label="Thể loại"
                                    name="idTypeBook"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Chọn thể loại',
                                        },
                                    ]}
                                >
                                    <Select
                                        placeholder="Chọn thể loại"
                                        options={typeBooks}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Trị giá (VNĐ)"
                                    name="valueOfBook"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Nhập giá tiền',
                                        },
                                    ]}
                                >
                                    <InputNumber
                                        className="max-w-full"
                                        formatter={(value) =>
                                            `${value}`.replace(
                                                /\B(?=(\d{3})+(?!\d))/g,
                                                ','
                                            )
                                        }
                                        parser={(value) =>
                                            value!.replace(/\$\s?|(,*)/g, '')
                                        }
                                        prefix={
                                            <DollarOutlined className="text-gray-400" />
                                        }
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            label="Tác giả"
                            name="idAuthors"
                            rules={[
                                {
                                    required: true,
                                    message: 'Chọn ít nhất một tác giả',
                                },
                            ]}
                        >
                            <Select
                                mode="multiple"
                                allowClear
                                placeholder="Chọn tác giả"
                                prefix={
                                    <UserOutlined className="text-gray-400" />
                                }
                                options={authors.map((a) => ({
                                    value: a.id,
                                    label: a.nameAuthor,
                                }))}
                                maxTagCount="responsive"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Divider className="my-4" />

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Nhà xuất bản" name="publisher">
                            <Input
                                prefix={
                                    <BankOutlined className="text-gray-400" />
                                }
                                placeholder="NXB Kim Đồng..."
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Năm tái bản" name="reprintYear">
                            <InputNumber
                                className="w-full"
                                prefix={
                                    <CalendarOutlined className="text-gray-400" />
                                }
                                placeholder="2024"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item label="Mô tả sách" name="describeBook">
                    <TextArea
                        rows={4}
                        placeholder="Mô tả ngắn về nội dung sách..."
                        showCount
                        maxLength={1000}
                    />
                </Form.Item>

                <div className="flex justify-end gap-3 mt-6">
                    <Button onClick={onClose}>Hủy bỏ</Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isLoading}
                        className="bg-[#153D36] border-none px-8"
                    >
                        Cập nhật thông tin
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default UpdateBookModal;
