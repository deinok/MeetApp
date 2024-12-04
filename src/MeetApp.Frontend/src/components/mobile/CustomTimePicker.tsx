import { Picker, Button, Space, PickerRef } from "antd-mobile";
import dayjs from "dayjs";
import { use } from "i18next";
import React, { useEffect, useState } from "react";

interface TimePickerProps {
  visible: boolean;
  setVisibleHandler: (visible: boolean) => void;
  onChange: (value: string) => void;
  defaultValue?: string;
}

const CustomTimePicker: React.FC<TimePickerProps> = ({
  visible,
  setVisibleHandler,
  onChange,
  defaultValue,
}) => {
  const [selectedTime, setSelectedTime] = useState<string | null>(defaultValue ?? null);

  // Generate options for hours and minutes
  const hours = Array.from({ length: 24 }, (_, i) => ({
    label: i.toString().padStart(2, "0"),
    value: i.toString().padStart(2, "0"),
  }));
  const minutes = Array.from({ length: 60 }, (_, i) => ({
    label: i.toString().padStart(2, "0"),
    value: i.toString().padStart(2, "0"),
  }));

  const columns = [hours, minutes];

  useEffect(() => {
    if (selectedTime) {
      onChange(selectedTime);
    }
  }, [selectedTime, onChange]);

  return (
    <Space direction="vertical" block>
      {/* Custom Picker */}
      <Picker
        columns={columns}
        visible={visible}
        onClose={() => setVisibleHandler(false)}
        onConfirm={(values) => {
          setSelectedTime(`${values[0]}:${values[1]}`);
          setVisibleHandler(false);
        }}
        confirmText="OK"
        cancelText="Cancel"
        title="Select Date"
        mouseWheel={true}
        value={selectedTime ? selectedTime.split(":") : undefined}
      ></Picker>
    </Space>
  );
};

export default CustomTimePicker;
