import  { useEffect, useState, useRef } from 'react';
import { 
    DatePicker, message, Table, Card, 
    Statistic, Row, Col, Button, Progress, Avatar, Tooltip 
} from 'antd';
import { 
    FileTextOutlined, CalendarOutlined, WarningOutlined, 
    ReloadOutlined, ReadOutlined, ClockCircleOutlined, 
    BarChartOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { addOverdueReportAPI } from '@/services/api';



interface IReportDetail {
    idOverdueReport: string;
    idTheBook: string;
    nameHeaderBook: string;
    borrowDate: string;
    lateDays: number;
}

const Report = () => {
    const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(dayjs());
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState<IReportDetail[]>([]);
    
    // Tính toán thống kê
    const totalBooks = reportData.length;
    const maxLateDays = Math.max(...reportData.map(d => d.lateDays), 0);
    const avgLateDays = totalBooks > 0 
        ? Math.round(reportData.reduce((acc, curr) => acc + curr.lateDays, 0) / totalBooks) 
        : 0;

    const hasFetched = useRef(false);

    const fetchReport = async (date: dayjs.Dayjs) => {
        setLoading(true);
        const formattedDate = date.format('YYYY-MM-DD');
        try {
            const res = await addOverdueReportAPI(formattedDate);
            const dataList = res?.data?.detail || res?.data?.data?.detail || [];
            setReportData(dataList);
            message.success(`Đã cập nhật dữ liệu ngày ${date.format('DD/MM/YYYY')}`);
        } catch (err) {
            console.error(err);
            message.error('Không thể tải báo cáo.');
            setReportData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        fetchReport(dayjs());
    }, []);

    const columns = [
        {
            title: '#',
            key: 'index',
            width: 60,
            align: 'center' as const,
            render: (_: any, __: any, idx: number) => <span className="text-gray-400 font-medium">{idx + 1}</span>,
        },
        {
            title: 'Thông tin sách',
            dataIndex: 'nameHeaderBook',
            key: 'nameHeaderBook',
            render: (text: string, record: IReportDetail) => (
                <div className="flex items-center gap-3">
                    <Avatar 
                        shape="square" 
                        size="large" 
                        icon={<ReadOutlined />} 
                        className="bg-[#e6f7ff] text-[#1890ff]"
                    />
                    <div className="flex flex-col">
                        <span className="font-semibold text-[#153D36] text-base">{text}</span>
                        <span className="text-xs text-gray-500 font-mono">ID: {record.idTheBook}</span>
                    </div>
                </div>
            )
        },
        {
            title: 'Ngày mượn',
            dataIndex: 'borrowDate',
            key: 'borrowDate',
            align: 'center' as const,
            width: 150,
            render: (value: string) => (
                <div className="flex flex-col items-center">
                    <span className="text-gray-700 font-medium">{dayjs(value).format('DD/MM/YYYY')}</span>
                    <span className="text-xs text-gray-400">
                        {dayjs().diff(dayjs(value), 'day')} ngày trước
                    </span>
                </div>
            ),
        },
        {
            title: 'Mức độ trễ hạn',
            dataIndex: 'lateDays',
            key: 'lateDays',
            width: 300,
            sorter: (a: IReportDetail, b: IReportDetail) => a.lateDays - b.lateDays,
            render: (days: number) => {
                // Logic màu sắc thanh progress
                let color = "#52c41a"; // Xanh (nhẹ)
                let percent = Math.min((days / 30) * 100, 100); // Quy đổi ra % (giả sử 30 ngày là max)
                
                if (days > 7) color = "#faad14"; // Vàng (cảnh báo)
                if (days > 14) color = "#ff4d4f"; // Đỏ (nghiêm trọng)

                return (
                    <div className="w-full">
                        <div className="flex justify-between mb-1">
                            <span className={`font-bold ${days > 14 ? 'text-red-500' : 'text-gray-600'}`}>
                                {days} ngày
                            </span>
                            <span className="text-xs text-gray-400">
                                {days > 14 ? 'Nghiêm trọng' : days > 7 ? 'Cảnh báo' : 'Mới quá hạn'}
                            </span>
                        </div>
                        <Progress 
                            percent={percent} 
                            showInfo={false} 
                            strokeColor={color} 
                            trailColor="#f0f0f0"
                            size="small"
                        />
                    </div>
                )
            }
        },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] p-6 font-sans">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#153D36] mb-2 flex items-center gap-3">
                        <BarChartOutlined /> Báo Cáo Vi Phạm
                    </h1>
                    <p className="text-gray-500">
                        Thống kê chi tiết các đầu sách chưa được trả đúng hạn tính đến ngày hiện tại.
                    </p>
                </div>

                <div className="bg-white p-1.5 pl-4 rounded-lg shadow-sm border border-gray-200 flex items-center gap-3">
                    <span className="text-gray-500 font-medium text-sm">Xem báo cáo ngày:</span>
                    <DatePicker
                        value={selectedDate}
                        onChange={(d) => { if(d) { setSelectedDate(d); fetchReport(d); } }}
                        format="DD/MM/YYYY"
                        allowClear={false}
                        className="border-none bg-gray-50 font-semibold text-[#153D36]"
                        suffixIcon={<CalendarOutlined style={{ color: '#17966F' }} />}
                        disabledDate={(current) => current && current > dayjs().endOf('day')}
                    />
                    <Tooltip title="Làm mới dữ liệu">
                        <Button 
                            type="text" 
                            shape="circle"
                            icon={<ReloadOutlined spin={loading} />} 
                            onClick={() => selectedDate && fetchReport(selectedDate)}
                            className="text-[#17966F] hover:bg-green-50"
                        />
                    </Tooltip>
                </div>
            </div>

            {/* Stats Cards Row */}
            {/* Stats Cards Row */}
            <Row gutter={[24, 24]} className="mb-8" align="stretch">
                {/* Card 1: Tổng số - Nền tối Gradient */}
                <Col xs={24} sm={8}>
                    <Card 
                        bordered={false} 
                        hoverable
                        className="shadow-lg rounded-xl transition-transform"
                        style={{ 
                            height: '100%', 
                            background: 'linear-gradient(135deg, #153D36 0%, #0C2924 100%)',
                            color: 'white'
                        }}
                        bodyStyle={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="text-gray-300 text-sm font-medium uppercase tracking-wider mb-1">
                                    Tổng sách trễ
                                </div>
                                <div className="text-5xl font-bold text-white tracking-tight">
                                    {totalBooks}
                                </div>
                                <div className="text-green-400 mt-2 font-medium flex items-center gap-1">
                                    <WarningOutlined /> Cần thu hồi gấp
                                </div>
                            </div>
                            <div className="p-3 bg-white/10 rounded-full text-white">
                                <FileTextOutlined style={{ fontSize: '24px' }} />
                            </div>
                        </div>
                    </Card>
                </Col>
                
                {/* Card 2: Trễ lâu nhất - Viền đỏ */}
                <Col xs={24} sm={8}>
                    <Card 
                        bordered={false} 
                        hoverable
                        className="shadow-md rounded-xl bg-white border-t-4 border-t-red-500"
                        style={{ height: '100%' }}
                        bodyStyle={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                    >
                        <Statistic 
                            title={<span className="text-gray-600 font-semibold text-base">Trễ lâu nhất</span>}
                            value={maxLateDays} 
                            suffix={<span className="text-sm text-gray-400 font-normal">ngày</span>}
                            valueStyle={{ color: '#ff4d4f', fontWeight: '800', fontSize: '2.5rem' }}
                            prefix={<ClockCircleOutlined className="mr-2" />}
                        />
                        <div className="mt-4">
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Mức độ nghiêm trọng</span>
                                <span>{maxLateDays > 0 ? 'Cao' : 'Thấp'}</span>
                            </div>
                            <Progress 
                                percent={Math.min(maxLateDays * 2, 100)} 
                                showInfo={false} 
                                strokeColor="#ff4d4f" 
                                trailColor="#ffe5e5"
                                size="small" 
                            />
                        </div>
                    </Card>
                </Col>

                {/* Card 3: Trung bình - Viền vàng */}
                <Col xs={24} sm={8}>
                    <Card 
                        bordered={false} 
                        hoverable
                        className="shadow-md rounded-xl bg-white border-t-4 border-t-yellow-500"
                        style={{ height: '100%' }}
                        bodyStyle={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                    >
                         <Statistic 
                            title={<span className="text-gray-600 font-semibold text-base">Trung bình trễ</span>}
                            value={avgLateDays} 
                            suffix={<span className="text-sm text-gray-400 font-normal">ngày/sách</span>}
                            valueStyle={{ color: '#faad14', fontWeight: '800', fontSize: '2.5rem' }}
                            prefix={<CalendarOutlined className="mr-2" />}
                        />
                        <div className="mt-4">
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                                <span>Tỉ lệ trung bình</span>
                                <span>{avgLateDays} ngày</span>
                            </div>
                            <Progress 
                                percent={Math.min(avgLateDays * 3, 100)} 
                                showInfo={false} 
                                strokeColor="#faad14" 
                                trailColor="#fffbe6"
                                size="small" 
                            />
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Table Section */}
            <Card 
                bordered={false} 
                className="shadow-lg rounded-xl overflow-hidden"
                bodyStyle={{ padding: 0 }}
            >
                <Table
                    columns={columns}
                    dataSource={reportData}
                    rowKey="idOverdueReport"
                    loading={loading}
                    pagination={{ 
                        pageSize: 8, 
                        showTotal: (total) => `Tổng ${total} bản ghi`,
                        className: "p-4"
                    }}
                    rowClassName="hover:bg-gray-50 transition-colors cursor-pointer"
                />
            </Card>
        </div>
    );
};

export default Report;