import React, { useEffect, useRef } from 'react';
import { Select, Form, Input } from 'antd';

export default function CategoryForm({ categorys, parentId, getForm }) {

  const [form] = Form.useForm();
  const formRef = useRef(form);

  categorys = categorys || {};
  parentId = parentId || '0';

  useEffect(() => {
    form.setFieldsValue({ select: parentId });
    getForm(formRef.current);
  }, [getForm, form, parentId]);

  return (
    <Form form={form} initialValues={{ select: parentId }}>
      <Form.Item name="select">
        <Select
          style={{
            margin: '20px 0',
            width: '100%',
          }}
        >
          <Select.Option value='0'>category</Select.Option>
          {
            categorys.map(c =>
              <Select.Option key={c._id} value={c._id} >{c.name}</Select.Option>
            )
          }
        </Select>
      </Form.Item>

      <Form.Item
        name="input"
        style={{ margin: '0' }}
        rules={[
          { required: true, message: 'cannot be blank!' },
          { max: 20, message: 'cannot exceed 20 characters!' }
        ]}
        trigger="onChange"
      >
        <Input
          maxLength={20}
          style={{ marginBottom: '20px' }}
          placeholder="Please enter category name"
        />
      </Form.Item>
    </Form>
  );
}
