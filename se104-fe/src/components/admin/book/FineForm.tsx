import React, { useEffect, useState } from 'react';
import {
    message,
    Form,
    Select,
    InputNumber,
    Button,
    Card,
    Typography,
    Spin,
    Statistic,
    Row,
    Col,
    Divider,
} from 'antd';
import { getAllReadersAPI, addPenaltyAPI } from '@/services/api';
import {
    UserOutlined,
    DollarOutlined,
    SolutionOutlined,
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

interface IReaderSimple {
    idReader: string;
    nameReader: string;
    totalDebt: number;
}

const FineForm = () => {
    const [form] = Form.useForm();

    // States
    const [readers, setReaders] = useState<IReaderSimple[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [currentDebt, setCurrentDebt] = useState<number>(0);
    const [payAmount, setPayAmount] = useState<number>(0);

    // Load danh sách độc giả
    const fetchReaders = async () => {
        setLoading(true);
        try {
            const res = await getAllReadersAPI();

            if (res && res.data && Array.isArray(res.data)) {
                const debtors = res.data.filter(
                    (r: IReaderSimple) => r.totalDebt > 0
                );
                setReaders(debtors);
            }
        } catch (err) {
            console.error(err);
            message.error('Lỗi khi tải danh sách độc giả');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReaders();
    }, []);

    // Xử lý khi chọn độc giả
    const handleReaderChange = (value: string) => {
        const reader = readers.find((r) => r.idReader === value);
        setCurrentDebt(reader?.totalDebt || 0);
        setPayAmount(0);
        form.setFieldsValue({ amount: null }); // Reset số tiền nhập
    };

    // Xử lý submit form
    const onFinish = async (values: any) => {
        setSubmitting(true);
        try {
            const res = await addPenaltyAPI(values.idReader, values.amount);
            if (res?.statusCode === 200) {
                message.success('Xuất phiếu thu thành công!');

                // Reset form và state
                form.resetFields();
                setCurrentDebt(0);
                setPayAmount(0);

                // Reload lại danh sách độc giả để cập nhật số nợ mới
                await fetchReaders();
            } else {
                message.error(res?.data?.message || 'Xuất phiếu thất bại!');
            }
        } catch (err) {
            console.error(err);
            message.error('Lỗi hệ thống!');
        } finally {
            setSubmitting(false);
        }
    };

    // Tính toán số nợ còn lại (Display only)
    const remainingDebt = Math.max(0, currentDebt - (payAmount || 0));

    return (
        <div className="flex justify-center items-center min-h-[50vh] bg-gray-50 p-4">
            <Card
                className="w-full max-w-lg shadow-lg rounded-xl border-t-4 border-t-[#153D36]"
                bodyStyle={{ padding: '2rem' }}
            >
                <div className="text-center mb-6">
                    <Title level={2} style={{ color: '#153D36', margin: 0 }}>
                        Phiếu Thu Tiền Phạt
                    </Title>
                    <Text type="secondary">
                        Thu hồi nợ phí trễ hạn từ độc giả
                    </Text>
                </div>

                <Spin spinning={loading}>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        size="large"
                    >
                        {/* Chọn độc giả */}
                        <Form.Item
                            label={
                                <span className="font-medium text-[#153D36]">
                                    Chọn độc giả
                                </span>
                            }
                            name="idReader"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn độc giả!',
                                },
                            ]}
                        >
                            <Select
                                showSearch
                                placeholder="Tìm theo tên độc giả..."
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    (option?.children as unknown as string)
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                }
                                onChange={handleReaderChange}
                                suffixIcon={
                                    <UserOutlined
                                        style={{ color: '#17966F' }}
                                    />
                                }
                            >
                                {readers.map((r: any) => (
                                    <Option key={r.idReader} value={r.idReader}>
                                        {r.nameReader ? r.nameReader : r.email}{' '}
                                        - Nợ: {r.totalDebt.toLocaleString()} đ
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        {/* Hiển thị thông tin Nợ (Chỉ hiện khi đã chọn độc giả) */}
                        {currentDebt > 0 && (
                            <div className="bg-red-50 p-4 rounded-lg mb-6 border border-red-100">
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Statistic
                                            title="Tổng nợ hiện tại"
                                            value={currentDebt}
                                            valueStyle={{
                                                color: '#cf1322',
                                                fontWeight: 'bold',
                                            }}
                                            suffix="₫"
                                        />
                                    </Col>
                                    <Col span={12}>
                                        <Statistic
                                            title="Nợ còn lại sau thu"
                                            value={remainingDebt}
                                            valueStyle={{ color: '#153D36' }}
                                            suffix="₫"
                                        />
                                    </Col>
                                </Row>
                            </div>
                        )}

                        {/* Thông báo nếu không nợ */}
                        {form.getFieldValue('idReader') &&
                            currentDebt === 0 && (
                                <div className="bg-green-50 p-3 rounded mb-4 text-green-700 flex items-center gap-2">
                                    <SolutionOutlined /> Độc giả này không có
                                    khoản nợ nào.
                                </div>
                            )}

                        {/* Nhập số tiền */}
                        <Form.Item
                            label={
                                <span className="font-medium text-[#153D36]">
                                    Số tiền thu
                                </span>
                            }
                            name="amount"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập số tiền!',
                                },
                                {
                                    type: 'number',
                                    min: 1000,
                                    message: 'Số tiền tối thiểu là 1,000 đ',
                                },
                                {
                                    validator: async (_, value) => {
                                        if (value > currentDebt) {
                                            return Promise.reject(
                                                new Error(
                                                    'Không thể thu quá số tiền nợ!'
                                                )
                                            );
                                        }
                                    },
                                },
                            ]}
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                placeholder="Nhập số tiền..."
                                addonAfter="VND"
                                disabled={currentDebt === 0}
                                formatter={(value) =>
                                    `${value}`.replace(
                                        /\B(?=(\d{3})+(?!\d))/g,
                                        ','
                                    )
                                }
                                parser={(value) =>
                                    value!.replace(
                                        /\$\s?|(,*)/g,
                                        ''
                                    ) as unknown as number
                                }
                                onChange={(value) =>
                                    setPayAmount(Number(value))
                                }
                                prefix={
                                    <DollarOutlined className="text-gray-400" />
                                }
                            />
                        </Form.Item>

                        <Divider />

                        {/* Button Submit */}
                        <Form.Item className="mb-0">
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={submitting}
                                disabled={currentDebt === 0}
                                block
                                size="large"
                                style={{
                                    backgroundColor: '#17966F',
                                    borderColor: '#17966F',
                                    fontWeight: 600,
                                    height: '48px',
                                    color: 'white',
                                }}
                                className="hover:!bg-[#153D36] transition-colors shadow-md"
                            >
                                Xác nhận thu tiền
                            </Button>
                        </Form.Item>
                    </Form>
                </Spin>
            </Card>
        </div>
    );
};

export default FineForm;
