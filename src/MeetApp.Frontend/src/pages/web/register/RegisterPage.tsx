import { isDesktop } from "react-device-detect";
if (isDesktop) import("./RegisterPage.css");

import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Checkbox,
  CheckboxProps,
  message,
  Select,
} from "antd";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../configs/GeneralApiType";
import { get } from "http";
import { useTranslation } from "react-i18next";

const { Title } = Typography;

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  userType: string;
  city: string;
  profilePicture: string;
  bussinesName: string;
  bussinesAddress: string;
  bussinesCategory: string;
  cif: string;
  googleMapsUrl: string;
}

const getBusinessTypes = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/bussines-type`);
    if (response.ok) {
      const data: string[] = await response.json();
      console.log(data);
      const transformedData = data.map((item: string) => ({
        value: item,
        label: item,
      }));
      return transformedData;
    }
  } catch (error) {
    console.error("Error:", error);
  }
  return [];
};

const onChange = (value: string) => {
  console.log(`selected ${value}`);
};

const onSearch = (value: string) => {
  console.log("search:", value);
};

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm<RegisterForm>();
  const [isCompany, setIsCompany] = useState(false);
  const url = `${BASE_URL}/api/v1/users/registration`;
  const { t } = useTranslation("registerpage");

  const handleSubmit = async (values: RegisterForm) => {
    try {
      values.userType = isCompany ? "Bussines" : "Student";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success("Registro exitoso!");
        navigate("/login");
      } else if (response.status === 400) {
        const errorData = await response.json();
        message.error(
          `Error 400: ${
            errorData.message || "Solicitud inválida, cosa de camps."
          }`
        );
      } else {
        message.error("Error en el servidor");
      }
    } catch (error) {
      message.error("Error en el registro");
      console.error("Error:", error);
    }
  };

  const onCheckboxChange: CheckboxProps["onChange"] = (e) => {
    setIsCompany(e.target.checked);
  };

  const validateNoWhitespace = (_: any, value: string) => {
    if (!value || value.trim() === "") {
      return Promise.reject(new Error());
    }
    return Promise.resolve();
  };

  const onChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const onSearch = (value: string) => {
    console.log("search:", value);
  };

  return (
    <div className="register-container">
      <Title level={2}>Registro</Title>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          label={t("name")}
          name="name"
          rules={[
            { required: true, message: "Por favor ingrese su nombre!" },
            { validator: validateNoWhitespace },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={t("email")}
          name="email"
          rules={[
            { required: true, message: "Por favor ingrese su email!" },
            { type: "email", message: "Email no válido!" },
            { validator: validateNoWhitespace },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t("password")}
          name="password"
          rules={[
            { required: true, message: "Por favor ingrese su contraseña!" },
            { validator: validateNoWhitespace },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label={t("city")}
          name="city"
          rules={[
            { required: true, message: "Por favor ingrese su ciudad!" },
            { validator: validateNoWhitespace },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={t("profile_picture")}
          name="profilePicture"
          rules={[
            {
              required: true,
              message: "Por favor ingrese la URL de su foto de perfil!",
            },
          ]}
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
              rules={[
                {
                  required: isCompany,
                  message: "Por favor ingrese el nombre de la empresa!",
                },
                // { validator: validateNoWhitespace },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Dirección de la Empresa"
              name="bussinesAddress"
              rules={[
                {
                  required: isCompany,
                  message: "Por favor ingrese la dirección de la empresa!",
                },
                // { validator: validateNoWhitespace },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Categoría de la Empresa"
              name="bussinesCategory"
              rules={[
                {
                  required: isCompany,
                  message: "Por favor ingrese la categoría de la empresa!",
                },
              ]}
            >
              <Select
                showSearch
                optionFilterProp="label"
                onChange={onChange}
                onSearch={onSearch}
                options={[
                  { value: "Undefined", label: "" },
                  {
                    value: "FoodAndDrink",
                    label: "Restaurante",
                  },
                  {
                    value: "Cinema",
                    label: "Cine",
                  },
                ]}
              />
            </Form.Item>

            <Form.Item
              label="CIF de la Empresa"
              name="cif"
              rules={[
                {
                  required: isCompany,
                  message: "Por favor ingrese el CIF de la empresa!",
                },
                { validator: validateNoWhitespace },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="URL de Google Maps"
              name="googleMapsUrl"
              rules={[
                {
                  required: isCompany,
                  message: "Por favor ingrese la URL de Google Maps!",
                },
                { validator: validateNoWhitespace },
              ]}
            >
              <Input />
            </Form.Item>
          </>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            {t("register_button")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
