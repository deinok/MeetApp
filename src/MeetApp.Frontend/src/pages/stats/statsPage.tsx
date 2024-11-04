import { Divider } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const StatsPage: React.FC = () => {
  const { t } = useTranslation("statspage");

  const data = [
    { month: t("january"), users: 30 },
    { month: t("february"), users: 40 },
    { month: t("march"), users: 35 },
    { month: t("april"), users: 50 },
    { month: t("may"), users: 49 },
    { month: t("june"), users: 60 },
    { month: t("july"), users: 70 },
    { month: t("august"), users: 90 },
    { month: t("september"), users: 130 },
    { month: t("october"), users: 150 },
    { month: t("november"), users: 170 },
    { month: t("december"), users: 200 },
  ];

  return (
    <>
      <Divider>
        <h1>{t("title")}</h1>
      </Divider>
      <div style={{width: "100%", height: "50vh"}}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 0,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="users"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
            name={t("users")}
          />
        </LineChart>
      </ResponsiveContainer>
      </div>
    </>
  );
};

export default StatsPage;
