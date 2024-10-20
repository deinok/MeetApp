import "./loginStyles.css";
import LogoLogin from '../../img/logoWithWhiteLetters.png';
import React, { useState } from 'react';
import { useSignIn } from 'react-auth-kit';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Typography, message } from 'antd';

const { Title } = Typography;

export const LoginPage = () => {
  const signIn = useSignIn();
  const navigate = useNavigate();
  const url = "https://localhost:5001/api/v1/users/token";

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

  const handleSubmit = async () => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'password',
          username: credentials.username,
          password: credentials.password,
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

        message.success('Inicio de sesión exitoso!');
        navigate('/');
      } else {
        throw new Error(data.error_description || 'Credenciales inválidas');
      }
    } catch (error) {
      message.error((error as Error).message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="container">
      <div className="banner">
        <img alt="logo" className="logoLogin" src={LogoLogin} />
      </div>
      <div className="loginPagecontainer">
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
      </div>
    </div>
  );
};
