import React, { useEffect, useState } from 'react';
import { Button, Card, Input, Modal, Form, Input as AntdInput } from 'antd';
import { useAuthUser } from 'react-auth-kit';
import activitiesData from '../../json/ActivitatsEmpreses.json';
import { useTranslation } from 'react-i18next'; 

interface Activity {
  id: number;
  name: string;
  details: string;
  date: string;
  location: string;
}

export const MainPage = () => {
  const { t } = useTranslation('mainpage'); 
  const auth = useAuthUser();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setActivities(activitiesData);
    setFilteredActivities(activitiesData);
  }, []);

  useEffect(() => {
    const filtered = activities.filter(activity =>
      activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.date.includes(searchTerm)
    );
    setFilteredActivities(filtered);
  }, [searchTerm, activities]);

  const handleSubmit = (values: any) => {
    console.log('Received values from form: ', values);
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const popoverContent = (
    <Form onFinish={handleSubmit} layout="vertical">
      <Form.Item name="name" label={t('name')} rules={[{ required: true, message: t('Please enter the name') }]}>
        <AntdInput />
      </Form.Item>
      <Form.Item name="details" label={t('details')} rules={[{ required: true, message: t('Please enter the details') }]}>
        <AntdInput />
      </Form.Item>
      <Form.Item name="date" label={t('date')} rules={[{ required: true, message: t('Please enter the date') }]}>
        <AntdInput />
      </Form.Item>
      <Form.Item name="location" label={t('location')} rules={[{ required: true, message: t('Please enter the location') }]}>
        <AntdInput />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">{t('send')}</Button>
        <Button type="default" onClick={handleCancel} style={{ marginLeft: '8px' }}>{t('cancel')}</Button>
      </Form.Item>
    </Form>
  );

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ position: 'fixed', top: '100px', left: "100px", zIndex: 10 }}>
        <h1>{t('welcome_message', { name: auth()?.user?.name || '' })}</h1>
        <Input
          placeholder="Buscar por título o fecha"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ margin: '20px 0', width: '300px', minWidth: '300px' }} 
        />
        <Button type="primary" onClick={() => setVisible(true)} style={{ marginLeft: "650px" }}>
          Agregar Actividad
        </Button>
      </div>

      <Modal
        title={t('add_activity')}
        onCancel={handleCancel}
        footer={null}
        centered
        open={visible}
        style={{ width: '500px' }}
        maskClosable={false}
      >
        {popoverContent}
      </Modal>

      <div style={{ marginTop: '140px', display: 'flex', flexWrap: 'wrap', gap: '16px', minHeight: '400px' }}>
        {filteredActivities.length > 0 ? (
          filteredActivities.map(activity => (
            <Card
              key={activity.id}
              style={{ width: 300 }}
              cover={<img alt={activity.name} src="https://via.placeholder.com/300" />}
            >
              <Card.Meta title={activity.name} description={activity.details} />
              <p> Fecha: {activity.date}</p>
              <p> Ubicación: {activity.location }</p>
            </Card>
          ))
        ) : (
          <p>No se encontraron resultados.</p>
        )}
      </div>
    </div>
  );
};