// src/components/EditOfferForm.tsx
import React from "react";
import { Form, Input, DatePicker, Button } from "antd";
import dayjs from "dayjs";

interface EditOfferFormProps {
  offer: {
    title: string;
    description: string;
    expirationDate: string;
    tag: string;
  };
  onSubmit: (values: any) => void;
  onCancel: () => void;
  t: (key: string) => string;
  form: any; 
}

export const EditOfferForm: React.FC<EditOfferFormProps> = ({ offer, onSubmit, onCancel, t, form }) => {

  const handleCancel = () => {
    form.resetFields();  
    onCancel();          
  };

  return (
    <Form
      form={form}
      initialValues={{
        title: offer.title,
        description: offer.description,
        expirationDate: dayjs(offer.expirationDate), 
        tag: offer.tag
      }}
      onFinish={onSubmit}
    >
      <Form.Item
        label={t("title")}
        name="title"
        rules={[{ required: true, message: t("Please input the title!") }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={t("description")}
        name="description"
        rules={[{ required: true, message: t("Please input the description!") }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={t("expiration_date")}
        name="expirationDate"
        rules={[{ required: true, message: t("Please input the expiration date!") }]}
      >
        <DatePicker />
      </Form.Item>

      <Form.Item
        label={t("tag")}
        name="tag"
        rules={[{ required: true, message: t("Please input the tag!") }]}
      >
        <Input />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {t("save")}
        </Button>
        <Button onClick={handleCancel} style={{ marginLeft: 8 }}>
          {t("cancel")}
        </Button>
      </Form.Item>
    </Form>
  );
};
