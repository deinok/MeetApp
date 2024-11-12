import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const NoPermissionPage: React.FC = () => {
    const navigate = useNavigate();
    const handlerOnClick = () => {
        navigate('/login');
    }
    return (
        <Result
          status="403"
          title="403"
          subTitle="Sorry, you are not authorized to access this page."
          extra={<Button type="primary" onClick={handlerOnClick}>Ir al login</Button>}
        />
      );
}

export default NoPermissionPage;