import { PlusOutlined, StopOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import React, { useState, useEffect, Suspense } from 'react'
import { formateDate } from '../../utils/dateUtils'
import { reqRoles, reqAddRole, reqUpdateRoleName, reqDeleteRole, reqUpdateRoleAuth } from '../../api'

import Card from 'antd/es/card';
import Table from 'antd/es/table';
import Button from 'antd/es/button';
import message from 'antd/es/message';
import Modal from 'antd/es/modal';

// Lazy load custom components as well
const LinkButton = React.lazy(() => import('../../components/LinkButton'));
const AddRoleForm = React.lazy(() => import('./AddRoleForm'));
const SetAuthForm = React.lazy(() => import('./SetAuthForm'));


let roleSelect = {}
export default function Index() {
  const [columns, setColumns] = useState([])
  const [loading, setLoading] = useState(false)
  const [roles, setRoles] = useState([])
  const [role, setRole] = useState({})
  const [showModal, setModalshow] = useState('0')//0: all close 1:1 open 2:2open
  const [form, setForm] = useState('')
  const [checkedKeys, setCheckedKeys] = useState([])
  const [resetKey, setResetKey] = useState(0)

  const initColumns = () => {
    setColumns([
      {
        title: 'Role name',
        dataIndex: 'name',
      },
      {
        title: 'Create time',
        dataIndex: 'create_time',
      },
      {
        title: 'Rate',
        dataIndex: 'rate',
      },
      {
        title: 'Authority time',
        dataIndex: 'auth_time',
      },
      {
        title: 'Authorizer',
        dataIndex: 'auth_name',
      },
      {
        title: 'Operation',
        align: "center",
        width: '10%',
        //category is the object of each row
        render: (category) => (
          <div style={{ marginLeft: '-20px' }}>
            <LinkButton style={{ margin: '0 20px' }} onClick={() => showUpdateRoleName(category)}>update</LinkButton>
            <LinkButton style={{ margin: '0 20px' }} onClick={() => handleDeleteRoleName(category)}>delete</LinkButton>
          </div>
        )
      }
    ])
  }

  //checkbox get every row object
  const onRow = (role) => {

    return {
      onClick: event => {
        roleSelect = role
        setRole(role)
      }
    }
  }

  const handleRowSelection = (selectedRowKeys, selectedRows) => {
    setRole(selectedRows[0]);
  };

  const showAddRole = () => {
    setModalshow('1')
  }
  const showUpdateRole = () => {
    setModalshow('2')
  }
  const showUpdateRoleName = (category) => {
    setRole(category)
    roleSelect = category
    setModalshow('3')
  }

  const handleOk = async () =>{
      setModalshow('0')
      const res = await reqDeleteRole(role._id)
      const data = res.data
      if (data.status === 0) {
        message.success('delete role successfully!')
        getRoles()
        setRole({})
      } else {
        message.error('delete role failed!')
      }
    }

  //onOk
  const updateRoleName = async () => {
    setModalshow('0')
    const res = await reqUpdateRoleName(role._id, form.getFieldsValue().rate, form.getFieldsValue().name)
    const data = res.data
    if (data.status === 0) {
      message.success('update role name successfully!')
      getRoles()
      form.resetFields()
    } else {
      message.error('update role name failed!')
    }
  }

  const handleDeleteRoleName = (category) => {
    setRole(category)
    roleSelect = category
    setModalshow("4")
  }

  const addRole = async () => {
    setModalshow('0')
    const res = await reqAddRole(form.getFieldsValue().name, form.getFieldsValue().rate, formateDate(Date.now()))
    const data = res.data
    if (data.status === 0) {
      setRoles((prevRoles) => [...prevRoles, data.data])
      getRoles()
      form.resetFields()
      message.success('add role successfully!')
    } else {
      message.error('add role failed!')
    }

  }

  const updateRoleAuth = async () => {
    setModalshow('0')
    if (checkedKeys.length !== 0) {
      const res = await reqUpdateRoleAuth(role._id, checkedKeys, formateDate(Date.now()))
      const data = res.data
      if (data.status === 0) {
        message.success('update auth successfully!')
        getRoles()
        setResetKey(prevKey => prevKey + 1)
      } else {
        message.success('update auth failed!')
      }
    }
  }

  const handleCancelAuth = () => {
    setModalshow('0')
    setResetKey(prevKey => prevKey + 1)
  }

  const handleCancel = () => {
    setModalshow('0')
    form.resetFields()
  }
  const handleCancelDelete = () =>{
    setModalshow('0')
  }
  const getCheck = (checkedKeys) => {
    if (!checkedKeys || !Array.isArray(checkedKeys) || checkedKeys.length === 0) {
      console.warn('Invalid or empty checkedKeys');
      // Handle the error case as you see fit
      return;
    }
    setCheckedKeys(checkedKeys)
  }

  const getForm = (form) => {
    setForm(form);
  };

  const getRoles = async () => {
    setLoading(true)
    const result = await reqRoles()
    setLoading(false)
    const data = result.data
    if (data.status === 0) {
      //get data arr
      setRoles(data.data)
    } else {
      message.error('fail to get role list!')
    }
  }

  useEffect(() => {
    initColumns()
  }, [])

  useEffect(() => {
    getRoles()
  }, [checkedKeys])

  const title = (
    <span>
      <Button
        type='primary'
        onClick={showAddRole}
        style={{ marginRight: '10px' }}>
        <PlusOutlined />
        add role
      </Button>
      <Button type='primary'
        disabled={role._id ? false : true}
        onClick={showUpdateRole}
      >
        <StopOutlined />
        set role authority
      </Button>
    </span>

  )
  return (
    <Suspense fallback={<div>Loading...</div>}>
    <Card
      title={title}
      style={{
        width: '100%'
      }}
    >
      <Table
        rowKey='_id'
        loading={loading}
        dataSource={roles}
        columns={columns}
        rowSelection={{ type: 'radio', selectedRowKeys: [role._id], onChange: handleRowSelection }}
        onRow={onRow}
        pagination={{ defaultPageSize: 5, showQuickJumper: true }} />
      <Modal title="Add role"
        open={showModal === '1'}
        onOk={addRole}
        onCancel={handleCancel}>
        <AddRoleForm
          getForm={getForm}
        />
      </Modal>
      <Modal title="Update role authority"
        open={showModal === '2'}
        onOk={updateRoleAuth}
        onCancel={handleCancelAuth}>
        <SetAuthForm
          role={role}
          getCheck={getCheck}
          resetFormKey={resetKey}
        />
      </Modal>
      <Modal title="Update role name"
        open={showModal === '3'}
        onOk={updateRoleName}
        onCancel={handleCancel}>
        <AddRoleForm
          role={role}
          getForm={getForm}
        />
      </Modal>
      <Modal
        title="Do you want to delete this role?"
        open={showModal === '4'}
        onOk={handleOk}
        onCancel={handleCancelDelete}
        icon={<ExclamationCircleFilled />}
        width="370px"
      />
    </Card>
    </Suspense>
  )
}