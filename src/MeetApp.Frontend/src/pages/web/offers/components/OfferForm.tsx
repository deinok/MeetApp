import React, { useEffect } from "react";
import { Form, Input, Button, DatePicker, message } from "antd";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import type { DatePickerProps } from "antd";
import { useAuthUser } from "react-auth-kit";
import { BASE_URL } from "../../../../configs/GeneralApiType";

interface OfferFormProps {
  offer?: Offer;
  onSubmit: (values: any) => void;
  onClose: () => void;
}

interface Offer {
  id: string;
  bussinesId: string;
  title: string;
  description: string;
  expirationDate: string;
  tag: string;
}

export const OfferForm: React.FC<OfferFormProps> = ({
  offer,
  onSubmit,
  onClose,
}) => {
  const { t } = useTranslation("offerspage");

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
    //   initialValues={{
    //     offer_title: offer?.title,
    //     offer_desc: offer?.description,
    //     expiration_date: dayjs(offer?.expirationDate),
    //     offer_tag: offer?.tag,
    //   }}
      onFinish={onSubmit}
      layout="vertical"
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
          format={t("date_format")}
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
        <Input />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          {t("publish_button")}
        </Button>
        <Button type="default" onClick={onClose} style={{ marginLeft: "8px" }}>
          {t("cancel_button")}
        </Button>
      </Form.Item>
    </Form>
  );
};
