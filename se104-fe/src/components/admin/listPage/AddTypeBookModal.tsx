import { useState } from "react";
import { Modal, Form, Input, message } from "antd";
import { addTypeBookAPI } from "@/services/api";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddTypeBookModal = ({ open, onClose, onSuccess }: Props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await addTypeBookAPI(values.nameTypeBook);
      message.success("Thêm loại sách thành công!");
      onSuccess();
      onClose();
      form.resetFields();
    } catch (err) {
      message.error("Vui lòng kiểm tra thông tin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Thêm loại sách"
      open={open}
      onCancel={onClose}
      onOk={handleAdd}
      confirmLoading={loading}
      okText="Thêm"
      cancelText="Huỷ"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="nameTypeBook"
          label="Tên loại sách"
          rules={[{ required: true, message: "Không được bỏ trống" }]}
        >
          <Input placeholder="Nhập tên loại sách" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddTypeBookModal;
