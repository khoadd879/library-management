import React, { useEffect, useState } from 'react';
import {
    addLoanBookAPI,
    getAllReadersAPI,
    getHeaderBookByTheBookIdAPI,
} from '@/services/api';
import {
    message,
    Form,
    Input,
    Select,
    Button,
    Card,
    DatePicker,
    Spin,
    Typography,
} from 'antd';
import {
    UserOutlined,
    BarcodeOutlined,
    BookOutlined,
    CalendarOutlined,
    CheckCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

const BorrowForm = () => {
    const [form] = Form.useForm();

    // States
    const [readers, setReaders] = useState<
        { idReader: string; nameReader: string }[]
    >([]);
    const [bookName, setBookName] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingBook, setIsCheckingBook] = useState(false);

    // Debounce timer ref
    const searchTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(
        null,
    );

    // Load Readers on Mount
    useEffect(() => {
        const fetchReaders = async () => {
            try {
                const res = await getAllReadersAPI();
                // Kiểm tra kỹ dữ liệu trả về để tránh lỗi map
                const data = Array.isArray(res) ? res : res?.data || [];
                if (Array.isArray(data)) {
                    setReaders(data);
                }
            } catch (err) {
                console.error(err);
                message.error('Lỗi khi tải danh sách độc giả');
            }
        };
        fetchReaders();
    }, []);

    // Handle Book ID Change with Debounce
    const handleIdBookChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setBookName('');

        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        if (!value) {
            setIsCheckingBook(false);
            return;
        }

        setIsCheckingBook(true);

        searchTimeout.current = setTimeout(async () => {
            try {
                const res = await getHeaderBookByTheBookIdAPI(value);
                // Kiểm tra an toàn cấu trúc dữ liệu trả về
                // Giả sử API trả về mảng sách trong res hoặc res.data
                const books = Array.isArray(res) ? res : res?.data || [];

                if (books.length > 0) {
                    // Lấy tên sách từ phần tử đầu tiên
                    const name =
                        books[0].nameBook ||
                        books[0].nameHeaderBook ||
                        'Sách không tên';
                    setBookName(name);
                    form.setFieldsValue({ bookNameDisplay: name });
                } else {
                    setBookName('Không tìm thấy sách');
                    form.setFieldsValue({
                        bookNameDisplay: 'Không tìm thấy sách',
                    });
                }
            } catch (err) {
                setBookName('Lỗi kiểm tra sách');
            } finally {
                setIsCheckingBook(false);
            }
        }, 500);
    };

    const onFinish = async (values: any) => {
        setIsLoading(true);
        try {
            const res = await addLoanBookAPI(values.idReader, values.idTheBook);
            if (res && res.statusCode === 200) {
                message.success('Thêm phiếu mượn thành công!');
                form.resetFields();
                setBookName('');
            } else {
                message.error(res?.message || 'Thêm phiếu mượn thất bại!');
            }
        } catch (err: any) {
            console.error(err);
            const errorMsg =
                err?.response?.data?.message ||
                err?.response?.message ||
                'Lỗi hệ thống khi gửi dữ liệu!';
            message.error(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[40vh] sm:min-h-[50vh] bg-gray-50 p-2 sm:p-4">
            <Card
                className="w-full max-w-2xl shadow-lg rounded-xl border-t-4 border-t-[#153D36]"
                styles={{ body: { padding: '1rem' } }}
            >
                <div className="sm:p-4">
                    <div className="text-center mb-4 sm:mb-8">
                        <Title
                            level={3}
                            className="!text-lg sm:!text-2xl"
                            style={{ color: '#153D36', margin: 0 }}
                        >
                            Phiếu Mượn Sách
                        </Title>
                        <p className="text-gray-500 mt-1 text-xs sm:text-sm">
                            Nhập thông tin để tạo phiếu mượn mới
                        </p>
                    </div>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        initialValues={{
                            dateBorrow: dayjs(),
                        }}
                        size="large"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                            <Form.Item
                                label={
                                    <span className="font-medium text-[#153D36] text-sm">
                                        Ngày mượn
                                    </span>
                                }
                                name="dateBorrow"
                                className="mb-2 sm:mb-4"
                            >
                                <DatePicker
                                    format="DD/MM/YYYY"
                                    disabled
                                    className="w-full bg-gray-50"
                                    suffixIcon={
                                        <CalendarOutlined
                                            style={{ color: '#17966F' }}
                                        />
                                    }
                                />
                            </Form.Item>

                            <Form.Item
                                label={
                                    <span className="font-medium text-[#153D36] text-sm">
                                        Độc giả
                                    </span>
                                }
                                name="idReader"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn độc giả!',
                                    },
                                ]}
                                className="mb-2 sm:mb-4"
                            >
                                <Select
                                    showSearch
                                    placeholder="-- Tìm và chọn độc giả --"
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        (option?.children as unknown as string)
                                            .toLowerCase()
                                            .includes(input.toLowerCase())
                                    }
                                    suffixIcon={
                                        <UserOutlined
                                            style={{ color: '#17966F' }}
                                        />
                                    }
                                >
                                    {readers.map((r) => (
                                        /* --- SỬA LỖI TẠI ĐÂY: Dùng r.idReader làm key --- */
                                        <Option
                                            key={r.idReader}
                                            value={r.idReader}
                                        >
                                            {r.nameReader} ({r.idReader})
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                            <Form.Item
                                label={
                                    <span className="font-medium text-[#153D36] text-sm">
                                        Mã sách (ID)
                                    </span>
                                }
                                name="idTheBook"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập mã sách!',
                                    },
                                ]}
                                help={
                                    isCheckingBook ? (
                                        <span className="text-[#17966F]">
                                            <Spin size="small" /> Đang kiểm
                                            tra...
                                        </span>
                                    ) : null
                                }
                                className="mb-2 sm:mb-4"
                            >
                                <Input
                                    prefix={
                                        <BarcodeOutlined className="text-gray-400" />
                                    }
                                    placeholder="Nhập mã sách..."
                                    onChange={handleIdBookChange}
                                    allowClear
                                />
                            </Form.Item>

                            <Form.Item
                                label={
                                    <span className="font-medium text-[#153D36] text-sm">
                                        Tên sách
                                    </span>
                                }
                                name="bookNameDisplay"
                                className="mb-2 sm:mb-4"
                            >
                                <Input
                                    readOnly
                                    placeholder="Tên sách sẽ hiện ở đây..."
                                    prefix={
                                        <BookOutlined
                                            className={
                                                bookName
                                                    ? 'text-[#17966F]'
                                                    : 'text-gray-400'
                                            }
                                        />
                                    }
                                    className={
                                        bookName &&
                                        bookName !== 'Không tìm thấy sách'
                                            ? 'bg-green-50 border-green-200 text-[#153D36] font-medium'
                                            : 'bg-gray-50'
                                    }
                                    value={bookName}
                                />
                            </Form.Item>
                        </div>

                        <Form.Item className="mt-2 sm:mt-4 mb-0">
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isLoading}
                                block
                                size="large"
                                icon={<CheckCircleOutlined />}
                                style={{
                                    backgroundColor: '#17966F',
                                    borderColor: '#17966F',
                                    height: '44px',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                }}
                                className="hover:!bg-[#153D36] transition-colors duration-300 shadow-md sm:!h-12 sm:!text-base"
                            >
                                {isLoading
                                    ? 'Đang xử lý...'
                                    : 'Xuất Phiếu Mượn'}
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Card>
        </div>
    );
};

export default BorrowForm;
