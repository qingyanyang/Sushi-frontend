import React, { useState, useEffect, Suspense } from 'react';
import Modal from 'antd/es/modal';
import { ExclamationCircleFilled, FieldTimeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { formateDate } from '../../utils/dateUtils';
import storageUtils from '../../utils/storageUtils';
import LinkButton from '../../components/LinkButton';
import './index.css';


export default function Index() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [date, setDate] = useState({
    currentTime: formateDate(Date.now())
  });

  const navigate = useNavigate()

  const showConfirmModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    storageUtils.deleteUser();
    navigate('/', { replace: true });
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDate({
        currentTime: formateDate(Date.now())
      });
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
    <div className='header'>
      
      <div className='header-top'>
        <span className='wel'>{storageUtils.getUser().username}</span>
        <LinkButton
          style={{ marginRight: '.7%' }}
          onClick={showConfirmModal}>Logout</LinkButton>
      </div>
      <div className='header-bottom'>
        <span
          style={{
            marginRight: '.7%',
          }}
        >{date.currentTime} &nbsp;
          <FieldTimeOutlined />
        </span>
      </div>
      <Modal
        title="Are you sure you want to log out?"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        icon={<ExclamationCircleFilled />}
        width="350px"
      />
    </div>
    </Suspense>
  )
}
