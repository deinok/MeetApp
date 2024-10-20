import React from "react";
import { Layout, Divider, Card, Steps } from "antd";
import "./MainPageStyles.css";
import { useAuthUser } from "react-auth-kit";
import { useTranslation } from "react-i18next";

const { Content } = Layout;
const { Step } = Steps;

const MainPage: React.FC = () => {
  const { t } = useTranslation("mainpage");
  const user = useAuthUser()()?.user;
  return (
    <>
      <Divider>
        <h1>{t("title", { name: user?.bussinesName })}</h1>
      </Divider>
      <Card
        className="steps-card"
        title="Steps to Get Started"
        bordered={false}
      >
        <Steps direction="vertical" current={1}>
          <Step title="Step 1" description="This is the first step." />
          <Step title="Step 2" description="This is the second step." />
          <Step title="Step 3" description="This is the final step." />
        </Steps>
      </Card>
    </>
  );
};

export default MainPage;
