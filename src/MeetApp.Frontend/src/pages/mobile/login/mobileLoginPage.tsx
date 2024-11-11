// import React from "react";
// import { Layout, Divider, Card, Steps } from "antd";
// import "./MobileLoginPageStyles.css";
// import { useAuthUser } from "react-auth-kit";
// import { useTranslation } from "react-i18next";

// const { Content } = Layout;
// const { Step } = Steps;

// const LoginPage: React.FC = () => {
//   const { t } = useTranslation("mainpage");
//   const user = useAuthUser()()?.user;
//   return (
//     <>
//       <Divider>
//         <h1>{t("title", { name: user?.bussinesName })}</h1>
//       </Divider>
//       <div className="main-content">
//         <Card
//           className="steps-card"
//           title="Steps to Get Started"
//           bordered={false}
//         >
//           <Steps direction="vertical" current={5}>
//             <Step
//               title="Step 1"
//               description="BackEnd & FrontEnd Architecture"
//             />
//             <Step title="Step 2" description="DB implementation" />
//             <Step title="Step 3" description="BackEnd Implementation" />
//             <Step title="Step 4" description="FrontEnd Implementation" />
//             <Step title="Step 5" description="Connecting BackEnd & FrontEnd" />
//             <Step title="Step 6" description="Getting ready presentation" />
//             <Step title="Step 7" description="Future implementations" />
//           </Steps>
//         </Card>
//       </div>
//     </>
//   );
// };

// export default LoginPage;


// src/LoginPage.jsx
import React from 'react';
import { Button, Form, Input, Toast } from 'antd-mobile';
import LogoLogin from "../../../img/logoWithWhiteLetters.png";
import './mobileLoginPageStyles.css';

const LoginPage = () => {
  // Función para manejar el envío del formulario
  const onFinish = (values: any) => {
    const { email, password } = values;
    if (email && password) {
      // Simulación de autenticación
      Toast.show({ icon: 'success', content: 'Inicio de sesión exitoso' });
    } else {
      Toast.show({ icon: 'fail', content: 'Por favor, completa todos los campos' });
    }
  };

  return (
    <div className="login-container">
      {/* Logo en la parte superior */}
      <div className="logo">
        <img src={LogoLogin} alt="Logo" />
      </div>
      <h2>Iniciar sesión</h2>

      <Form
        layout="horizontal"
        mode="card"
        onFinish={onFinish}
        footer={
          <Button block type="submit" color="primary" size="large">
            Entrar
          </Button>
        }
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Por favor, ingresa tu correo' }]}
        >
          <Input placeholder="Correo electrónico" type="email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Por favor, ingresa tu contraseña' }]}
        >
          <Input placeholder="Contraseña" type="password" />
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
