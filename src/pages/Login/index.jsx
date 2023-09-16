import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { reqLogin } from '../../api'
import storageUtils from '../../utils/storageUtils'
import memoryUtils from '../../utils/memoryUtils'
import './Login.css'

export default function Login() {

  const navigate = useNavigate();
  //get user value
  const user = storageUtils.getUser()

  //get form value
  const onFinish = async (values) => {
    const { username, password } = values
    //send request and get response
    const response = await reqLogin(username, password)
    const result = response.data

    if (result.status === 0) {
      message.success('welcome~ ' + result.data.username)
      //save user
      const user = result.data
      memoryUtils.user = user
      storageUtils.saveUser(user)
      //navigate to layout if login successfully, replace = true, can back to login page
      navigate('/layout', { replace: true })
    } else {
      message.error("wrong login name or password!")
    }
  };
  // if user has been loged in goto layout automatically
  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      navigate('/layout', { replace: true })
    }
  }, [user, navigate])

  return (
    <div className="login">
      <div className="loginHeader"></div>
      <div className="loginContent">
        <div className='logo'></div>
        <Form
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your Username!',
              },
              {
                pattern: /^[a-zA-Z0-9_]+$/,
                message: "Must to be letter, number, underline"
              },
              {
                min: 5,
                max: 12,
                message: "Must greater than 4 and less than 12"
              }
            ]}
          >
            <Input
              style={{ height: '38px', width: '382px', marginLeft: '-13px' }}
              prefix={<UserOutlined className="site-form-item-icon" style={{ fontSize: '18px', marginRight: '6px' }} />}
              placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please enter your Password!',
              },
            ]}
          >
            <Input
              style={{ height: '38px', width: '382px', marginLeft: '-13px' }}
              prefix={<LockOutlined className="site-form-item-icon" style={{ fontSize: '18px', marginRight: '6px' }} />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
