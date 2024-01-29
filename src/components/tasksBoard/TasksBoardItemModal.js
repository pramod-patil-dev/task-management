import { useEffect, useRef } from "react";
import { Modal, Form, Input } from "antd";

function TaskboardItemModal({ visible, initialValues, onCancel, onOk }) {
  const [form] = Form.useForm();
  const inputRef = useRef(null);

  useEffect(() => {
    if (visible) {
      inputRef.current?.focus();
      form.resetFields();
    }
  }, [form, visible]);

  return (
    <Modal
      title="Add Item"
      visible={visible}
      destroyOnClose
      forceRender
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <Form
        autoComplete="off"
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={(values) => {
          onOk(values);
          form.resetFields();
          onCancel();
        }}
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[
            { required: true, message: "'Title' is required" },
            {
              max: 100,
              message: "'Title' can not be longer than 100 characters",
            },
          ]}
        >
          <Input ref={inputRef} autoFocus />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[
            { required: true, message: "'Description' is required" },
            {
              max: 400,
              message: "'Description' can not be longer than 400 characters",
            },
          ]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default TaskboardItemModal;
