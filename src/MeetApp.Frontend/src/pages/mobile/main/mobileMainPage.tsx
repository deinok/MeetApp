import { isMobile } from 'react-device-detect';
if (isMobile) import ("./mobileMainPageStyles.css");

import React from "react";
import { Layout, Divider, Card, Steps } from "antd";
import { useAuthUser } from "react-auth-kit";
import { useTranslation } from "react-i18next";
import { Swiper, Toast } from "antd-mobile";
import  empreses from "./empresesColab.json";


const MobileMainPage: React.FC = () => {
  const { t } = useTranslation("mainpage");
  const user = useAuthUser()()?.user;
  const empresesjson = empreses; 
  // #5942F4
  const items = empresesjson.map((empresa, index) => (
    <Swiper.Item key={index}>
      <div className="card">
        <Card title={empresa.name} style={{color: "white", backgroundColor: "#5942F4"}}>
          {empresa.description}
        </Card>
      </div>
    </Swiper.Item>
  ));
  return (
    <>
     <div>
        <h1>Hello, {user.email}</h1>
        <h3>Have a nice day</h3>
     </div>
    <div>
    <Swiper
          loop
          autoplay
        >
          {items}
        </Swiper>
    </div>
    <div>
      <h1>Progress</h1>
      <Steps current={1}>
        <Steps.Step title="Finished" description="This is a description." />
        <Steps.Step title="In Progress" description="This is a description." />
        <Steps.Step title="Waiting" description="This is a description." />
      </Steps>
    </div>
    </>
  );
};

export default MobileMainPage;