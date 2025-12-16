import { useEffect, useState } from "react";
import { Modal, Form, Input, message } from "antd";
import { updateTypeBookAPI } from "@/services/api";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData: {
    idTypeBook: string;
    nameTypeBook: string;
  };
}

const EditTypeBookModal = ({
  open,
  onClose,
  onSuccess,
  initialData,
}: Props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      form.setFieldsValue({ nameTypeBook: initialData.nameTypeBook });
    }
  }, [open, initialData]);

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await updateTypeBookAPI(initialData.idTypeBook, values.nameTypeBook);
      message.success("Cập nhật loại sách thành công!");
      onSuccess();
      onClose();
    } catch (err) {
      message.error("Vui lòng kiểm tra thông tin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Chỉnh sửa loại sách"
      open={open}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
      okText="Lưu"
      cancelText="Huỷ"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="nameTypeBook"
          label="Tên loại sách"
          rules={[{ required: true, message: "Không được bỏ trống" }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditTypeBookModal;
