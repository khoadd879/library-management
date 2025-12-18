import React, { useState, useEffect, useRef } from 'react';
import {
    message,
    Select,
    Input,
    InputNumber,
    Button,
    Card,
    Divider,
    Tag,
    Row,
    Col,
    Typography,
} from 'antd';
import {
    getListAuthor,
    getTypeBooksAPI,
    getAllHeaderBooksAPI,
    addBookReceiptAPI,
} from '@/services/api';
import {
    CloudUploadOutlined,
    ReadOutlined,
    UserOutlined,
    TagsOutlined,
    BankOutlined,
    CalendarOutlined,
    DollarOutlined,
    SaveOutlined,
    ClearOutlined,
    FileTextOutlined,
    NumberOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { TextArea } = Input;
const ReceiveBook = () => {
    const [today, setToday] = useState('');
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [bookImage, setBookImage] = useState<File | null>(null);

    // Data States
    const [authors, setAuthors] = useState<
        { id: string; nameAuthor: string }[]
    >([]);
    const [typeBooks, setTypeBooks] = useState<
        { value: string; label: string }[]
    >([]);
    const [headerBooks, setHeaderBooks] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [selectedHeaderId, setSelectedHeaderId] = useState<string | null>(
        null
    );
    const UserId = localStorage.getItem('idUser') ?? '';

    const [formState, setFormState] = useState({
        nameHeaderBook: '',
        describeBook: '',
        idTypeBook: '',
        idAuthors: [] as string[],
        publisher: '',
        reprintYear: new Date().getFullYear(),
        valueOfBook: '',
        quantity: 1,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setToday(dayjs().format('DD/MM/YYYY'));
                const [authorRes, typeBookRes, headerRes] = await Promise.all([
                    getListAuthor(),
                    getTypeBooksAPI(),
                    getAllHeaderBooksAPI(),
                ]);

                if (authorRes?.data)
                    setAuthors(
                        authorRes.data.map((a: any) => ({
                            id: a.idAuthor,
                            nameAuthor: a.nameAuthor,
                        }))
                    );

                let typeList = Array.isArray(typeBookRes)
                    ? typeBookRes
                    : typeBookRes?.data || [];
                const uniqueTypes = Array.from(
                    new Map(
                        typeList.map((item: any) => [item.idTypeBook, item])
                    ).values()
                ).map((item: any) => ({
                    value: item.idTypeBook,
                    label: item.nameTypeBook,
                }));
                setTypeBooks(uniqueTypes);

                if (Array.isArray(headerRes)) {
                    setHeaderBooks(headerRes);
                } else if ((headerRes as any)?.data) {
                    setHeaderBooks((headerRes as any).data);
                }
            } catch (err) {
                message.error('Không thể tải dữ liệu danh mục.');
            }
        };
        fetchData();
    }, []);

    const handleHeaderBookChange = (value: string) => {
        setSelectedHeaderId(value);
        if (!value) return;

        const selected = headerBooks.find((h) => h.idHeaderBook === value);
        if (selected) {
            setFormState((prev) => ({
                ...prev,
                nameHeaderBook: selected.nameBook,
                describeBook: selected.describe || '',
                idTypeBook:
                    selected.idTypeBook?.idTypeBook ||
                    selected.idTypeBook ||
                    '',
            }));
            message.success({
                content: 'Đã cập nhật thông tin từ đầu sách cũ',
                key: 'autofill',
            });
        }
    };

    const resetForm = () => {
        setFormState({
            nameHeaderBook: '',
            describeBook: '',
            idTypeBook: '',
            idAuthors: [],
            publisher: '',
            reprintYear: new Date().getFullYear(),
            valueOfBook: '',
            quantity: 1,
        });
        setBookImage(null);
        setPreviewImage(null);
        setSelectedHeaderId(null);
    };

    // --- PHẦN QUAN TRỌNG: SỬA REQUEST TẠI ĐÂY ---
    const handleSubmit = async () => {
        if (
            !formState.nameHeaderBook ||
            !formState.idTypeBook ||
            !formState.publisher ||
            !formState.quantity
        ) {
            message.error('Vui lòng điền đầy đủ các trường bắt buộc (*)');
            return;
        }

        setIsLoading(true);
        try {
            const receiptFormData = new FormData();

            // 1. Root Level: idReader
            receiptFormData.append('idReader', UserId);

            // 2. headerBook Level (CamelCase theo JSON)
            receiptFormData.append(
                'headerBook.idTypeBook',
                formState.idTypeBook
            );
            receiptFormData.append(
                'headerBook.nameHeaderBook',
                formState.nameHeaderBook
            );
            receiptFormData.append(
                'headerBook.describeBook',
                formState.describeBook || ''
            );

            // Mảng Authors
            formState.idAuthors.forEach((id) =>
                receiptFormData.append('headerBook.authors', id)
            );

            // File Ảnh
            if (bookImage) {
                receiptFormData.append('headerBook.bookImage', bookImage);
            }

            // 3. headerBook -> bookCreateRequest Level
            receiptFormData.append(
                'headerBook.bookCreateRequest.publisher',
                formState.publisher
            );
            receiptFormData.append(
                'headerBook.bookCreateRequest.reprintYear',
                formState.reprintYear.toString()
            );
            receiptFormData.append(
                'headerBook.bookCreateRequest.valueOfBook',
                formState.valueOfBook.toString()
            );

            // 4. detailsRequest Level
            receiptFormData.append(
                'detailsRequest.quantity',
                formState.quantity.toString()
            );

            const res = await addBookReceiptAPI(receiptFormData);
            // Kiểm tra response tùy thuộc vào API của bạn (ví dụ statusCode hoặc success field)
            if (res?.statusCode === 201 || res?.success || res?.data) {
                message.success('Nhập sách thành công!');
                resetForm();
            } else {
                message.error(
                    res?.message || res?.data?.message || 'Có lỗi xảy ra'
                );
            }
        } catch (err) {
            console.error(err);
            message.error('Lỗi hệ thống!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-[#153D36] via-[#1A4A42] to-[#0D2621] px-8 py-6">
                <div className="max-w-7xl mx-auto flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
                            <ReadOutlined className="text-emerald-300" />
                            Nhập sách mới
                        </h1>
                        <p className="text-emerald-200/80 text-sm">
                            Quản lý nhập kho và cập nhật đầu sách vào hệ thống
                        </p>
                    </div>
                    <Tag
                        icon={<CalendarOutlined />}
                        className="px-4 py-2 text-sm rounded-xl m-0 border-0 bg-white/10 text-white backdrop-blur-sm"
                    >
                        Ngày nhập: <strong>{today}</strong>
                    </Tag>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 py-8">
                <Row gutter={32}>
                    {/* --- LEFT COLUMN: IMAGE UPLOAD --- */}
                    <Col xs={24} lg={7} xl={6}>
                        <div className="sticky top-6 flex flex-col gap-4 animate-fade-in-left">
                            <Card
                                className="shadow-sm hover:shadow-md transition-shadow duration-300 rounded-2xl border-gray-100 overflow-hidden"
                                bodyStyle={{ padding: 0 }}
                            >
                                <div className="bg-gray-50 p-4 border-b border-gray-100 text-center">
                                    <span className="font-semibold text-gray-500 uppercase text-xs tracking-wider">
                                        Ảnh Bìa Sách
                                    </span>
                                </div>
                                <div
                                    className="group relative w-full aspect-[2/3] bg-white flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-gray-50"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                >
                                    {previewImage ? (
                                        <>
                                            <img
                                                src={previewImage}
                                                alt="Cover"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <CloudUploadOutlined className="text-white text-4xl mb-2" />
                                                <span className="text-white font-medium text-sm">
                                                    Thay đổi ảnh
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center text-gray-300 group-hover:text-[#27AE60] transition-colors">
                                            <CloudUploadOutlined className="text-6xl mb-3" />
                                            <span className="font-medium">
                                                Tải ảnh lên
                                            </span>
                                            <span className="text-xs mt-1">
                                                Hỗ trợ JPG, PNG
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setBookImage(file);
                                            setPreviewImage(
                                                URL.createObjectURL(file)
                                            );
                                        }
                                    }}
                                />
                            </Card>

                            {/* Action Buttons */}
                            <Button
                                type="primary"
                                size="large"
                                icon={<SaveOutlined />}
                                onClick={handleSubmit}
                                loading={isLoading}
                                className="bg-[#27AE60] hover:!bg-[#219150] border-0 h-12 rounded-xl font-bold shadow-lg shadow-green-100 w-full"
                            >
                                LƯU PHIẾU NHẬP
                            </Button>
                            <Button
                                icon={<ClearOutlined />}
                                onClick={resetForm}
                                className="h-10 rounded-xl border-transparent text-gray-500 hover:text-red-500 hover:bg-red-50 w-full"
                            >
                                Làm mới form
                            </Button>
                        </div>
                    </Col>

                    {/* --- RIGHT COLUMN: INPUT FORM --- */}
                    <Col
                        xs={24}
                        lg={17}
                        xl={18}
                        className="animate-fade-in-right"
                    >
                        <div className="flex flex-col gap-6">
                            {/* CARD 1: THÔNG TIN CƠ BẢN */}
                            <Card
                                className="shadow-sm rounded-2xl border-gray-100"
                                title={
                                    <span className="text-[#153D36]">
                                        <ReadOutlined /> Thông tin cơ bản
                                    </span>
                                }
                            >
                                <Row gutter={[20, 20]}>
                                    <Col span={24}>
                                        <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                                            Đầu sách có sẵn (Gợi ý)
                                        </label>
                                        <Select
                                            showSearch
                                            allowClear
                                            placeholder="Tìm kiếm đầu sách trong thư viện..."
                                            optionFilterProp="children"
                                            onChange={handleHeaderBookChange}
                                            value={selectedHeaderId}
                                            size="large"
                                            className="w-full"
                                            suffixIcon={
                                                <SearchOutlined className="text-gray-400" />
                                            }
                                            filterOption={(input, option) =>
                                                (option?.label ?? '')
                                                    .toLowerCase()
                                                    .includes(
                                                        input.toLowerCase()
                                                    )
                                            }
                                            options={headerBooks.map((hb) => ({
                                                label: hb.nameBook,
                                                value: hb.idHeaderBook,
                                            }))}
                                        />
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                                            Tên sách{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <Input
                                            size="large"
                                            placeholder="Nhập tên sách..."
                                            value={formState.nameHeaderBook}
                                            onChange={(e) =>
                                                setFormState({
                                                    ...formState,
                                                    nameHeaderBook:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                                            Thể loại{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <Select
                                            size="large"
                                            placeholder="Chọn thể loại"
                                            className="w-full"
                                            value={formState.idTypeBook || null}
                                            onChange={(val) =>
                                                setFormState({
                                                    ...formState,
                                                    idTypeBook: val,
                                                })
                                            }
                                            options={typeBooks}
                                            suffixIcon={
                                                <TagsOutlined className="text-gray-400" />
                                            }
                                        />
                                    </Col>
                                </Row>
                            </Card>

                            {/* CARD 2: THÔNG TIN XUẤT BẢN */}
                            <Card
                                className="shadow-sm rounded-2xl border-gray-100"
                                title={
                                    <span className="text-[#153D36]">
                                        <BankOutlined /> Chi tiết xuất bản
                                    </span>
                                }
                            >
                                <Row gutter={[20, 20]}>
                                    <Col xs={24} md={12}>
                                        <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                                            Tác giả
                                        </label>
                                        <Select
                                            mode="multiple"
                                            size="large"
                                            placeholder="Chọn tác giả"
                                            className="w-full"
                                            value={formState.idAuthors}
                                            onChange={(val) =>
                                                setFormState({
                                                    ...formState,
                                                    idAuthors: val,
                                                })
                                            }
                                            options={authors.map((a) => ({
                                                label: a.nameAuthor,
                                                value: a.id,
                                            }))}
                                            suffixIcon={
                                                <UserOutlined className="text-gray-400" />
                                            }
                                            maxTagCount="responsive"
                                        />
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                                            Nhà xuất bản{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <Input
                                            size="large"
                                            placeholder="Tên NXB"
                                            value={formState.publisher}
                                            onChange={(e) =>
                                                setFormState({
                                                    ...formState,
                                                    publisher: e.target.value,
                                                })
                                            }
                                        />
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                                            Năm tái bản
                                        </label>
                                        <InputNumber
                                            size="large"
                                            className="w-full"
                                            placeholder="2025"
                                            value={formState.reprintYear}
                                            onChange={(val) =>
                                                setFormState({
                                                    ...formState,
                                                    reprintYear:
                                                        val ||
                                                        new Date().getFullYear(),
                                                })
                                            }
                                            prefix={
                                                <CalendarOutlined className="text-gray-300 mr-2" />
                                            }
                                        />
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                                            Trị giá sách
                                        </label>
                                        <InputNumber
                                            size="large"
                                            className="w-full"
                                            placeholder="0"
                                            formatter={(value) =>
                                                `${value}`.replace(
                                                    /\B(?=(\d{3})+(?!\d))/g,
                                                    ','
                                                )
                                            }
                                            parser={(value) =>
                                                value?.replace(
                                                    /\$\s?|(,*)/g,
                                                    ''
                                                ) as unknown as number
                                            }
                                            value={formState.valueOfBook as any}
                                            onChange={(val) =>
                                                setFormState({
                                                    ...formState,
                                                    valueOfBook:
                                                        val?.toString() || '',
                                                })
                                            }
                                            prefix={
                                                <DollarOutlined className="text-gray-300 mr-2" />
                                            }
                                            addonAfter="VNĐ"
                                        />
                                    </Col>
                                </Row>
                            </Card>

                            {/* CARD 3: NHẬP KHO */}
                            <Card
                                className="shadow-sm rounded-2xl border-gray-100"
                                title={
                                    <span className="text-[#153D36]">
                                        <FileTextOutlined /> Thông tin nhập kho
                                    </span>
                                }
                            >
                                <Row gutter={[20, 20]}>
                                    <Col xs={24} md={8}>
                                        <div className="bg-white rounded-xl">
                                            <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                                                Số lượng nhập{' '}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <InputNumber
                                                size="large"
                                                min={1}
                                                className="w-full"
                                                placeholder="Nhập số lượng..."
                                                value={formState.quantity}
                                                onChange={(val) =>
                                                    setFormState({
                                                        ...formState,
                                                        quantity: val || 1,
                                                    })
                                                }
                                                prefix={
                                                    <NumberOutlined className="text-gray-300 mr-2" />
                                                }
                                            />
                                            <p className="text-xs text-gray-400 mt-2 ml-1">
                                                Số lượng thực tế nhập vào hệ
                                                thống
                                            </p>
                                        </div>
                                    </Col>

                                    <Col xs={24} md={16}>
                                        <label className="block text-sm font-semibold text-gray-600 mb-1.5">
                                            Mô tả chi tiết
                                        </label>
                                        <TextArea
                                            rows={3}
                                            placeholder="Ghi chú về tình trạng sách, nguồn gốc hoặc thông tin bổ sung..."
                                            value={formState.describeBook}
                                            onChange={(e) =>
                                                setFormState({
                                                    ...formState,
                                                    describeBook:
                                                        e.target.value,
                                                })
                                            }
                                            className="rounded-xl"
                                            showCount
                                            maxLength={500}
                                        />
                                    </Col>
                                </Row>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default ReceiveBook;
