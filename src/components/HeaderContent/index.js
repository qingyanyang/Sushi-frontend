import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal } from 'antd';
import { ExclamationCircleFilled, FieldTimeOutlined } from '@ant-design/icons';
import './index.css'
import { formateDate } from '../../utils/dateUtils'
import storageUtils from '../../utils/storageUtils'
import LinkButton from '../../components/LinkButton'

export default function Index() {
  const [date, setDate] = useState({
    currentTime: formateDate(Date.now())
  });
  const navigate = useNavigate()

  const logOut = () => {
    Modal.confirm({
      title: 'Are you sure you want to log out?',
      icon: <ExclamationCircleFilled />,
      content: '',
      width: '280px',

      onOk() {
        storageUtils.deleteUser()
        navigate('/', { replace: true })
      }
    })
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDate({
        currentTime: formateDate(Date.now())
      });
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className='header'>
      <div className='header-top'>
        <span className='wel'>{storageUtils.getUser().username}</span>
        <LinkButton
          style={{ marginRight: '.7%' }}
          onClick={logOut}>Logout</LinkButton>
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
    </div>
  )
}
