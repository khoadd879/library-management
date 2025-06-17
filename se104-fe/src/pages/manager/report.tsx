import React, { useEffect, useRef, useState } from "react";
import { DatePicker, message, Input, Table } from "antd";
import dayjs from "dayjs";
import { addOverdueReportAPI } from "@/services/api";

const Report = () => {
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(dayjs());
  const [loading, setLoading] = useState(false);
  const [dateText, setDateText] = useState("");
  const [reportData, setReportData] = useState<any[]>([]);
  const hasFetched = useRef(false);
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    const init = async () => {
      const date = dayjs().startOf("day");
      const formatted = date.format("YYYY-MM-DD");
      try {
        const res = await addOverdueReportAPI(formatted);
        setDateText(formatted);
        setReportData(res?.data?.data?.detail || []);
        message.success("Đã gửi báo cáo ngày hôm nay.");
      } catch (err) {
        message.error("Không thể gửi báo cáo hôm nay.");
        console.error(err);
      }
    };
    init();
  }, []);

  const handleDateChange = async (date: dayjs.Dayjs | null) => {
    if (!date) return;
    const formatted = date.format("YYYY-MM-DD");
    setSelectedDate(date);
    setDateText(formatted);
    setLoading(true);
    try {
      const res = await addOverdueReportAPI(formatted);
      setReportData(res?.data?.detail || []);
      message.success("Đã gửi báo cáo với ngày đã chọn.");
    } catch (err) {
      message.error("Không thể gửi báo cáo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white shadow rounded">
      <h2 className="text-lg font-semibold mb-4 text-center">
        Báo cáo sách trả trễ
      </h2>

      <label className="block mb-2 font-medium">Chọn ngày:</label>
      <DatePicker
        className="w-full max-w-sm mb-4"
        value={selectedDate}
        onChange={handleDateChange}
        disabled={loading}
      />

      <Table
        columns={[
          { title: "STT", render: (_, __, idx) => idx + 1 },
          { title: "Mã sách", dataIndex: "idTheBook" },
          { title: "Tên sách", dataIndex: "nameHeaderBook" },
          { title: "Số ngày trễ", dataIndex: "lateDays" },
          {
            title: "Ngày mượn",
            dataIndex: "borrowDate",
            render: (value: string) => dayjs(value).format("DD/MM/YYYY"),
          },
        ]}
        dataSource={reportData}
        rowKey={(record) => record.idOverdueReport}
        loading={loading}
        pagination={false}
      />
    </div>
  );
};

export default Report;
