import React from "react";
import { Layout, Divider, Card, Steps } from "antd";
import "./MobileMainPageStyles.css";
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
      <div className="main-content">
        <Card
          className="steps-card"
          title="Steps to Get Started"
          bordered={false}
        >
          <Steps direction="vertical" current={5}>
            <Step
              title="Step 1"
              description="BackEnd & FrontEnd Architecture"
            />
            <Step title="Step 2" description="DB implementation" />
            <Step title="Step 3" description="BackEnd Implementation" />
            <Step title="Step 4" description="FrontEnd Implementation" />
            <Step title="Step 5" description="Connecting BackEnd & FrontEnd" />
            <Step title="Step 6" description="Getting ready presentation" />
            <Step title="Step 7" description="Future implementations" />
          </Steps>
        </Card>
      </div>
    </>
  );
};

export default MainPage;