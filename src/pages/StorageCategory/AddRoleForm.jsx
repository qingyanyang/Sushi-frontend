import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

// Lazy load Ant Design components
import Input from 'antd/es/input';
import Form from 'antd/es/form';

AddRoleForm.protoTypes = {
  getForm: PropTypes.func.isRequired
}

export default function AddRoleForm({ getForm, category }) {
  const [form] = Form.useForm();
  const formRef = useRef(form);
  category = category || {}
  console.log('get from father', category)

  useEffect(() => {
    getForm(formRef.current);
  }, [getForm]);

  return (
    <Form form={form}>
      <Form.Item
        name="input"
        style={{ margin: '0' }}
        rules={[
          { required: true, message: 'Cannot be empty!' },
          { max: 20, message: 'cannot exceed 20 characters!' }
        ]}
        trigger="onChange"
      >
        <Input
          maxLength={20}
          style={{ margin: '20px 0', width: '470px' }}
          placeholder={Object.keys(category).length > 0 ? category.name : 'Please enter category name'}
        />
      </Form.Item>
    </Form>
  );
}
