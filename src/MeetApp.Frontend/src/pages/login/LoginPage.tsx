import "./loginStyles.css";
import React, { useState } from 'react';
import { useSignIn } from 'react-auth-kit';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography } from 'antd';

const { Title } = Typography;

export const LoginPage = () => {
  const signIn = useSignIn();
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (values: { username: string; password: string }) => {
    const response = await fakeAuthAPI(values);

    if (response.success) {
      signIn({
        token: response.token ?? "",
        expiresIn: 3600,
        tokenType: "Bearer",
        authState: { user: response.user },
      });
      navigate('/');
    } else {
      alert('Credenciales inválidas');
    }
  };

  return (
    <div className="login-container">
      <Title level={2}>Iniciar Sesión</Title>
      <Form onFinish={handleSubmit} layout="vertical">
        <Form.Item
          label="Usuario"
          name="username"
          rules={[{ required: true, message: 'Por favor ingrese su usuario!' }]}
        >
          <Input name="username" onChange={handleChange} />
        </Form.Item>
        <Form.Item
          label="Contraseña"
          name="password"
          rules={[{ required: true, message: 'Por favor ingrese su contraseña!' }]}
        >
          <Input.Password name="password" onChange={handleChange} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Entrar
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="link" onClick={() => navigate('/register')} block>
            ¿No tienes una cuenta? Regístrate aquí
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

const fakeAuthAPI = async ({ username, password }: { username: string; password: string }) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (username === 'usuario' && password === 'contraseña') {
    return {
      success: true,
      token: 'token-de-ejemplo',
      user: { name: 'Usuario Ejemplo', email: ''},
    };
  } else {
    return { success: false };
  }
};
