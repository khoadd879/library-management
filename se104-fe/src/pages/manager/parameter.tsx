import { useEffect, useState, useMemo } from "react";
import { getAllParametersAPI, updateParameterAPI } from "@/services/api";
import {
  Table,
  InputNumber,
  Button,
  message,
  Switch,
  Card,
  Typography,
  Tag,
  Space,
  Badge,
} from "antd";
import {
  SettingOutlined,
  ReloadOutlined,
  SaveOutlined,
  UndoOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined
} from "@ant-design/icons";

const { Text, Title } = Typography;

interface IParameter {
  idParameter: string;
  nameParameter: string;
  valueParameter: number;
}

// Hàm helper để làm đẹp tên biến (VD: maxStudentPerRoom -> Max Student Per Room)
const formatParameterName = (name: string) => {
  return name
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

// Vietnamese translation mapping for parameter names
const PARAMETER_TRANSLATIONS: Record<string, {
  vn: string;
  description: string;
  unit?: string;
}> = {
  "MinReaderAge": {
    vn: "Tuổi tối thiểu độc giả",
    description: "Độ tuổi nhỏ nhất được phép đăng ký làm độc giả",
    unit: "tuổi"
  },
  "MaxReaderAge": {
    vn: "Tuổi tối đa độc giả",
    description: "Độ tuổi lớn nhất được phép đăng ký làm độc giả",
    unit: "tuổi"
  },
  "CardExpirationDate": {
    vn: "Thời hạn thẻ",
    description: "Số tháng thẻ độc giả có hiệu lực",
    unit: "tháng"
  },
  "BorrowingLimit": {
    vn: "Giới hạn mượn sách",
    description: "Số sách tối đa được mượn cùng lúc",
    unit: "cuốn"
  },
  "BorrowingPeriodDays": {
    vn: "Thời gian mượn",
    description: "Số ngày được phép mượn sách",
    unit: "ngày"
  },
  "FinePerOverdueDay": {
    vn: "Phí trễ hạn",
    description: "Số tiền phạt mỗi ngày trả muộn",
    unit: "VNĐ/ngày"
  },
  "LateReturnPenaltyPolicy": {
    vn: "Chính sách phạt trễ",
    description: "Bật/tắt tính năng phạt trả sách muộn"
  },
  "PublishGap": {
    vn: "Khoảng cách phát hành tối thiểu",
    description: "Số năm tối thiểu giữa xuất bản và nhập thư viện",
    unit: "năm"
  }
};

// Get parameter display information
const getParameterDisplay = (nameParameter: string) => {
  const translation = PARAMETER_TRANSLATIONS[nameParameter];
  return {
    vietnamese: translation?.vn || formatParameterName(nameParameter),
    description: translation?.description || "",
    unit: translation?.unit || "",
    englishKey: nameParameter
  };
};

const Parameter = () => {
  const [params, setParams] = useState<IParameter[]>([]);
  const [editing, setEditing] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchParameters = async () => {
    try {
      setLoading(true);
      const res: any = await getAllParametersAPI();
      let dataToCheck: IParameter[] = [];

      if (Array.isArray(res)) dataToCheck = res;
      else if (res?.data && Array.isArray(res.data)) dataToCheck = res.data;
      else if (res?.result && Array.isArray(res.result)) dataToCheck = res.result;

      setParams(dataToCheck);

      // Reset editing state về giống dữ liệu gốc
      const editMap: { [key: string]: number } = {};
      dataToCheck.forEach((p) => {
        editMap[p.idParameter] = p.valueParameter;
      });
      setEditing(editMap);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải cấu hình hệ thống.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParameters();
  }, []);

  // Tính toán xem có thay đổi nào chưa lưu không
  const changedItems = useMemo(() => {
    return params.filter(
      (p) => editing[p.idParameter] !== p.valueParameter
    );
  }, [params, editing]);

  const hasChanges = changedItems.length > 0;

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      // Chạy song song các request update (hoặc gửi 1 mảng nếu BE hỗ trợ bulk update)
      const promises = changedItems.map((item) =>
        updateParameterAPI(item.idParameter, {
          nameParameter: item.nameParameter,
          valueParameter: editing[item.idParameter],
        })
      );

      await Promise.all(promises);
      message.success(`Đã cập nhật thành công ${changedItems.length} cấu hình!`);
      await fetchParameters(); // Tải lại dữ liệu mới nhất
    } catch (err) {
      console.error(err);
      message.error("Có lỗi xảy ra khi lưu.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    const resetMap: { [key: string]: number } = {};
    params.forEach((p) => {
      resetMap[p.idParameter] = p.valueParameter;
    });
    setEditing(resetMap);
    message.info("Đã khôi phục giá trị gốc.");
  };

  const columns = [
    {
      title: "TÊN CẤU HÌNH",
      dataIndex: "nameParameter",
      width: "50%",
      render: (text: string, record: IParameter) => {
        const isChanged = editing[record.idParameter] !== record.valueParameter;
        const display = getParameterDisplay(text);

        return (
          <div className="flex items-start gap-3">
            {/* Icon thay đổi tùy trạng thái */}
            <div className={`mt-1 p-2 rounded-lg ${isChanged ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
              {isChanged ? <InfoCircleOutlined /> : <SettingOutlined />}
            </div>
            <div>
              {/* Vietnamese name - primary */}
              <Text strong className="text-base block text-gray-800">
                {display.vietnamese}
              </Text>

              {/* Description */}
              {display.description && (
                <Text type="secondary" className="text-xs block text-gray-500 mt-0.5">
                  {display.description}
                </Text>
              )}

              {/* English key - for reference */}
              <Text type="secondary" className="text-xs font-mono text-gray-400 mt-0.5 block">
                Key: {display.englishKey}
              </Text>
            </div>
          </div>
        );
      },
    },
    {
      title: "GIÁ TRỊ THIẾT LẬP",
      width: "50%",
      render: (_: any, record: IParameter) => {
        const isSwitch = record.nameParameter.toLowerCase().includes("policy") ||
          record.nameParameter.toLowerCase().includes("enable");
        const currentValue = editing[record.idParameter];
        const originalValue = record.valueParameter;
        const isChanged = currentValue !== originalValue;
        const display = getParameterDisplay(record.nameParameter);

        return (
          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-2">
              {isSwitch ? (
                <Switch
                  checkedChildren={<CheckCircleOutlined />}
                  unCheckedChildren="Tắt"
                  checked={currentValue === 1}
                  onChange={(checked) =>
                    setEditing((prev) => ({ ...prev, [record.idParameter]: checked ? 1 : 0 }))
                  }
                />
              ) : (
                <>
                  <InputNumber
                    size="middle"
                    className={`${isChanged ? 'border-orange-400 shadow-sm' : ''}`}
                    value={currentValue}
                    onChange={(val) =>
                      setEditing((prev) => ({ ...prev, [record.idParameter]: val || 0 }))
                    }
                  />
                  {/* Show unit */}
                  {display.unit && (
                    <Text type="secondary" className="text-sm whitespace-nowrap">
                      {display.unit}
                    </Text>
                  )}
                </>
              )}
            </div>

            {/* Hiển thị giá trị cũ khi có thay đổi */}
            {isChanged && (
              <div className="text-xs text-gray-400 ml-4 flex flex-col items-end animate-fade-in">
                <span>Gốc: {isSwitch ? (originalValue === 1 ? "Bật" : "Tắt") : `${originalValue} ${display.unit || ""}`}</span>
                <Tag color="warning" className="mr-0 mt-1 border-0 bg-orange-50 text-orange-600">Đã sửa</Tag>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-6 bg-gray-50/50 min-h-screen pb-24 relative">
      <div className="max-w-5xl mx-auto">

        {/* Header Section */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <Title level={3} style={{ marginBottom: 0 }}>Cấu Hình Hệ Thống</Title>
            <Text type="secondary">Quản lý các tham số và luật lệ vận hành.</Text>
          </div>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchParameters}
            loading={loading}
            type="text"
            className="text-gray-500 hover:text-blue-600 hover:bg-blue-50"
          >
            Làm mới dữ liệu
          </Button>
        </div>

        {/* Main Card */}
        <Card
          bordered={false}
          className="shadow-sm rounded-xl overflow-hidden"
          bodyStyle={{ padding: 0 }}
        >
          <Table
            dataSource={params}
            rowKey="idParameter"
            pagination={false}
            loading={loading}
            columns={columns}
            // Row styling: Highlight row đang được sửa
            rowClassName={(record) => {
              const isChanged = editing[record.idParameter] !== record.valueParameter;
              return isChanged ? "bg-orange-50/30 transition-colors" : "hover:bg-gray-50 transition-colors";
            }}
          />
        </Card>
      </div>

      {/* Floating Action Bar - Chỉ hiện khi có thay đổi */}
      <div
        className={`fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-50 transition-transform duration-300 ease-in-out ${hasChanges ? "translate-y-0" : "translate-y-full"
          }`}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge count={changedItems.length} style={{ backgroundColor: '#faad14' }} />
            <span className="font-medium text-gray-700">cấu hình chưa được lưu.</span>
          </div>
          <Space>
            <Button
              onClick={handleReset}
              icon={<UndoOutlined />}
              disabled={saving}
            >
              Hủy thay đổi
            </Button>
            <Button
              type="primary"
              onClick={handleSaveAll}
              loading={saving}
              icon={<SaveOutlined />}
              className="bg-black hover:bg-gray-800 border-black h-10 px-6 shadow-lg shadow-gray-400/50"
            >
              Lưu tất cả thay đổi
            </Button>
          </Space>
        </div>
      </div>
    </div>
  );
};

export default Parameter;