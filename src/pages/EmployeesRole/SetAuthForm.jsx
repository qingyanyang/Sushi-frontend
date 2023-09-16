import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Input, Form, Tree } from 'antd';
import menuList from '../../config/menuConfig'

SetAuthForm.protoTypes = {
  getFormValue: PropTypes.func.isRequired
}

export default function SetAuthForm({ getCheck, role, resetFormKey }) {
  const [form] = Form.useForm()
  const [checkedKeys, setCheckedKeys] = useState(role.menus || []);

  useEffect(() => {
    if (role && role.menus) {
      form.resetFields();
      setCheckedKeys(role.menus);
    }
  }, [resetFormKey, role]);

  //get tree list
  const convertToTreeData = (menuList) => {
    return menuList.map((menuItem) => {
      const { label, key, children } = menuItem;

      const treeNode = {
        title: label,
        key: key,
      };

      if (children) {
        treeNode.children = convertToTreeData(children);
      }

      return treeNode;
    });
  };

  const root = {
    title: "Authority",
    key: "0-0",
  };

  root.children = convertToTreeData(menuList);
  const treeData = [root];

  const onCheck = (checkedKeys) => {
    getCheck(checkedKeys)
    setCheckedKeys(checkedKeys)
  };

  return (
    <Form form={form}>
      <Form.Item
        name="input"
        label='role name'
        style={{ margin: '20px' }}
        rules={[
          { required: true, message: 'cannot be empty!' },
          { max: 20, message: 'name cannot exceed 20 charactors!' }
        ]}
        trigger="onChange"
      >
        <Input
          maxLength={20}
          placeholder={role.name}
          disabled
        />
      </Form.Item>
      <Form.Item
        style={{ margin: '20px' }}
      >
        {checkedKeys.length > 0 && <Tree
          checkable
          defaultExpandAll={true}
          checkedKeys={checkedKeys}
          onCheck={onCheck}
          treeData={treeData}
        />}
      </Form.Item>
    </Form>
  );
}

