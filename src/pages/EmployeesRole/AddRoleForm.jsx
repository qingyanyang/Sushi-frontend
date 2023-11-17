import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Form from 'antd/es/form';
import Input from 'antd/es/input';

AddRoleForm.protoTypes = {
  getFormValue: PropTypes.func.isRequired
}

export default function AddRoleForm({ getForm, role }) {

  const [form] = Form.useForm();
  const formRef = useRef(form);

  role = role || {}

  useEffect(() => {
    getForm(formRef.current);
  }, [getForm]);

  return (
    <Form form={form}>
      <Form.Item
        name="name"
        style={{ margin: '0' }}
        rules={[
          { required: true, message: 'cannot be empty!' },
          { max: 20, message: 'cannot over 20 characters!' }
        ]}
        trigger="onChange"
      >
        <Input
          maxLength={20}
          style={{ margin: '20px 0', width: '470px' }}
          placeholder={Object.keys(role).length > 0 ? role.name : 'Please enter role name'}
        />
      </Form.Item>
      <Form.Item
        name="rate"
        style={{ margin: '0' }}
        rules={[
          { required: true, message: 'cannot be empty!' },
          { max: 20, message: 'cannot over 20 characters!' }
        ]}
        trigger="onChange"
      >
        <Input
          maxLength={20}
          style={{ margin: '20px 0', width: '470px' }}
          placeholder={Object.keys(role).length > 0 ? role.rate : 'please enter the rate'}
        />
      </Form.Item>
    </Form>
  );
}
