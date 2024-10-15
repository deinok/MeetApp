import "./RegisterPage.css";
import React, { useState } from 'react';
import { Form, Input, Button, Typography, Checkbox, CheckboxProps, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

interface RegisterForm {
  email: string;
  password: string;
  userType: 0;
  city: string;
  profilePicture: string;
  bussinesName: string;
  bussinesAddress: string;
  bussinesCategory: 0;
  cif: string;
  googleMapsUrl: string;
}

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<RegisterForm>();
  const [isCompany, setIsCompany] = useState(false);
  const url = "http://localhost:5000/api/v1/users/registration";

  const handleSubmit = async (values: RegisterForm) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      
      if (!response.ok) {
        throw new Error('Error en el registro');
      }

      const data = await response.json();
      message.success('Registro exitoso!');
      console.log('Success:', data);
      navigate('/login'); 
    } catch (error) {
      message.error('Error en el registro, por favor intente de nuevo.');
      console.error('Error:', error);
    } 
  };

  const onCheckboxChange: CheckboxProps['onChange'] = (e) => {
    setIsCompany(e.target.checked);
  };

  return (
    <div className="register-container">
      <Title level={2}>Registro</Title>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Por favor ingrese su email!' },
            { type: 'email', message: 'Email no válido!' },
          ]}
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

        <Form.Item
          label="Ciudad"
          name="city"
          rules={[{ required: true, message: 'Por favor ingrese su ciudad!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Foto de Perfil (URL)"
          name="profilePicture"
          rules={[{ required: true, message: 'Por favor ingrese la URL de su foto de perfil!' }]}
        >
          <Input />
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
              name="bussinesName"
              rules={[{ required: true, message: 'Por favor ingrese el nombre de la empresa!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Dirección de la Empresa"
              name="bussinesAddress"
              rules={[{ required: true, message: 'Por favor ingrese la dirección de la empresa!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Categoría de la Empresa"
              name="bussinesCategory"
              rules={[{ required: true, message: 'Por favor ingrese la categoría de la empresa!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="CIF de la Empresa"
              name="cif"
              rules={[{ required: true, message: 'Por favor ingrese el CIF de la empresa!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="URL de Google Maps"
              name="googleMapsUrl"
              rules={[{ required: true, message: 'Por favor ingrese la URL de Google Maps!' }]}
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
