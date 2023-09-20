import { PlusOutlined, ExclamationCircleFilled, SearchOutlined } from '@ant-design/icons'
import React from 'react'
import { useState, useEffect } from 'react'
import { Card, Table, Button, message, Modal, Select, Input } from 'antd'
import { formateDate } from '../../utils/dateUtils'
import { PAGE_SIZE } from '../../utils/constants'
import LinkButton from '../../components/LinkButton'
import { reqRoles, reqAddEmployee, reqUpdateEmployee, reqDeleteEmployee, reqEmployeesSearch } from '../../api'
import AddUpdateForm from './AddUpdateForm'



export default function Index() {
    const [columns, setColumns] = useState([])
    const [loading, setLoading] = useState(false)
    const [employees, setEmployees] = useState([])
    const [roles, setRoles] = useState([])
    const [showModal, setModalshow] = useState('0')//0: all close 1:1 
    const [form, setForm] = useState({})
    const [employeeSelected, setEmployeeSelected] = useState({})
    const [searchType, setSearchType] = useState('*')
    const [searchName, setSearchName] = useState('*')
    const [selectTrigger, setSelectTrigger] = useState(false);

    const initColumns = () => {
        setColumns([
            {
                title: 'Name',
                dataIndex: 'username',
            },
            {
                title: 'Email',
                dataIndex: 'email',
            },
            {
                title: 'Phone number',
                dataIndex: 'phone',
            },
            {
                title: 'Register time',
                dataIndex: 'create_time',
            },
            {
                title: (
                    <Select
                        style={{ marginRight: '10px', width: '150px' }}
                        defaultValue='*'
                        onChange={handleSelectChange}
                    >
                        <Select.Option value='*'>Role</Select.Option>
                        {roles.map((role, index) => (
                            <Select.Option key={role._id} value={role._id}>{role.name}</Select.Option>
                        ))}
                    </Select>
                ),
                align: 'center',
                dataIndex: 'role_id',
                render: (role_id) => {
                    const role = roles.find(role => role._id === role_id);
                    return role ? role.name : 'Not found';
                }
            },
            {
                title: 'Operation',
                align: 'center',
                width: '12%',
                //category is the object of each row
                render: (employeeSelected) => (
                    <span >
                        <LinkButton style={{ margin: '0 5px' }} onClick={() => showUpdateRole(employeeSelected)}>update</LinkButton>
                        <LinkButton style={{ margin: '0 5px' }} onClick={() => handleDeleteEmployee(employeeSelected)}>delete</LinkButton>
                    </span>
                )
            }
        ])
    }

    const showAddRole = () => {
        setModalshow('1')
    }

    const showUpdateRole = (employeeSelected) => {
        setEmployeeSelected(employeeSelected)
        setModalshow('2')
    }
    
    //onOk
    const addUpdateEmployee = async () => {
        const employeeTemp = form.getFieldsValue()
        form.resetFields()
        delete employeeTemp.prefix
        employeeTemp.create_time = formateDate(Date.now())
        employeeTemp.phone = parseInt(employeeTemp.phone, 10)

        if (employeeSelected && Object.keys(employeeSelected).length > 0) {
            //modification
            const res = await reqUpdateEmployee(employeeSelected._id, employeeTemp)
            const data = res.data
            if (data.status === 0) {
                //get data arr
                getEmployee()
                message.success('update employee info successfully!')
            } else {
                message.error('fail to update employee info!')
            }
        } else {

            const res = await reqAddEmployee(employeeTemp)
            const data = res.data
            if (data.status === 0) {
                //get data arr
                getEmployee()
                message.success('add employee successfully!')
            } else {
                message.error('fail to add employee')
            }
        }
        setModalshow('0')
    }
    
    const handleOk = async () =>{
        setModalshow('0')
        const res = await reqDeleteEmployee(employeeSelected._id)
        const data = res.data
        if (data.status === 0) {
            getEmployee()
            setEmployeeSelected({})
            message.success('delete employee successfully!')
        } else {
            message.error('delete employee failed!')
        }
    }

    const handleCancelDelete = async () => {
        setModalshow('0')
    }

    const handleDeleteEmployee = (employeeSelected) => {
        setEmployeeSelected(employeeSelected)
        setModalshow('4')
    }

    const handleCancel = () => {
        setModalshow('0')
        form.resetFields()
    }

    const getForm = (form) => {
        setForm(form);
    };
    //get onchange value under contral
    const handleSelectChange = (value) => {
        setSearchType('role_id')
        setSearchName(value)
        setSelectTrigger(prev => !prev)
    }

    const handleInputChange = (e) => {
        setSearchType('username')
        setSearchName(e.target.value)
    }

    const getEmployee = async () => {
        setLoading(true)
        const result = await reqEmployeesSearch(searchType, searchName)
        setLoading(false)
        const data = result.data
        if (data.status === 0) {
            //get data arr
            setEmployees(data.data)
        } else {
            message.error('fail to get role list!')
        }
    }
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
    //only once
    useEffect(() => {
        getRoles()
    }, [])
    useEffect(() => {
        initColumns()
    }, [roles])

    useEffect(() => {
        getEmployee()
    }, [selectTrigger])

    const title = (
        <span>

            <Input placeholder="search employee name"
                style={{ marginRight: '10px', width: '200px' }}
                onChange={handleInputChange}
            />
            <Button type="primary"
                style={{ width: '120px' }}
                onClick={() => {
                    setSelectTrigger(prev => !prev)
                }}
            >
                <SearchOutlined />
                search
            </Button>
        </span>
    )
    const extra = (
        <span>
            <Button
                type='primary'
                onClick={showAddRole}
                style={{ marginRight: '10px' }}>
                <PlusOutlined />
                add employee
            </Button>
        </span>
    )
    return (
        <Card
            title={title}
            extra={extra}
            style={{
                width: '100%'
            }}
        >
            <Table
                rowKey='_id'
                loading={loading}
                dataSource={employees}
                columns={columns}
                pagination={{
                    defaultPageSize: PAGE_SIZE,
                    showQuickJumper: true,
                }} />
            <Modal title='add employee'
                open={showModal === '1'}
                onOk={addUpdateEmployee}
                onCancel={handleCancel}>
                <AddUpdateForm
                    getForm={getForm}
                    roles={roles}
                />
            </Modal>
            <Modal title='update employee infomation'
                open={showModal === '2'}
                onOk={addUpdateEmployee}
                onCancel={handleCancel}>
                <AddUpdateForm
                    employeeSelected={employeeSelected}
                    getForm={getForm}
                    roles={roles}
                />
            </Modal>
            <Modal
                title="Do you want to delete this employee?"
                open={showModal === '4'}
                onOk={handleOk}
                onCancel={handleCancelDelete}
                icon={<ExclamationCircleFilled />}
                width="370px"
            />
        </Card>
    )
}