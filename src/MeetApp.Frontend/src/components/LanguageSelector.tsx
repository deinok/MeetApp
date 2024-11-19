import { RadioChangeEvent, Radio } from "antd";
import React, { useState, useEffect } from "react";
import ReactCountryFlag from "react-country-flag";
import { useTranslation } from "react-i18next";
import { initialLanguage } from "../i18n";

export const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(initialLanguage);

  const handleLanguageChange = (e: RadioChangeEvent) => {
    window.location.reload();
    const lang = e.target.value;
    setLanguage(lang);
    localStorage.setItem("language", lang);
    i18n.changeLanguage(lang);
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      setLanguage(savedLanguage);
      i18n.changeLanguage(savedLanguage);
    }
  }, []);

  return (
    <Radio.Group value={language} onChange={handleLanguageChange}>
      <Radio.Button value="es">
        <ReactCountryFlag countryCode="ES" svg />
      </Radio.Button>
      <Radio.Button value="en">
        <ReactCountryFlag countryCode="US" svg />
      </Radio.Button>
      <Radio.Button value="bs">
        <ReactCountryFlag countryCode="BA" svg />
      </Radio.Button>
    </Radio.Group>
  );
}