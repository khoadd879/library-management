import { useEffect, useState } from 'react';
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
    Typography,
} from 'antd';
import {
    UploadOutlined,
    BookOutlined,
    DollarOutlined,
    CalendarOutlined,
    BankOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';

const { TextArea } = Input;
const { Text } = Typography;

interface IAddBookModalProps {
    open: boolean;
    onClose: () => void;
    authors: { id: string; nameAuthor: string }[];
    typeBooks: { value: string; label: string }[];
    onSubmit: (formData: FormData) => Promise<void>;
    isLoading: boolean;
}

const AddBookModal = ({
    open,
    onClose,
    authors,
    typeBooks,
    onSubmit,
    isLoading,
}: IAddBookModalProps) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // Reset form khi mở Modal
    useEffect(() => {
        if (open) {
            form.resetFields();
            setPreviewImage(null);
            setFileList([]);
        }
    }, [open, form]);

    const handleFinish = async (values: any) => {
        // Validate required image
        if (fileList.length === 0) {
            return; // Form.Item validation will show error
        }

        const formData = new FormData();

        // Thêm các trường cơ bản theo HeaderBookCreationRequest
        formData.append('IdTypeBook', values.idTypeBook);
        formData.append('NameHeaderBook', values.nameHeaderBook);
        formData.append('DescribeBook', values.describeBook || '');

        // Xử lý mảng tác giả (Authors)
        if (values.authors && values.authors.length > 0) {
            values.authors.forEach((id: string) =>
                formData.append('Authors', id),
            );
        }

        // Xử lý object lồng nhau bookCreateRequest
        formData.append('bookCreateRequest.Publisher', values.publisher || '');
        formData.append(
            'bookCreateRequest.ReprintYear',
            values.reprintYear?.toString() ||
                new Date().getFullYear().toString(),
        );
        formData.append(
            'bookCreateRequest.ValueOfBook',
            values.valueOfBook?.toString() || '0',
        );

        // Xử lý ảnh bìa sách (BookImage) - QUAN TRỌNG!
        if (fileList[0]?.originFileObj) {
            formData.append('BookImage', fileList[0].originFileObj as File);
        }

        await onSubmit(formData);
    };

    const uploadProps: UploadProps = {
        onRemove: () => {
            setFileList([]);
            setPreviewImage(null);
        },
        beforeUpload: (file) => {
            const uploadFile: UploadFile = {
                uid: file.uid || `-${Date.now()}`,
                name: file.name,
                status: 'done',
                originFileObj: file,
            };
            setFileList([uploadFile]);

            const reader = new FileReader();
            reader.onload = (e) => setPreviewImage(e.target?.result as string);
            reader.readAsDataURL(file);
            return false;
        },
        fileList,
        maxCount: 1,
        accept: 'image/*',
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2 text-[#153D36]">
                    <PlusOutlined />
                    <span>Thêm sách mới</span>
                </div>
            }
            open={open}
            onCancel={onClose}
            footer={null}
            width={750}
            centered
            destroyOnClose
            styles={{ body: { padding: '20px 24px' } }}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                className="mt-4"
                initialValues={{
                    reprintYear: new Date().getFullYear(),
                    valueOfBook: 0,
                }}
            >
                <Row gutter={24}>
                    {/* Cột trái: Ảnh bìa */}
                    <Col span={8}>
                        <Form.Item
                            name="bookImage"
                            rules={[
                                {
                                    validator: () => {
                                        if (fileList.length === 0) {
                                            return Promise.reject(
                                                'Vui lòng tải lên ảnh bìa sách',
                                            );
                                        }
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                        >
                            <div className="flex flex-col items-center gap-4">
                                <div
                                    className={`w-full aspect-[2/3] bg-gray-50 rounded-lg border-2 border-dashed ${fileList.length === 0 ? 'border-gray-200' : 'border-green-400'} flex items-center justify-center overflow-hidden shadow-inner`}
                                >
                                    {previewImage ? (
                                        <img
                                            src={previewImage}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="text-center p-4">
                                            <BookOutlined className="text-4xl text-gray-300 mb-2" />
                                            <Text
                                                type="secondary"
                                                className="text-xs block"
                                            >
                                                Chưa có ảnh bìa
                                            </Text>
                                        </div>
                                    )}
                                </div>
                                <Upload {...uploadProps} showUploadList={false}>
                                    <Button
                                        icon={<UploadOutlined />}
                                        className="w-full"
                                        type={
                                            fileList.length > 0
                                                ? 'default'
                                                : 'dashed'
                                        }
                                    >
                                        {fileList.length > 0
                                            ? 'Đổi ảnh bìa'
                                            : 'Chọn ảnh bìa *'}
                                    </Button>
                                </Upload>
                                <Text
                                    type="secondary"
                                    className="text-xs text-center"
                                >
                                    Hỗ trợ: JPG, PNG. Tối đa 5MB
                                </Text>
                            </div>
                        </Form.Item>
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
                                placeholder="Nhập tên đầu sách"
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
                                            message: 'Chọn thể loại sách',
                                        },
                                    ]}
                                >
                                    <Select
                                        placeholder="Chọn thể loại"
                                        options={typeBooks}
                                        showSearch
                                        optionFilterProp="label"
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
                                            message: 'Nhập giá trị sách',
                                        },
                                    ]}
                                >
                                    <InputNumber
                                        className="w-full"
                                        min={0}
                                        formatter={(value) =>
                                            `${value}`.replace(
                                                /\B(?=(\d{3})+(?!\d))/g,
                                                ',',
                                            )
                                        }
                                        parser={(value) =>
                                            Number(
                                                value!.replace(
                                                    /\$\s?|(,*)/g,
                                                    '',
                                                ),
                                            ) as 0
                                        }
                                        prefix={
                                            <DollarOutlined className="text-gray-400" />
                                        }
                                        placeholder="150,000"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            label="Tác giả"
                            name="authors"
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
                                options={authors.map((a) => ({
                                    value: a.id,
                                    label: a.nameAuthor,
                                }))}
                                maxTagCount="responsive"
                                showSearch
                                optionFilterProp="label"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Divider className="my-4" />

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Nhà xuất bản"
                            name="publisher"
                            rules={[
                                {
                                    required: true,
                                    message: 'Nhập tên nhà xuất bản',
                                },
                            ]}
                        >
                            <Input
                                prefix={
                                    <BankOutlined className="text-gray-400" />
                                }
                                placeholder="NXB Kim Đồng, NXB Trẻ..."
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Năm tái bản"
                            name="reprintYear"
                            rules={[
                                {
                                    required: true,
                                    message: 'Nhập năm tái bản',
                                },
                            ]}
                        >
                            <InputNumber
                                className="w-full"
                                min={1900}
                                max={new Date().getFullYear()}
                                prefix={
                                    <CalendarOutlined className="text-gray-400" />
                                }
                                placeholder="2024"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item label="Mô tả sách" required name="describeBook">
                    <TextArea
                        rows={4}
                        placeholder="Mô tả ngắn về nội dung sách..."
                        showCount
                        required
                        maxLength={1000}
                    />
                </Form.Item>

                <div className="flex justify-end gap-3 mt-6">
                    <Button onClick={onClose}>Hủy bỏ</Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isLoading}
                        icon={<PlusOutlined />}
                        className="bg-[#153D36] border-none px-8"
                    >
                        Thêm sách
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default AddBookModal;
