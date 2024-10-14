import './MainLayoutStyles.css';
import React, { useState } from 'react';
import { Layout, Menu, Button, Dropdown, Switch } from 'antd';
import { useSignOut } from 'react-auth-kit';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; 
import i18n from '../i18n';

const { Header, Content } = Layout;

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

  const menu = (
    <Menu>
      <Menu.Item key="profile">
        <Button type="link" href="/profile">
          {t('profile')} 
        </Button>
      </Menu.Item>
      <Menu.Item key="language">
        <span>{t('language')}: </span>
        <Switch
          checked={language === 'en'}
          onChange={handleLanguageChange}
          checkedChildren="EN"
          unCheckedChildren="ES"
        />
      </Menu.Item>
      <Menu.Item key="logout">
        <Button type="link" onClick={handleLogout}>
          {t('logout')} 
        </Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout>
      <Header className="app-header">
        <div className="logoHome" />
        <Menu theme="dark" mode="horizontal">
          <Dropdown overlay={menu} trigger={['click']}>
            <Button type="primary">{t('menu')}</Button> 
          </Dropdown>
        </Menu>
      </Header>
      <Layout>
        <Content className="app-content">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
