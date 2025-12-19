import React, { useEffect, useState } from "react";
import {
  getAllLoanSlipsAPI,
  getAllReadersAPI,
  getAllBooksAndCommentsAPI,
  addSlipBookAPI,
} from "@/services/api";
import {
  message,
  Table,
  Tag,
  Button,
  Input,
  Card,
  Typography,
  Popconfirm,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

const { Title } = Typography;

interface ILoanData extends ILoanSlip {
  key: string;
  readerName: string;
  bookNameDisplay: string;
}

interface IReaderSimple {
  idReader: string;
  nameReader: string;
}

const ListBorrow = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ILoanData[]>([]);
  const [searchText, setSearchText] = useState("");

  const formatCurrency = (amount?: number) => {
    return amount
      ? amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
      : "0 ₫";
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const idUser = localStorage.getItem("idUser");
      if (!idUser) {
        message.warning("Không tìm thấy thông tin User!");
        setLoading(false);
        return;
      }

      const [loanRes, readerRes, bookRes] = await Promise.all([
        getAllLoanSlipsAPI(),
        getAllReadersAPI(),
        getAllBooksAndCommentsAPI(idUser),
      ]);

      const loans = Array.isArray(loanRes?.data) 
        ? loanRes.data 
        : (Array.isArray(loanRes) ? loanRes : []);

      const readers: IReaderSimple[] = Array.isArray(readerRes?.data) 
        ? readerRes.data 
        : (Array.isArray(readerRes) ? readerRes : []);

      const books: IBook[] = Array.isArray(bookRes?.data) 
        ? bookRes.data 
        : (Array.isArray(bookRes) ? bookRes : []);

      const mappedData: ILoanData[] = loans.map((item: any) => {
        const reader = readers.find((r) => r.idReader === item.idReader);
        const book = books.find((b) => b.idBook === item.idTheBook); 

        return {
          ...item,
          key: item.idLoanSlipBook,
          // Đảm bảo luôn có string, tránh null
          readerName: reader ? reader.nameReader : (item.idReader || "Không rõ"),
          bookNameDisplay: item.nameBook || book?.nameBook || "(Không rõ tên)",
        };
      });

      mappedData.sort((a, b) => dayjs(b.borrowDate).valueOf() - dayjs(a.borrowDate).valueOf());

      setData(mappedData);
    } catch (err) {
      console.error(err);
      message.error("Lỗi khi tải dữ liệu hệ thống!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReturn = async (item: ILoanData) => {
    try {
      const res = await addSlipBookAPI(
        item.idLoanSlipBook,
        item.idReader,
        item.idTheBook
      );

      if (res && (res.statusCode === 200)) {
        message.success(`Đã trả sách: ${item.bookNameDisplay}`);
        fetchData(); 
      } else {
        message.error(res?.message || "Trả sách thất bại!");
      }
    } catch (error) {
      console.error("Lỗi trả sách:", error);
      message.error("Lỗi kết nối khi trả sách!");
    }
  };

  const columns: ColumnsType<ILoanData> = [
    {
      title: "Người mượn",
      dataIndex: "readerName",
      key: "readerName",
      render: (text) => <span className="font-medium text-[#153D36]">{text}</span>,
      responsive: ['sm'],
    },
    {
      title: "Tên sách",
      dataIndex: "bookNameDisplay",
      key: "bookNameDisplay",
      ellipsis: true,
    },
    {
      title: "Ngày mượn",
      dataIndex: "borrowDate",
      key: "borrowDate",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
      sorter: (a, b) => dayjs(a.borrowDate).valueOf() - dayjs(b.borrowDate).valueOf(),
      responsive: ['md'],
    },
    {
      title: "Hạn trả",
      dataIndex: "returnDate",
      key: "returnDate",
      render: (date, record) => {
        if (record.isReturned) return dayjs(date).format("DD/MM/YYYY");
        
        const isLate = dayjs().isAfter(dayjs(date), 'day');
        return (
          <span className={isLate ? "text-red-500 font-bold" : ""}>
             {dayjs(date).format("DD/MM/YY")}
          </span>
        )
      },
    },
    {
      title: "Phạt",
      dataIndex: "fineAmount",
      key: "fineAmount",
      align: "right",
      render: (amount) => (
        <span className={amount > 0 ? "text-red-500 font-semibold text-xs sm:text-sm" : "text-gray-400 text-xs sm:text-sm"}>
          {formatCurrency(amount)}
        </span>
      ),
      responsive: ['sm'],
    },
    {
      title: "Hành động",
      key: "action",
      align: "center",
      width: 100,
      render: (_, record) => {
        if (record.isReturned) {
          return (
            <Tag icon={<CheckCircleOutlined />} color="success" className="px-2 py-0.5 text-xs rounded-full">
              Đã trả
            </Tag>
          );
        }
        return (
          <Popconfirm
            title="Xác nhận trả sách"
            description={`Bạn có chắc muốn trả sách "${record.bookNameDisplay}"?`}
            onConfirm={() => handleReturn(record)}
            okText="Đồng ý"
            cancelText="Hủy"
            okButtonProps={{ style: { backgroundColor: '#17966F' } }}
          >
            <Button 
                type="primary" 
                size="small"
                icon={<SyncOutlined />}
                style={{ backgroundColor: "#17966F", borderColor: "#17966F" }}
                className="!px-2 !text-xs sm:!px-3 sm:!text-sm"
            >
              <span className="hidden sm:inline">Trả sách</span>
              <span className="sm:hidden">Trả</span>
            </Button>
          </Popconfirm>
        );
      },
    },
  ];

  // --- SỬA LỖI CRASH TẠI ĐÂY ---
  const filteredData = data.filter((item) => {
    // Luôn đảm bảo biến là chuỗi string trước khi gọi .toLowerCase()
    const rName = item.readerName || ""; 
    const bName = item.bookNameDisplay || "";
    const search = searchText.toLowerCase();

    return rName.toLowerCase().includes(search) || bName.toLowerCase().includes(search);
  });

  return (
    <div className="flex justify-center items-start min-h-[300px] sm:min-h-screen bg-gray-50 p-2 sm:p-4">
      <Card
        className="w-full shadow-lg rounded-xl border-t-4 border-t-[#153D36]"
        styles={{ body: { padding: "12px" } }}
      >
        <div className="sm:p-2">
          <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
            {/* Header */}
            <div>
              <Title level={4} className="!text-base sm:!text-xl !mb-0" style={{ color: "#153D36" }}>
                Quản Lý Mượn Trả
              </Title>
              <p className="text-gray-500 text-xs sm:text-sm">Theo dõi danh sách sách đang được mượn</p>
            </div>
            
            {/* Controls - Stack on mobile */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Input
                placeholder="Tìm theo tên hoặc sách..."
                prefix={<SearchOutlined className="text-gray-400" />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full sm:w-64"
                allowClear
              />
              <Button 
                  icon={<ReloadOutlined />} 
                  onClick={fetchData}
                  loading={loading}
                  className="w-full sm:w-auto"
              >
                  Làm mới
              </Button>
            </div>
          </div>

          {/* Responsive Table Container */}
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <div className="min-w-[400px] sm:min-w-0 px-3 sm:px-0">
              <Table
                columns={columns}
                dataSource={filteredData}
                loading={loading}
                pagination={{ pageSize: 8, size: "small" }}
                rowClassName={() => "hover:bg-gray-50 transition-colors"}
                locale={{ emptyText: "Không có dữ liệu mượn sách" }}
                bordered
                size="small"
                scroll={{ x: 'max-content' }}
                className="[&_.ant-table-cell]:!py-2 sm:[&_.ant-table-cell]:!py-3 [&_.ant-table-cell]:!text-xs sm:[&_.ant-table-cell]:!text-sm"
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ListBorrow;