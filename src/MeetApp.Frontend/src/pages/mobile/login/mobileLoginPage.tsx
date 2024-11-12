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
import "./mobileLoginPageStyles.css";
import React, { useState } from "react";
import { Button, Form, Input, Toast } from "antd-mobile";
import LogoLogin from "../../../img/logoWithWhiteLetters.png";
import { useTranslation } from "react-i18next";
import { useSignIn } from "react-auth-kit";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../configs/GeneralApiType";

const LoginPage = () => {
  const signIn = useSignIn();
  const navigate = useNavigate();
  const url = `${BASE_URL}/api/v1/users/token`;
  const { t } = useTranslation("loginpage");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Función para manejar el envío del formulario
  // const handleSubmit = (values: any) => {
  //   const { email, password } = values;
  //   if (email && password) {
  //     // Simulación de autenticación
  //     Toast.show({ icon: "success", content: "Inicio de sesión exitoso" });
  //   } else {
  //     Toast.show({
  //       icon: "fail",
  //       content: "Por favor, completa todos los campos",
  //     });
  //   }
  // };

  const handleSubmit = async () => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "password",
          username: username,
          password: password,
        }).toString(),
      });

      const data = await response.json();

      if (response.ok && data.access_token) {
        signIn({
          token: data.access_token,
          expiresIn: data.expires_inm || 6000,
          tokenType: data.token_type,
          authState: { user: data.user },
        });
        Toast.show({ icon: "success", content: t("login_success") });
        navigate("/");
      } else {
        throw new Error(data.error_description || t("invalid_credentials"));
      }
    } catch (error) {
      Toast.show({
        icon: "fail",
        content: (error as Error).message || t("login_error"),
      });
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
        onFinish={handleSubmit}
        footer={
          <Button block type="submit" color="primary" size="large">
            {t("login_button")}
          </Button>
        }
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Por favor, ingresa tu correo" }]}
        >
          <Input
            placeholder="Correo electrónico"
            type="email"
            name="username"
            onChange={(value) => {
              setUsername(value);
            }}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            { required: true, message: "Por favor, ingresa tu contraseña" },
          ]}
        >
          <Input
            placeholder="Contraseña"
            type="password"
            name="password"
            onChange={(value) => {
              setPassword(value);
            }}
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
