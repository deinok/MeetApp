import { Picker, Button, Space, PickerRef, DatePicker } from "antd-mobile";
import dayjs from "dayjs";
import { use } from "i18next";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface DatePickerProps {
  visible: boolean;
  setVisibleHandler: (visible: boolean) => void;
  onChange: (value: string) => void;
  defaultValue?: string;
}


const CustomDatePicker: React.FC<DatePickerProps> = ({
  visible,
  setVisibleHandler,
  onChange,
  defaultValue,
}) => {
  const [selectedTime, setSelectedTime] = useState<string | null>(
    defaultValue ?? null
  );
  const {t} = useTranslation("global");

  useEffect(() => {
    if (selectedTime) {
      onChange(selectedTime);
    }
  }, [selectedTime, onChange]);

  return (
    <Space direction="vertical" block>
      {/* Custom Picker */}
      <DatePicker
        visible={visible}
        onClose={() => setVisibleHandler(false)}
        onConfirm={(value) => {
          setSelectedTime(dayjs(value).format("DD-MM-YYYY"));
          setVisibleHandler(false);
        }}
        confirmText={t("global:confirm")}
        cancelText={t("global:cancel")}
        title={t("global:date")}
        mouseWheel={true}
        value={dayjs(selectedTime, 'DD-MM-YYYY').toDate() ?? undefined}
      ></DatePicker>
    </Space>
  );
};

export default CustomDatePicker;
