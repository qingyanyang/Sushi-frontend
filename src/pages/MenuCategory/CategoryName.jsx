import React, { useEffect, useRef } from 'react';
import { Form, Input } from 'antd';


export default function CategoryName({ getForm, selectCategory }) {
  const [form] = Form.useForm();
  const formRef = useRef(form);

  selectCategory = selectCategory||{}

  useEffect(() => {
    getForm(formRef.current);
  }, [getForm]);

  return (
    <Form form = { form }>
      <Form.Item
        name="input"
        style={{ margin: '0' }}
        rules={[
          { required: true, message: '不能为空!' },
          { max: 20, message: '名称不能超过 20 个字符!' }
        ]}
        trigger="onChange"
      >
        <Input
    
          maxLength={20}
          style={{ margin: '20px 0' }}
          placeholder={selectCategory}
        />
      </Form.Item>
    </Form>
  );
}
