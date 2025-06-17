import { useEffect, useState } from "react";
import { getAllParametersAPI, updateParameterAPI } from "@/services/api";
import { Table, InputNumber, Button, message } from "antd";

interface IParameter {
  idParameter: string;
  nameParameter: string;
  valueParameter: number;
}

const Parameter = () => {
  const [params, setParams] = useState<IParameter[]>([]);
  const [editing, setEditing] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(false);

  const fetchParameters = async () => {
    try {
      const res = await getAllParametersAPI();
      setParams(res);
      const editMap: { [key: string]: number } = {};
      res.forEach((p: IParameter) => {
        editMap[p.idParameter] = p.valueParameter;
      });
      setEditing(editMap);
    } catch (err) {
      message.error("Không thể tải tham số.");
    }
  };

  const handleSave = async (param: IParameter) => {
    try {
      setLoading(true);
      await updateParameterAPI(param.idParameter, {
        nameParameter: param.nameParameter,
        valueParameter: editing[param.idParameter],
      });
      message.success("Cập nhật thành công.");
      fetchParameters();
    } catch (err) {
      message.error("Cập nhật thất bại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParameters();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Sửa luật hệ thống
      </h2>
      <Table
        dataSource={params}
        rowKey="idParameter"
        pagination={false}
        loading={loading}
        columns={[
          { title: "Tên luật", dataIndex: "nameParameter" },
          {
            title: "Giá trị",
            render: (_, record) => (
              <InputNumber
                value={editing[record.idParameter]}
                onChange={(val) =>
                  setEditing({ ...editing, [record.idParameter]: val || 0 })
                }
              />
            ),
          },
          {
            title: "Hành động",
            render: (_, record) => (
              <Button type="primary" onClick={() => handleSave(record)}>
                Lưu
              </Button>
            ),
          },
        ]}
      />
    </div>
  );
};

export default Parameter;
