import './MainLayoutStyles.css';
import LogoLogin from '../img/logoWithWhiteLetters.png';
import React, { useState } from 'react';
import { Layout, Dropdown, Avatar, Divider, Space, Switch } from 'antd';
import { useSignOut } from 'react-auth-kit';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

const { Header, Content, Footer } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { t } = useTranslation('layout');
  const signOut = useSignOut();
  const navigate = useNavigate();
  const [language, setLanguage] = useState('es');

  const handleLogout = () => {
    signOut();
    navigate('/login');
  };

  const handleLanguageChange = (checked: boolean) => {
    const newLang = checked ? 'en' : 'es';
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };
  const handleLogoClick = () => {
    navigate('/');
  };

  const items = [
    {
      key: 'profile',
      label: (
        <a href="/profile">
          {t('profile')}
        </a>
      ),
    },
    {
      key: 'language',
      label: (
        <div>
          <span>{t('language')}: </span>
          <Switch
            checked={language === 'en'}
            onChange={handleLanguageChange}
            checkedChildren="EN"
            unCheckedChildren="ES"
          />
        </div>
      ),
    },
    {
      key: 'logout',
      label: (
        <a onClick={handleLogout}>
          {t('logout')}
        </a>
      ),
    },
  ];

  return (
    <Layout className="layout-container">
      <Header className="app-header">
        <div className="header-left">
        <a onClick={handleLogoClick} className="logo-link">
          <img
            src={LogoLogin}
            alt="Logo"
            className="logo"
          />
          </a>
          <Divider type="vertical" className="custom-divider" />
          <div className="headers-links">
            <a href="/offers">OFFERS</a>
            <a href="/stats">STATS</a>
            </div>
        </div>
        <div className="header-right">
          <p className="email-text">usuario@ejemplo.com</p>
          <Divider type="vertical" className="custom-divider" />
          <Dropdown menu={{ items }} placement="bottomRight" arrow={{ pointAtCenter: true }}>
            <Avatar
              src="https://logos-world.net/wp-content/uploads/2020/04/McDonalds-Logo.png"
              size="large"
              style={{ cursor: 'pointer' }}
            />
          </Dropdown>
        </div>
      </Header>
      <Layout>
        <Content className="app-content">
          {children}
        </Content>
      </Layout>
      <Footer className="app-footer">
        <p>© 2024 MeetApp. Todos los derechos reservados.</p>
      </Footer>
    </Layout>
  );
};

export default AppLayout;
