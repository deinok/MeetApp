import React from "react";
import { Form, Input, DatePicker, Button, DatePickerProps } from "antd";
import dayjs from "dayjs";

interface EditOfferFormProps {
  offer: {
    title: string;
    description: string;
    expirationDate: string;
    tag: string;
  };
  onSubmit: (values: { title: string; description: string; expirationDate: string; tag: string }) => void;
  onCancel: () => void;
  t: (key: string) => string;
}

export const EditOfferForm: React.FC<EditOfferFormProps> = ({ offer, onSubmit, onCancel, t }) => {

  const onChangeCalendar: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
  };

  const { TextArea } = Input;

  const onChangeDesc = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    console.log("Change:", e.target.value);
  };
  
  return (
    <Form
      initialValues={{
        title: offer.title,
        description: offer.description,
        expirationDate: dayjs(offer.expirationDate),
        tag: offer.tag,
      }}
      onFinish={onSubmit}
    >
<Form.Item
        name="offer_title"
        label={t("offer_title")}
        rules={[{ required: true, message: t("Please enter the name") }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="offer_desc"
        label={t("offer_desc")}
        rules={[{ required: true, message: t("Please enter the details") }]}
      >
        <TextArea
          showCount
          maxLength={100}
          onChange={onChangeDesc}
          placeholder=""
          style={{ height: 120, resize: "none" }}
        />
      </Form.Item>

      <Form.Item
        name="expiration_date"
        label={t("expiration_date")}
        rules={[{ required: true, message: t("Please enter the date") }]}
      >
        <DatePicker
          format="YYYY-MM-DD"
          onChange={onChangeCalendar}
          placeholder=""
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item
        name="offer_tag"
        label={t("Tag")}
        rules={[{ required: true, message: t("Please enter or select a tag") }]}
      >
        <Input placeholder={t("Enter a tag")} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {t("publish_button")}
        </Button>
        <Button
          type="default"
          onClick={onCancel}
          style={{ marginLeft: "8px" }}
        >
          {t("cancel_button")}
        </Button>
      </Form.Item>
    </Form>
  );
};
