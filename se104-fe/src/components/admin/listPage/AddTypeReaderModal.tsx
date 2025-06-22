import React, { useState } from "react";
import { Modal, Form, Input, message } from "antd";
import { addTypeReaderAPI } from "@/services/api";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddTypeReaderModal = ({ open, onClose, onSuccess }: Props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await addTypeReaderAPI(values.nameTypeReader);
      message.success("Thêm loại độc giả thành công!");
      form.resetFields();
      onSuccess();
      onClose();
    } catch {
      message.error("Vui lòng nhập đầy đủ thông tin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Thêm loại độc giả"
      open={open}
      onCancel={onClose}
      onOk={handleAdd}
      confirmLoading={loading}
      okText="Thêm"
      cancelText="Huỷ"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="nameTypeReader"
          label="Tên loại độc giả"
          rules={[{ required: true, message: "Không được để trống" }]}
        >
          <Input placeholder="Nhập tên loại độc giả" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddTypeReaderModal;
