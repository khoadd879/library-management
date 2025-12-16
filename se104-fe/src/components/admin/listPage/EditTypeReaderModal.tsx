import { useEffect, useState } from "react";
import { Modal, Form, Input, message } from "antd";
import { updateTypeReaderAPI } from "@/services/api";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData: {
    idTypeReader: string;
    nameTypeReader: string;
  };
}

const EditTypeReaderModal = ({
  open,
  onClose,
  onSuccess,
  initialData,
}: Props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      form.setFieldsValue({ nameTypeReader: initialData.nameTypeReader });
    }
  }, [open, initialData]);

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await updateTypeReaderAPI(
        initialData.idTypeReader,
        values.nameTypeReader
      );
      message.success("Cập nhật loại độc giả thành công!");
      onSuccess();
      onClose();
    } catch {
      message.error("Không thể cập nhật loại độc giả.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Chỉnh sửa loại độc giả"
      open={open}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
      okText="Lưu"
      cancelText="Huỷ"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="nameTypeReader"
          label="Tên loại độc giả"
          rules={[{ required: true, message: "Không được để trống" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditTypeReaderModal;
