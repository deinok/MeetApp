import "./RegisterPage.css";

import React, { useState } from 'react';
import { Form, Input, Button, Typography, Checkbox, CheckboxProps } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

interface RegisterForm {
  fullName?: string;
  email?: string;
  password?: string;
  companyName?: string; 
  companyNIF?: string;
  companyLocation?: string;
}

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<RegisterForm>();
  const [isCompany, setIsCompany] = useState(false);
  const handleSubmit = async (values: RegisterForm) => {
    // Crida API
    console.log('Datos de registro:', values);
    navigate('/login');
  };

  const onCheckboxChange: CheckboxProps['onChange'] = (e) => {
    setIsCompany(e.target.checked);
  };

  return (
    <div className="register-container">
      <Title level={2}>Registro</Title>
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
      >
        <Form.Item
          label="Nombre Completo"
          name="fullName"
          rules={[{ required: true, message: 'Por favor ingrese su nombre completo!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Por favor ingrese su email!' }, { type: 'email', message: 'Email no válido!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Contraseña"
          name="password"
          rules={[{ required: true, message: 'Por favor ingrese su contraseña!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Checkbox checked={isCompany} onChange={onCheckboxChange}>
            Soy una empresa
          </Checkbox>
        </Form.Item>

        {isCompany && (
          <>
            <Form.Item
              label="Nombre de la Empresa"
              name="companyName"
              rules={[{ required: true, message: 'Por favor ingrese el nombre de la empresa!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="NIF de la Empresa"
              name="companyNIF"
              rules={[{ required: true, message: 'Por favor ingrese el NIF de la empresa!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Ubicación de la Empresa"
              name="companyLocation"
              rules={[{ required: true, message: 'Por favor ingrese la ubicación de la empresa!' }]}
            >
              <Input />
            </Form.Item>
          </>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Registrarse
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
